import { NgTemplateOutlet } from '@angular/common';
import { HttpClient, HttpErrorResponse, httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '@/auth/api/auth.service';
import {
  AppBreadcrumbsComponent,
  CurrencyView,
  SoftTokenService,
  TERMS_AND_CONDITIONS_ID,
  TermsAndConditions,
  ToasterService,
} from '@/core/components';
import { RolePermissionDirective } from '@/core/directives/role-permission.directive';
import { minCurrencyAmountValidator } from '@/core/validators/custom-validators';
import { AccountInfo } from '@/home/transfer-details/Model/transfer-details.model';
import { AccountSelectedView } from '@/home/transfer/components/account-selected/account-selected-view.ng';
import { CurrencyInputField } from '@/home/transfer/components/currency-field/currency-input';
import { SelectAccountField } from '@/home/transfer/components/select-account-field/select-account-field.ng';
import { TransferDataService } from '@/home/transfer/data/transfer-data.service';
import { SelectAccountFieldProps } from '@/home/transfer/model';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { Card } from '@scb/ui/card';
import { dialogPortal } from '@scb/ui/dialog';
import { FormField, Label } from '@scb/ui/form-field';
import { Icon } from '@scb/ui/icon';
import { markControlsTouched } from '@scb/ui/input';
import { Radio, RadioGroup } from '@scb/ui/radio';
import { Option, Select } from '@scb/ui/select';
import { Separator } from '@scb/ui/separator';
import { CheckboxModule } from 'primeng/checkbox';
import { ProductFormContainer } from '../cd-form/product-form-container.ng';
import {
  ERROR_TYPE,
  ProductResult,
  ProductTdDetail,
  TdCreateRequest,
  TDFixedInterestRateResponse,
  TDInterestRateResponse,
  TdTenorApiResponse,
} from '../model';
import { RoundIcon } from '../sub-accounts/round-icon.ng';

type Error_Type = undefined | 'API' | 'TOKEN';

@Component({
  selector: 'app-td-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TransferDataService, ToasterService],
  imports: [
    Card,
    Separator,
    CurrencyView,
    ReactiveFormsModule,
    AppBreadcrumbsComponent,
    TranslocoDirective,
    Button,
    SelectAccountField,
    CurrencyInputField,
    CheckboxModule,
    RoundIcon,
    Radio,
    RadioGroup,
    Icon,
    ProductFormContainer,
    NgTemplateOutlet,
    AccountSelectedView,
    RouterLink,
    TermsAndConditions,
    FormField,
    Label,
    Select,
    Option,
    RolePermissionDirective,
  ],
  templateUrl: './td-form.html',
  host: {
    class: 'container-grid py-3xl px-3xl',
  },
})
export default class TDForm {
  readonly http = inject(HttpClient);
  readonly softToken = inject(SoftTokenService);
  readonly transferData = inject(TransferDataService);
  readonly route = inject(ActivatedRoute);
  readonly translateService = inject(TranslocoService);
  private readonly authService = inject(AuthService);
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly toasterService = inject(ToasterService);

  readonly paramIds = (() => {
    const [id, tdId] = this.route.snapshot.params['id'].split('--') as string[];
    return { id, tdId };
  })();
  readonly detailsSource = httpResource<ProductResult<ProductTdDetail>>(() => {
    const _ = this.layoutFacade.language();
    return `/api/dashboard/product/td/${this.paramIds.id}?cdTdId=${this.paramIds.tdId}`;
  });

  readonly floatingInterestRatesSource = httpResource<TDInterestRateResponse>(() => {
    const tdType = this.detail()?.tdType;
    if (tdType !== 'FLOATING') return undefined;
    return { url: `/api/product/deposits/td/rates/floating` };
  });

  readonly tdTenorSource = httpResource<TdTenorApiResponse>(() => {
    return { url: `/api/product/deposits/td/tenor/floating` };
  });

  readonly fixedInterestRatesSource = httpResource<TDFixedInterestRateResponse>(() => {
    const categoryId = this.detail()?.categoryId;
    const currency = this.detail()?.currency;
    const tdType = this.detail()?.tdType;

    if (!categoryId || !currency || tdType !== 'FIXED') return undefined;

    return `/api/product/deposits/td/rates/fixed/${categoryId}/${currency}`;
  });

  protected isMaker(): boolean {
    const userRoles = this.authService.getRolesFromToken();
    return userRoles.includes('MAKER') && !userRoles.includes('SUPER_USER');
  }

  protected isChecker(): boolean {
    const userRoles = this.authService.getRolesFromToken();
    return userRoles.some(role => ['CHECKER_LEVEL_1', 'CHECKER_LEVEL_2', 'CHECKER_LEVEL_3'].includes(role));
  }

  readonly floatingInterestRates = computed(() => this.floatingInterestRatesSource.value()?.data);
  readonly fixedInterestRates = computed(() => this.fixedInterestRatesSource.value()?.data);
  readonly tdTenor = computed(() => this.tdTenorSource.value()?.data);

  readonly detail = computed(() => this.detailsSource.value()?.data);
  readonly steps = signal<'form' | 'review' | 'otp' | 'completed'>('form');
  readonly fromAccount = signal<AccountInfo | null>(null);
  readonly toAccount = signal<AccountInfo | null>(null);
  readonly accountType = signal<'1' | '2'>('1');

  readonly selectedToAccount = computed(() => (this.accountType() === '1' ? this.fromAccount() : this.toAccount()));

  readonly availableBalance = signal<number>(0);
  readonly currency = signal('EGP');
  readonly withInterest = signal(true);
  readonly fixedInterestPercentage = signal<number | 0>(0);
  readonly floatingInterestPercentage = signal<number | 0>(0);
  readonly loading = signal(false);
  readonly isError = signal<ERROR_TYPE>(undefined);
  readonly termsAccepted = signal(false);
  readonly requestData = signal<TdCreateRequest | undefined>(undefined);
  readonly interestRate = signal('');
  readonly tenor = signal('');

  readonly amount = new FormControl('', { validators: [Validators.required], nonNullable: true });
  readonly drawdownAccount = new FormControl('', { validators: [Validators.required], nonNullable: true });
  readonly anotherAccount = new FormControl('', { nonNullable: true });
  readonly acceptTerms = new FormControl(false, { validators: [Validators.requiredTrue], nonNullable: true });
  readonly form = new FormGroup({
    amount: this.amount,
    categoryId: new FormControl(this.paramIds.id, { validators: [Validators.required], nonNullable: true }),
    tdType: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    duration: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    currencyId: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    drawdownAccount: this.drawdownAccount,
    anotherAccount: this.anotherAccount,
    interestRate: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    acceptTerms: this.acceptTerms,
  });

  readonly fromAccountsLoading = this.transferData.fromAccountsLoading;
  readonly fromAccountsData = this.transferData.fromAccountsData;
  readonly fromAccountsError = this.transferData.fromAccountsError;
  readonly minAmountValue = computed(() => {
    const minimumDeposit = this.detail()?.minimumDeposit.split(' ')[0] || 0.01;
    return +minimumDeposit;
  });

  readonly tdType = computed(() => {
    const data = this.detail();
    let type: any;
    if (data?.currency === 'USD' && data?.interestType === 'FIXED') {
      type = TERMS_AND_CONDITIONS_ID.CORPORATE_FIXED_INTEREST_TD;
    } else {
      type = TERMS_AND_CONDITIONS_ID.CORPORATE_FLOATING_INTEREST_TD;
    }
    return type;
  });

  constructor() {
    this.transferData.loadAccountsData('EGP');

    effect(() => {
      const v = !this.detailsSource.isLoading() && this.detail();
      if (v && !this.detailsSource.error()) {
        this.form.controls.tdType.setValue(v.cdTdId);
        this.form.controls.interestRate.setValue(v.interestRate);
        this.form.controls.currencyId.setValue(v.currency);
        this.interestRate.set(v.interestRate);
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

    effect(() => {
      const v = this.detail();
      if (v) {
        const durationControl = this.form.get('duration');
        if (v.tdType === 'FLOATING') {
          durationControl?.setValidators(Validators.required);
        } else {
          durationControl?.clearValidators();
        }
        durationControl?.updateValueAndValidity();
      }
    });

    const account = this.form.controls.drawdownAccount;
    effect(() => {
      const res = this.accountType();
      this.updateValidators(this.form.controls.anotherAccount, res !== '1', [Validators.required]);
    });

    this.amount.valueChanges.subscribe(value => {
      const amountValue = Number(value);
      if (this.amount.invalid || isNaN(amountValue)) {
        this.fixedInterestPercentage.set(0);
        return;
      }
      this.fixedInterestPercentage.set(this.getFixedInterestRate(amountValue));
    });

    this.form.get('duration')?.valueChanges.subscribe(vale => {
      if (!vale) {
        return;
      }
      this.floatingInterestPercentage.set(this.getRateForByFrequency(vale));
      this.tenor.set(vale);
      this.interestRate.set(this.floatingInterestPercentage().toString());
    });
  }

  updateValidators(
    control: FormControl,
    required: boolean | undefined,
    validators: any[],
    otherValidators: any[] = [],
  ) {
    control.setValidators(required ? validators : otherValidators);
    control.updateValueAndValidity();
  }

  handleAccountSelected(data: SelectAccountFieldProps) {
    const account = data.accountSelected;
    this.fromAccount.set({ ...account, accountNickname: account.nickname });
    this.availableBalance.set(account?.availableBalance || 0);
    this.form.controls.drawdownAccount.setValue(account.accountNumber);
  }

  handleToAccountSelected(data: SelectAccountFieldProps) {
    const account = data.accountSelected;
    this.toAccount.set({ ...account, accountNickname: account.nickname });
    this.form.controls.anotherAccount.setValue(account.accountNumber);
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
        if (isInvalid) {
          return markControlsTouched(this.form, { dirty: true, touched: true });
        }
        this.steps.set('review');
        break;
      }
    }
  }

  save = (token: string) => {
    const request = this.getRequest(token);
    this.loading.set(true);
    this.http.post(`/api/product/deposits/create/td`, request).subscribe({
      next: res => {
        if (this.isChecker()) {
          this.toasterService.showSuccess({
            summary: this.translateService.translate('beneficiary.editForm.success'),
          });
        } else {
          this.steps.set('completed');
        }
        this.loading.set(false);
        this.softToken.closeAll();
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

  private getRequest(token: string) {
    const value = this.form.getRawValue();
    const prinLiqAcct = this.accountType() === '1' ? value.drawdownAccount : value.anotherAccount;
    const request: TdCreateRequest = {
      token,
      currencyId: value.currencyId,
      amount: value.amount,
      categoryId: value.categoryId,
      drawdownAccount: value.drawdownAccount,
      prinLiqAcct,
      selectedCategory: this.detail()?.tdType ?? '',
      duration: this.detail()?.tdType === 'FIXED' ? (this.detail()?.frequency ?? '') : value.duration,
      cdTdId: this.detail()?.cdTdId ?? '',
      ...(this.detail()?.tdType === 'FLOATING' && { tdRef: this.detail()?.tdRef }),
    };
    this.requestData.set(request);
    return request;
  }

  addPercentage(rate: string | undefined): string {
    if (!rate) return '';
    const parts = rate.split(' - ');
    return parts.map(p => p.trim() + '%').join(' - ');
  }

  private getRateForByFrequency(frequency: string): number {
    const allRates = this.floatingInterestRates();
    if (!allRates) return 0;

    const td = allRates.find(item => item.frequency === frequency);
    if (!td) return 0;

    const currencyBlock = td.currencyList.find(c => c.currency === 'EGP');
    if (!currencyBlock) return 0;

    const firstInterval = currencyBlock.intervals[0];
    return firstInterval ? Number(firstInterval.rate) : 0;
  }

  getFixedInterestRate(amount: number): number {
    const rates = this.fixedInterestRates();
    if (!rates) return 0;

    const matched = rates.find(rate => {
      const from = Number(rate.fromAmt);
      const to = Number(rate.toAmt);
      return amount >= from && amount <= to;
    });

    return matched ? Number(matched.interestRate) : 0;
  }

  get selectedDurationLabel(): string {
    const value = this.form.get('duration')?.value;
    const match = this.tdTenor()?.find(t => t.value === value);
    return match?.label ?? '';
  }
}
