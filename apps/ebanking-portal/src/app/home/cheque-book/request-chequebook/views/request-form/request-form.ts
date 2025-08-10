import { httpResource } from '@angular/common/http';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyView, Skeleton, TERMS_AND_CONDITIONS_ID, TermsAndConditions } from '@/core/components';
import { AuthStore } from '@/core/store/auth-store';
import { ChequeBookDetail } from '@/home/cheque-book/chequebook-detail/chequebook-detail.ng';
import { FeesResponse } from '@/home/cheque-book/chequebook.model';
import { TransferRepeatService } from '@/home/transfer-details/transferRepeat.service';
import { TransferService } from '@/home/transfer/transfer.service';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective } from '@jsverse/transloco';
import { Alert } from '@scb/ui/alert';
import { Card } from '@scb/ui/card';
import { dialogPortal } from '@scb/ui/dialog';
import { Error, FormField, Label } from '@scb/ui/form-field';
import { Icon } from '@scb/ui/icon';
import { Option, Select } from '@scb/ui/select';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { ChequeBookService } from '../../chequebook.service';
import {
  LinkedAccountField,
  SelectChequeBookAccountFieldProps,
} from '../../components/linked-account-field/linked-account-field.ng';
import { SubmitChequeBookButtonsFooter } from '../../components/submit-chequebook-buttons-footer';

@Component({
  selector: 'request-form',
  templateUrl: './request-form.html',
  providers: [ChequeBookService, TransferService],
  imports: [
    TranslocoDirective,
    FloatLabelModule,
    SelectModule,
    Card,
    Icon,
    ReactiveFormsModule,
    FormField,
    Select,
    Label,
    FormsModule,
    DatePickerModule,
    Option,
    SubmitChequeBookButtonsFooter,
    Alert,
    Error,
    LinkedAccountField,
    ChequeBookDetail,
    CheckboxModule,
    TermsAndConditions,
    CurrencyView,
    Skeleton,
  ],
  host: {
    class: 'col-span-12',
  },
})
export class RequestNewChequeBookForm {
  readonly chequeBookService = inject(ChequeBookService);
  readonly authStore = inject(AuthStore);
  readonly transferRepeatService = inject(TransferRepeatService);
  readonly dialogPortal = dialogPortal();
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly detail = input();

  readonly lang = computed(() => this.layoutFacade.language());

  readonly numberOfChequebooks = signal<number | null>(null);
  readonly numberOfLeave = signal<number | null>(null);
  readonly accountNumber = signal<number | null>(null);

  readonly chequeBookType = computed(() => {
    return TERMS_AND_CONDITIONS_ID.CHEQUE_BOOK;
  });

  readonly chequeBookFeeResource = httpResource<FeesResponse>(() => {
    const chequebooks = this.numberOfChequebooks();
    const leaves = this.numberOfLeave();

    if (!chequebooks || !leaves) return undefined;

    return {
      url: `/api/product/chequebooks/fee`,
      method: 'POST',
      body: {
        numberOfChequebooks: chequebooks,
        numberOfLeaves: leaves,
      },
    };
  });

  readonly branchDetailResource = httpResource<{ branchName: string }>(() => {
    const accountNumber = this.accountNumber();

    if (!accountNumber) return undefined;

    return {
      url: `/api/product/chequebooks/branch-info`,
    };
  });

  readonly branchDetail = computed(() => this.branchDetailResource.value()?.branchName ?? '');
  readonly fees = computed(() => this.chequeBookFeeResource.value()?.fee);

  readonly debitAccount = this.chequeBookService.debitAccount;
  readonly linkedAccount = new FormGroup({
    accountNumber: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    accountNickname: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    categoryDescription: new FormControl('', { validators: [Validators.required], nonNullable: true }),
  });

  readonly open = signal(false);
  readonly hideBreadCrumb = input();
  readonly acceptTerms = new FormControl(false, { validators: [Validators.requiredTrue], nonNullable: true });
  readonly form = new FormGroup({
    feeDebitedAccountNumber: this.debitAccount,
    linkedAccount: this.linkedAccount,
    token: new FormControl('123456', { nonNullable: true }),
    chequebooksIssued: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    leavesCount: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    acceptTerms: this.acceptTerms,
    requestDate: new FormControl(new Date().toISOString()),
  });

  readonly numberOfChequeBooks = [1, 2, 3, 4, 5];
  readonly numberOfLeaves = [24, 48];

  constructor() {
    this.form.get('chequebooksIssued')?.valueChanges.subscribe(val => {
      this.numberOfChequebooks.set(val ? Number(val) : null);
    });

    this.form.get('leavesCount')?.valueChanges.subscribe(val => {
      this.numberOfLeave.set(val ? Number(val) : null);
    });

    this.form.get('linkedAccount')?.valueChanges.subscribe(val => {
      this.accountNumber.set(val.accountNumber ? Number(val.accountNumber) : null);
    });
    effect(() => {
      const value = this.fees();
      if (value !== undefined) {
        this.chequeBookService.feesAmount.set(value);
      }
      const branchDetail = this.branchDetail();
      if (branchDetail !== undefined) {
        this.chequeBookService.branchName.set(branchDetail);
      }
    });
  }

  handleAccountSelected(value: SelectChequeBookAccountFieldProps) {
    this.chequeBookService.isOVDAccount.set(value.accountSelected.OVD || false);
    if (value.type === 'linked') {
      const account = value.accountSelected;
      this.chequeBookService.selectedToAccountNumber.set(account?.accountNumber);
      this.linkedAccount.setValue({
        accountNumber: account?.accountNumber || '',
        accountNickname: account?.nickname || '',
        categoryDescription: account?.categoryDescription || '',
      });
    } else {
      const account = value.accountSelected;
      this.chequeBookService.selectedAccountNumber.set(account?.accountNumber);
      this.debitAccount.setValue({
        accountNumber: account?.accountNumber || '',
      });
    }
    const accountNumberControl = this.debitAccount.get('accountNumber');

    if (value.accountSelected?.OVD) {
      accountNumberControl?.setValidators([Validators.required]);
    } else {
      accountNumberControl?.clearValidators();
    }
    accountNumberControl?.updateValueAndValidity();

    this.form.updateValueAndValidity();
  }
}
