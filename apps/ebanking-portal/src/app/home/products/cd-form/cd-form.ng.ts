import { NgTemplateOutlet } from '@angular/common';
import { HttpClient, HttpErrorResponse, httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { Radio, RadioGroup } from '@scb/ui/radio';
import { Separator } from '@scb/ui/separator';
import { CheckboxModule } from 'primeng/checkbox';
import {
  TERMS_AND_CONDITIONS_ID,
  TermsAndConditions,
} from '../../../core/components/terms-and-conditions/term-and-conditions.ng';
import { ERROR_TYPE, ProductCdDetail, ProductResult } from '../model';
import { RoundIcon } from '../sub-accounts/round-icon.ng';
import { CdCreateRequest } from './interface';
import { ProductFormContainer } from './product-form-container.ng';

@Component({
  selector: 'app-cd-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TransferDataService],
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
    RolePermissionDirective,
  ],
  templateUrl: './cd-form.html',
  host: {
    class: 'container-grid py-3xl px-3xl',
  },
})
export default class CdForm {
  readonly http = inject(HttpClient);
  readonly softToken = inject(SoftTokenService);
  readonly transferData = inject(TransferDataService);
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly route = inject(ActivatedRoute);

  readonly paramIds = (() => {
    const [id, cdId] = this.route.snapshot.params['id'].split('--') as string[];
    return { id, cdId };
  })();
  readonly detailsSource = httpResource<ProductResult<ProductCdDetail>>(() => {
    const _ = this.layoutFacade.language();
    return `/api/product/list/cd/${this.paramIds.id}?cdTdId=${this.paramIds.cdId}`;
  });

  readonly detail = computed(() => this.detailsSource.value()?.data);
  readonly steps = signal<'form' | 'review' | 'completed'>('form');
  readonly fromAccount = signal<AccountInfo | null>(null);
  readonly toAccount = signal<AccountInfo | null>(null);
  readonly accountType = signal<'1' | '2'>('1');

  readonly selectedToAccount = computed(() => (this.accountType() === '1' ? this.fromAccount() : this.toAccount()));

  readonly availableBalance = signal<number>(0);
  readonly currency = signal('USD');
  readonly withInterest = signal(true);
  readonly interestPercentage = signal<string | undefined>(undefined);
  readonly loading = signal(false);
  readonly isError = signal<ERROR_TYPE>(undefined);
  readonly termsAccepted = signal(false);

  readonly amount = new FormControl('', { validators: [Validators.required], nonNullable: true });
  readonly drawdownAccount = new FormControl('', { validators: [Validators.required], nonNullable: true });
  readonly anotherAccount = new FormControl('', { nonNullable: true });
  readonly acceptTerms = new FormControl(false, { validators: [Validators.requiredTrue], nonNullable: true });
  readonly form = new FormGroup({
    amount: this.amount,
    categoryId: new FormControl(this.paramIds.id, { validators: [Validators.required], nonNullable: true }),
    cdTdId: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    drawdownAccount: this.drawdownAccount,
    anotherAccount: this.anotherAccount,
    acceptTerms: this.acceptTerms,
  });

  readonly fromAccountsLoading = this.transferData.fromAccountsLoading;
  readonly fromAccountsData = this.transferData.fromAccountsData;
  readonly fromAccountsError = this.transferData.fromAccountsError;
  readonly minAmountValue = computed(() => {
    const minimumDeposit = this.detail()?.minimumDeposit.split(' ')[0] || 0.01;
    return +minimumDeposit;
  });

  readonly tcType = computed(() => {
    const data = this.detail();
    let type: any;
    if (data?.currency === 'USD' && data?.interestType === 'FIXED' && data?.duration == '36M') {
      type = TERMS_AND_CONDITIONS_ID.CORPORATE_CDS_3_YEARS_USD_FIXED_INTEREST;
    } else if (data?.currency === 'USD') {
      type = TERMS_AND_CONDITIONS_ID.CORPORATE_CDS_5_YEARS_USD;
    }
    return type;
  });

  constructor() {
    this.transferData.loadAccountsData('USD');

    effect(() => {
      const v = !this.detailsSource.isLoading() && this.detail();
      if (v && !this.detailsSource.error()) {
        this.form.controls.cdTdId.setValue(v.cdTdId);
        this.currency.set(v.currency);
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

    const account = this.form.controls.drawdownAccount;
    effect(() => {
      const res = this.accountType();
      //   this.updateValidators(this.form.controls.prinLiqAcct, res === '1', [Validators.required]);
      this.updateValidators(this.form.controls.anotherAccount, res !== '1', [Validators.required]);
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
    // this.form.controls.currencyId.setValue(account.currency || 'EGP');
    this.availableBalance.set(account?.availableBalance || 0);
    this.form.controls.drawdownAccount.setValue(account.accountNumber);
  }

  handleToAccountSelected(data: SelectAccountFieldProps) {
    const account = data.accountSelected;
    this.toAccount.set({ ...account, accountNickname: account.nickname });
    this.form.controls.anotherAccount.setValue(account.accountNumber);
  }

  handleRefreshRequest(request: { type: 'from' | 'to'; currency?: string }) {
    this.transferData.refreshAccountsData(request.type, request.currency);
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
          console.log('MARK INVALID');
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
    this.http.post<{ status: string; message: string }>(`/api/product/deposits/create/cd`, request).subscribe({
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

  private getRequest(token: string) {
    const value = this.form.getRawValue();
    const prinLiqAcct = this.accountType() === '1' ? value.drawdownAccount : value.anotherAccount;
    const request: CdCreateRequest = {
      token,
      cdTdId: value.cdTdId,
      amount: value.amount,
      categoryId: value.categoryId,
      drawdownAccount: value.drawdownAccount,
      prinLiqAcct,
    };
    return request;
  }
}
