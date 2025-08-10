import { NgTemplateOutlet } from '@angular/common';
import { HttpClient, HttpErrorResponse, httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AppBreadcrumbsComponent, CurrencyView, SoftTokenService } from '@/core/components';
import { RolePermissionDirective } from '@/core/directives/role-permission.directive';
import { minCurrencyAmountValidator } from '@/core/validators/custom-validators';
import { AccountInfo } from '@/home/transfer-details/Model/transfer-details.model';
import { AccountSelectedView } from '@/home/transfer/components/account-selected/account-selected-view.ng';
import { CurrencyInputField } from '@/home/transfer/components/currency-field/currency-input';
import { SelectAccountField } from '@/home/transfer/components/select-account-field/select-account-field.ng';
import { TransferDataService } from '@/home/transfer/data/transfer-data.service';
import { SelectAccountFieldProps } from '@/home/transfer/model';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { Card } from '@scb/ui/card';
import { Icon } from '@scb/ui/icon';
import { markControlsTouched } from '@scb/ui/input';
import { Separator } from '@scb/ui/separator';
import { CheckboxModule } from 'primeng/checkbox';
import {
  TERMS_AND_CONDITIONS_ID,
  TermsAndConditions,
} from '../../../core/components/terms-and-conditions/term-and-conditions.ng';
import { ProductFormContainer } from '../cd-form/product-form-container.ng';
import { ERROR_TYPE, InterestRates, ProductAccount, ProductResult } from '../model';
import { SubAccountCreateRequest } from './interface';
import { RoundIcon } from './round-icon.ng';

@Component({
  selector: 'app-current-account-interest',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TransferDataService],
  imports: [
    Card,
    Separator,
    CurrencyView,
    AppBreadcrumbsComponent,
    TranslocoDirective,
    Button,
    Icon,
    RoundIcon,
    NgTemplateOutlet,
    SelectAccountField,
    CurrencyInputField,
    CheckboxModule,
    AccountSelectedView,
    TermsAndConditions,
    RolePermissionDirective,
    ProductFormContainer,
    RouterLink,
  ],
  templateUrl: './current-account.html',
  host: {
    class: 'container-grid py-3xl px-3xl',
  },
})
export default class CurrentAccount {
  readonly http = inject(HttpClient);
  readonly softToken = inject(SoftTokenService);
  readonly transferData = inject(TransferDataService);
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly route = inject(ActivatedRoute);

  readonly categoryId = this.route.snapshot.params['id'];
  readonly detailsSource = httpResource<ProductResult<ProductAccount>>(() => {
    const _ = this.layoutFacade.language();
    return `/api/product/list/account-list/${this.categoryId}`;
  });

  readonly detail = computed(() => this.detailsSource.value()?.data.accountListResponse);
  readonly interestRates = computed(() => {
    const rates = this.detailsSource.value()?.data.interestRateResponses || ([] as InterestRates[]);
    return rates.map(x => ({ from: +x.from, to: +x.to, interestRate: +x.interestRate }));
  });

  readonly availableBalance = signal<number>(0);
  readonly isError = signal<ERROR_TYPE>(undefined);
  readonly fromAccount = signal<AccountInfo | null>(null);
  readonly currency = signal('EGP');
  readonly withInterest = computed(() => this.detail()?.interestType === 'Interest');
  readonly steps = signal<'form' | 'review' | 'completed'>('form');
  readonly amount = new FormControl('', { validators: [Validators.required], nonNullable: true });
  readonly acceptTerms = new FormControl(false, { validators: [Validators.requiredTrue], nonNullable: true });
  readonly frequency = new FormControl('', { validators: [Validators.required], nonNullable: true });
  readonly form = new FormGroup({
    amount: this.amount,
    currencyId: new FormControl('EGP', { validators: [Validators.required], nonNullable: true }),
    categoryId: new FormControl(this.categoryId, { validators: [Validators.required], nonNullable: true }),
    productId: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    drawdownAccount: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    accountType: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    frequency: this.frequency,
    isChequebookAvailable: new FormControl(false, { validators: [Validators.required], nonNullable: true }),
    acceptTerms: this.acceptTerms,
  });

