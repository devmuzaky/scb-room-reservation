import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ScbMaxLengthDirective } from '@/core/directives/max-length.directive';
import { TransferDetailsDTO } from '@/home/transfer-details/Model/transfer-details.model';
import { TransferRepeatService } from '@/home/transfer-details/transferRepeat.service';
import { CharityCategories } from '@/home/transfer/components/charity-categories/charity-categories';
import { CharityField } from '@/home/transfer/components/charity-field/charity-field';
import { TransactionSuccess } from '@/home/transfer/components/transaction-success/transaction-success.ng';
import { TransactionSummary } from '@/home/transfer/components/transaction-summary/transaction-summary.ng';
import { TransferDataService } from '@/home/transfer/data/transfer-data.service';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Card } from '@scb/ui/card';
import { Icon } from '@scb/ui/icon';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { CurrencyFlagField } from '../../components/currency-field/currency-flag-field';
import { TransferDescriptionField } from '../../components/description-field/description-field';
import { SelectAccountField } from '../../components/select-account-field/select-account-field.ng';
import { SubmitButtonsFooter } from '../../components/submit-buttons-footer/submit-buttons-footer.ng';
import { CharityCategory, CharityItem, SelectAccountFieldProps, TransferType } from '../../model';
import { TransferService } from '../../transfer.service';

@Component({
  selector: 'charity-form',
  templateUrl: './charity-form.html',
  providers: [TransferService, TransferDataService],
  imports: [
    TranslocoDirective,
    FloatLabelModule,
    FormsModule,
    SelectModule,
    Card,
    Icon,
    SubmitButtonsFooter,
    DatePickerModule,
    ReactiveFormsModule,
    CurrencyFlagField,
    TransferDescriptionField,
    SelectAccountField,
    TransactionSuccess,
    TransactionSummary,
    ScbMaxLengthDirective,
    CommonModule,
    CharityField,
    CharityCategories,
  ],
  host: {
    class: 'col-span-12',
  },
})
export class CharityTransferForm implements OnInit, OnDestroy {
  readonly transfer = inject(TransferService);
  readonly translateService = inject(TranslocoService);
  readonly transferRepeatService = inject(TransferRepeatService);
  readonly layoutFacade = inject(LayoutFacadeService);

  readonly selectedCharity = signal<CharityItem | null>(null);
  readonly selectedCategory = signal<CharityCategory | null>(null);

  readonly currencyField = this.transfer.currencyField;
  readonly descriptionField = new FormControl('', { nonNullable: true });
  readonly fromAccount = this.transfer.fromAccount;

  readonly transferCurrency = new FormControl('EGP', { validators: [Validators.required], nonNullable: true });
  readonly open = signal(false);

  readonly form = new FormGroup({
    transferType: new FormControl<TransferType>('CHARITY', { nonNullable: true }),
    fromAccount: this.fromAccount,
    transferAmount: this.currencyField,
    transferCurrency: this.transferCurrency,
    description: this.descriptionField,
    isSchedule: new FormControl(false, { nonNullable: true }),
    token: new FormControl('12345678', { nonNullable: true }),
    charityTransferDto: new FormControl(null, { validators: [Validators.required], nonNullable: true }),
  });

  readonly repeatTransferData = computed(() => this.transferRepeatService.repeatTransferData());

  constructor() {
    effect(() => {
      const lookupData = this.transfer.transferLookupData();
      if (lookupData) {
        this.transfer.lookupData.set(lookupData);
      }
    });

    this.form.valueChanges.subscribe(() => {
      this.layoutFacade.setCanLeave(!this.form.dirty);
    });

    this.currencyField.setValidators([Validators.required, Validators.min(1)]);

    effect(() => {
      const data = this.repeatTransferData();
      if (data) {
        this.form.patchValue({
          transferType: data.transferType as TransferType,
          fromAccount: data.fromAccount,
          transferAmount: data.transferAmount,
          transferCurrency: data.transferCurrency,
          description: data.description ?? '',
        });
      }
      if (this.transfer.step() === 'form') {
        const data = this.transfer.value();
        if (data && Object.keys(data!).length > 0) {
          this.transferRepeatService.repeatTransferData.set(data as unknown as TransferDetailsDTO);
        }
      }
    });
  }

  ngOnInit(): void {
    this.transfer.loadAllTransferDataWithCharity();
  }

  handleAccountSelected(value: SelectAccountFieldProps) {
    if (value.type === 'from') {
      const account = value.accountSelected;
      this.transfer.selectedAccountNumber.set(account?.accountNumber);
      this.transfer.availableBalance.set(account.availableBalance);
      this.fromAccount.setValue({
        accountNumber: account?.accountNumber || '',
        accountNickname: account?.nickname || '',
        accountType: account?.accountType || '',
      });
      this.transferCurrency.setValue(account?.currency.toLocaleUpperCase());
    }

    if (this.repeatTransferData()) {
      this.transfer.currencyField.setValue(this.repeatTransferData()?.transferAmount || 0);
    }
    this.form.updateValueAndValidity();
  }

  onCharitySelected(charity: CharityItem) {
    this.selectedCharity.set(charity);
    this.selectedCategory.set(null);
    this.form.get('charityTransferDto')?.setValue(null);
  }

  onCategorySelected(category: CharityCategory) {
    this.selectedCategory.set(category);
    const charity = this.selectedCharity();

    if (charity && category) {
      const charityDto = {
        accountNumber: category.accountId,
        charityName: this.layoutFacade.language() === 'ar' ? charity.customerNameAR : charity.customerNameEN,
        charityType: this.layoutFacade.language() === 'ar' ? category.accountTitleAR : category.accountTitleEN,
        customerId: charity.customerId,
      };

      this.form.get('charityTransferDto')?.setValue(charityDto as any);
    }
  }

  handleRefreshRequest(request: { type: 'from' | 'to'; currency?: string }) {
    this.transfer.refreshAccountsData(request.type, request.currency);
  }

  ngOnDestroy(): void {
    this.transferRepeatService.clear();
  }
}
