import { CommonModule } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ScbMaxLengthDirective } from '@/core/directives/max-length.directive';
import { TransferDetailsDTO } from '@/home/transfer-details/Model/transfer-details.model';
import { TransferRepeatService } from '@/home/transfer-details/transferRepeat.service';
import { TransferDataService } from '@/home/transfer/data/transfer-data.service';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Alert } from '@scb/ui/alert';
import { Card } from '@scb/ui/card';
import { Icon } from '@scb/ui/icon';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { CurrencyFlagField } from '../../components/currency-field/currency-flag-field';
import { TransferDescriptionField } from '../../components/description-field/description-field';
import { ScheduleTransfer } from '../../components/schedule-transfer/schedule-transfer.ng';
import { SelectAccountField } from '../../components/select-account-field/select-account-field.ng';
import { SubmitButtonsFooter } from '../../components/submit-buttons-footer/submit-buttons-footer.ng';
import { TransactionSuccess } from '../../components/transaction-success/transaction-success.ng';
import { TransactionSummary } from '../../components/transaction-summary/transaction-summary.ng';
import { SelectAccountFieldProps, TransferDataResponse, TransferType } from '../../model';
import { TransferService } from '../../transfer.service';

@Component({
  selector: 'between-form',
  templateUrl: './between-form.html',
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
    Alert,
    ScheduleTransfer,
    CommonModule,
  ],
  host: {
    class: 'col-span-12',
  },
})
export class OwnAccountTransferForm implements OnInit, OnDestroy {
  readonly transfer = inject(TransferService);
  readonly translateService = inject(TranslocoService);
  readonly transferRepeatService = inject(TransferRepeatService);

  readonly layoutFacade = inject(LayoutFacadeService);

  readonly lookupData = httpResource<TransferDataResponse>(() => `/api/transfer/lookup/transfer-data`);

  readonly currencyField = this.transfer.currencyField;
  readonly descriptionField = new FormControl('', { nonNullable: true });
  readonly fromAccount = this.transfer.fromAccount;
  readonly toAccount = new FormGroup({
    accountNumber: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    accountNickname: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    accountType: new FormControl('', { validators: [Validators.required], nonNullable: true }),
  });

  readonly transferCurrency = new FormControl('EGP', { validators: [Validators.required], nonNullable: true });
  private readonly transferCurrencySignal = toSignal(this.transferCurrency.valueChanges, {
    initialValue: this.transferCurrency.value,
  });
  readonly open = signal(false);

  readonly form = new FormGroup({
    transferType: new FormControl<TransferType>('OWN', { nonNullable: true }),
    fromAccount: this.fromAccount,
    toAccount: this.toAccount,
    transferAmount: this.currencyField,
    transferCurrency: this.transferCurrency,
    description: this.descriptionField,
    token: new FormControl('123456', { nonNullable: true }),
    isSchedule: this.transfer.isSchedule,
    scheduleDto: this.transfer.scheduleDto,
  });

  readonly repeatTransferData = computed(() => this.transferRepeatService.repeatTransferData());

  constructor() {
    effect(() => this.transfer.lookupData.set(this.lookupData.value()));

    // Update leave guard when form changes
    this.form.valueChanges.subscribe(() => {
      this.layoutFacade.setCanLeave(!this.form.dirty);
    });

    effect(() => {
      const currency = this.transferCurrencySignal();
      const hasSubmitDate = this.transfer.scheduleDto.get('submitDate')?.value?.trim();
      if (currency !== 'EGP') {
        this.transfer.isSchedule.setValue(false);
        this.transfer.scheduleDto.reset();
        this.transfer.scheduleDto.get('submitDate')?.setErrors(null);
        this.transfer.scheduleDto.get('numberOfTransfers')?.setErrors(null);
      } else if (hasSubmitDate) {
        this.transfer.isSchedule.setValue(true);
      }
    });

    effect(() => {
      const data = this.repeatTransferData();
      if (data) {
        this.form.patchValue({
          transferType: data.transferType as TransferType,
          fromAccount: data.fromAccount,
          toAccount: data.toAccount,
          transferAmount: data.transferAmount,
          transferCurrency: data.transferCurrency,
          description: data.description ?? '',
          isSchedule: this.transfer.isSchedule?.value ?? false,
          scheduleDto: this.transfer.scheduleDto.value,
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
    this.transfer.loadAccountsData();
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
    } else {
      const account = value.accountSelected;
      this.transfer.selectedToAccountNumber.set(account?.accountNumber);
      this.toAccount.setValue({
        accountNumber: account?.accountNumber || '',
        accountNickname: account?.nickname || '',
        accountType: account?.accountType || '',
      });
    }
    if (this.repeatTransferData()) {
      this.transfer.currencyField.setValue(this.repeatTransferData()?.transferAmount || 0);
    }
    this.form.updateValueAndValidity();
  }

  handleRefreshRequest(request: { type: 'from' | 'to'; currency?: string }) {
    this.transfer.refreshAccountsData(request.type, request.currency);
  }

  ngOnDestroy(): void {
    //clear the repeat transfer state
    this.transferRepeatService.clear();
  }
}
