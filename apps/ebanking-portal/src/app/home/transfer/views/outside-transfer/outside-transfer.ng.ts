import { Component, computed, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ScbMaxLengthDirective } from '@/core/directives/max-length.directive';
import { Beneficiary } from '@/home/beneficiary/models/models';
import { BeneficiaryDetails, TransferDetailsDTO } from '@/home/transfer-details/Model/transfer-details.model';
import { TransferRepeatService } from '@/home/transfer-details/transferRepeat.service';
import { TransferDataService } from '@/home/transfer/data/transfer-data.service';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Card } from '@scb/ui/card';
import { Error, FormField, Label } from '@scb/ui/form-field';
import { Icon } from '@scb/ui/icon';
import { Radio, RadioGroup } from '@scb/ui/radio';
import { Option, Select } from '@scb/ui/select';
import { CurrencyFlagField } from '../../components/currency-field/currency-flag-field';
import { TransferDescriptionField } from '../../components/description-field/description-field';
import { ScheduleTransfer } from '../../components/schedule-transfer/schedule-transfer.ng';
import { SelectAccountField } from '../../components/select-account-field/select-account-field.ng';
import { SelectBeneficiaryField } from '../../components/select-beneficiary-field/select-beneficiary-field';
import { SubmitButtonsFooter } from '../../components/submit-buttons-footer/submit-buttons-footer.ng';
import { TransactionSuccess } from '../../components/transaction-success/transaction-success.ng';
import { TransactionSummary } from '../../components/transaction-summary/transaction-summary.ng';
import { TransferNetworkFee } from '../../components/transfer-network/transfer-network.ng';
import { ChargeBearer, SelectAccountFieldProps, TransferNetwork, TransferType } from '../../model';
import { TransferService } from '../../transfer.service';

@Component({
  selector: 'outside-transfer-form',
  templateUrl: './outside-transfer.html',
  providers: [TransferService, TransferDataService],
  imports: [
    TranslocoDirective,
    Card,
    Icon,
    FormField,
    Error,
    ReactiveFormsModule,
    Select,
    Option,
    SelectAccountField,
    CurrencyFlagField,
    TransferDescriptionField,
    SelectBeneficiaryField,
    RadioGroup,
    Radio,
    Label,
    TransactionSummary,
    TransactionSuccess,
    TransferNetworkFee,
    ScbMaxLengthDirective,
    ScheduleTransfer,
    SubmitButtonsFooter,
  ],
  host: {
    class: 'col-span-12',
  },
})
export class OutsideTransferForm implements OnInit, OnDestroy {
  readonly transfer = inject(TransferService);
  readonly translateService = inject(TranslocoService);
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly transferRepeatService = inject(TransferRepeatService);

  readonly reasons = this.transfer.getReasons();
  readonly chargeBearers = this.transfer.getChargeBearers();
  readonly transferNetworks = this.transfer.getTransferNetworks();

  readonly transferCurrency = new FormControl('EGP', { validators: [Validators.required], nonNullable: true });
  readonly currencyField = this.transfer.currencyField;
  readonly descriptionField = new FormControl('', { nonNullable: true });
  readonly fromAccount = this.transfer.fromAccount;
  readonly toAccount = new FormGroup({
    accountNumber: new FormControl('', { nonNullable: true }),
    accountNickname: new FormControl('', { nonNullable: true }),
    accountType: new FormControl('', { nonNullable: true }),
  });
  readonly beneficiaryId = new FormControl('', { validators: [Validators.required], nonNullable: true });
  readonly transferNetwork = new FormControl<TransferNetwork>('ACH', { nonNullable: true });
  readonly form = new FormGroup({
    transferType: new FormControl<TransferType>('OUTSIDE', { nonNullable: true }),
    fromAccount: this.fromAccount,
    beneficiaryId: this.beneficiaryId,
    transferNetwork: this.transferNetwork,
    chargeBearer: new FormControl<ChargeBearer>('SENDER', { nonNullable: true }),
    transferReason: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    transferAmount: this.currencyField,
    transferCurrency: this.transferCurrency,
    description: this.descriptionField,
    token: new FormControl('123456', { nonNullable: true }),
    isSchedule: this.transfer.isSchedule,
    scheduleDto: this.transfer.scheduleDto,
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

    effect(() => {
      const data = this.repeatTransferData();
      if (data && Object.keys(data!).length > 0) {
        this.form.patchValue({
          transferType: data.transferType as TransferType,
          fromAccount: data.fromAccount,
          beneficiaryId: data.beneficiary?.beneficiaryId ?? (data as any)?.beneficiaryId,
          transferReason: data.transferReason,
          transferAmount: data.transferAmount,
          transferCurrency: data.transferCurrency,
          description: data.description ?? '',
          transferNetwork: data.transferNetwork as TransferNetwork,
          chargeBearer: data.chargeBearer as ChargeBearer,
        });
      }
      if (this.transfer.step() === 'form') {
        const data = this.transfer.value() as unknown as TransferDetailsDTO;
        if (data && Object.keys(data!).length > 0) {
          const ben = this.transfer.selectedBeneficiary();
          this.transferRepeatService.repeatTransferData.set(data as unknown as TransferDetailsDTO);
          const repeatData = this.transferRepeatService.repeatTransferData();
          if (repeatData && Object.keys(repeatData!).length > 0) {
            repeatData.beneficiary = ben as BeneficiaryDetails;
          }
        }
      }
    });
  }

  ngOnInit(): void {
    this.transfer.loadAllTransferData();
  }

  handleAccountSelected(value: SelectAccountFieldProps) {
    const account = value.accountSelected;
    this.fromAccount.setValue({
      accountNumber: account?.accountNumber || '',
      accountNickname: account?.nickname || '',
      accountType: account?.accountType || '',
    });
    this.transferCurrency.setValue(account?.currency || 'EGP');
    this.transfer.availableBalance.set(account?.availableBalance || 0);
    if (this.repeatTransferData()) {
      this.transfer.currencyField.setValue(this.repeatTransferData()?.transferAmount || 0);
    }
  }

  handleBeneficiaryChange(beneficiary?: Beneficiary) {
    this.transfer.selectedBeneficiary.set(beneficiary);
    if (!this.repeatTransferData()) {
      this.form.get('beneficiaryId')?.setValue(beneficiary?.beneficiaryId || '');
    }
  }

  handleRefreshRequest(request: { type: 'from' | 'to'; currency?: string }) {
    this.transfer.refreshAccountsData(request.type, request.currency);
  }

  ngOnDestroy(): void {
    this.transferRepeatService.clear();
  }
}