  readonly fromAccountsLoading = this.transferData.fromAccountsLoading;
  readonly fromAccountsData = this.transferData.fromAccountsData;
  readonly fromAccountsError = this.transferData.fromAccountsError;
  readonly loading = signal(false);
  private readonly amountChanges = toSignal(this.amount.valueChanges, { initialValue: '0' });
  readonly interestPercentage = computed(() => {
    const rates = this.interestRates();
    const amount = +(this.amountChanges() || '0');

    return rates.find(x => x.to > amount)?.interestRate;
  });
  readonly minAmountValue = computed(() => {
    const minimumDeposit = (this.detail()?.minimumDeposit || '0').split(' ')[0] || 0.01;
    return +minimumDeposit;
  });
  readonly termsType = TERMS_AND_CONDITIONS_ID.SUB_ACCOUNT_TNC;

  constructor() {
    this.transferData.loadAccountsData('EGP');

    effect(() => {
      const value = this.detail();
      if (value) {
        this.form.setValue({
          amount: this.amount.value,
          currencyId: value.currency || '',
          categoryId: value.categoryId,
          productId: value.productId,
          drawdownAccount: this.form.controls.drawdownAccount.value,
          accountType: value.accountType,
          frequency: value.frequency || '',
          isChequebookAvailable: value.checkBookAvailable,
          acceptTerms: this.acceptTerms.value,
        });

        this.updateValidators(this.frequency, value.interestType === 'Interest', [Validators.required]);
      }
    });

    effect(() => {
      const balance = this.availableBalance();
      const validators = [Validators.required, minCurrencyAmountValidator(this.minAmountValue())];
      if (balance) {
        validators.push(Validators.max(balance));
      }
      this.updateValidators(this.amount, true, validators);
    });
  }

  updateValidators(control: FormControl, required: boolean | undefined, validators: any[]) {
    control.setValidators(required ? validators : []);
    control.updateValueAndValidity();
  }

  handleAccountSelected(data: SelectAccountFieldProps) {
    const account = data.accountSelected;
    this.fromAccount.set({ ...account, accountNickname: account.nickname });
    this.availableBalance.set(account?.availableBalance || 0);
    this.form.controls.drawdownAccount.setValue(account.accountNumber);
  }

  goBack() {
    this.steps.set('form');
  }

  next() {
    switch (this.steps()) {
      case 'review':
        // handle soft token
        this.softToken.open(this.loading.asReadonly(), this.save);
        break;
      default: {
        const isInvalid = this.form.invalid;
        console.log('REQUEST', this.getRequest(''));
        if (isInvalid) {
          return markControlsTouched(this.form, { dirty: true, touched: true });
        }
        this.steps.set('review');
        break;
      }
    }
  }

  private getRequest(token: string) {
    const value = this.form.getRawValue();
    const request: SubAccountCreateRequest = {
      token,
      currencyId: value.currencyId,
      amount: +value.amount,
      productId: value.productId,
      categoryId: value.categoryId,
      debitAccountNumber: value.drawdownAccount,
      accountType: value.accountType,
      frequency: value.frequency,
      isChequebookAvailable: value.isChequebookAvailable,
    };
    return request;
  }

  save = (token: string) => {
    const request = this.getRequest(token);
    this.loading.set(true);
    this.http.post<{ status: string; message: string }>(`/api/product/create/sub-account`, request).subscribe({
      next: res => {
        this.steps.set('completed');
        this.loading.set(false);
        this.softToken.closeAll();
        if (res.status === 'Failed') {
          this.isError.set('API');
        }
      },
      error: (err: HttpErrorResponse) => {
        this.steps.set('completed');
        let errorType: ERROR_TYPE = undefined;
        if (err.status !== 400) {
          errorType = 'API';
        } else if (err.status === 400) {
          if ('PROD-124' === err.error.code) {
            errorType = 'INSUFFICIENT_BALANCE';
          } else if (['PROD-101', 'PROD-102'].includes(err.error.code)) {
            errorType = 'TOKEN';
          }
        }
        this.isError.set(errorType);
        this.loading.set(false);
        this.softToken.closeAll();
      },
    });
  };
}
