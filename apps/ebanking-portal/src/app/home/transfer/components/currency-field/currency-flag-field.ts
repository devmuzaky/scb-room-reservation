import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  signal,
  untracked,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { ToasterService } from '@/core/components';
import { CURRENCY_FLAG } from '@/home/dashboard/model/constants';
import { ExchangeRateService, ExchangeRateType } from '@/home/dashboard/widgets/exchange-rate/exchange-rate.service';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Icon } from '@scb/ui/icon';
import { TransferService } from '../../transfer.service';
import { CurrencyInputField } from './currency-input';

@Component({
  selector: 'app-currency-flag-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ExchangeRateService],
  imports: [CurrencyInputField, Icon, TranslocoDirective],
  template: `<div
    *transloco="let t; prefix: 'transfer.currencyField'"
    class="gap-xl flex w-full flex-col items-center justify-center md:flex-row md:items-start">
    <app-currency-input-field
      [control]="control()"
      [currency]="currency()"
      [placeholder]="t('transferAmount')"
      (focused)="focused.set('from')"
      [hint]="fromHint()" />
    @if (!isEGP()) {
      <icon
        name="exchange"
        class="h-4xl text-icon-always-white bg-button-icon-disabled-ghost p-md w-4xl flex-none rotate-90 rounded-full md:mt-2.5" />
      <app-currency-input-field
        [control]="toControl"
        [placeholder]="t('equivalent')"
        (focused)="focused.set('to')"
        currency="EGP" />
    }
  </div>`,
  host: {
    class: 'flex w-full flex-col gap-sm',
  },
})
export class CurrencyFlagField {
  readonly erService = inject(ExchangeRateService);
  readonly transfer = inject(TransferService);
  readonly toaster = inject(ToasterService);
  readonly transloco = inject(TranslocoService);

  readonly control = input.required<FormControl<number>>();
  readonly toControl = new FormControl<number>(0);
  readonly currency = input.required({ transform: (v: string) => v.toUpperCase() });

  readonly fromHint = computed(() =>
    !this.isEGP() ? `1 ${this.currency()} = ${this.oneCurrencyValue()} ${this.erService.toCurrency()}` : '',
  );
  readonly value = signal(0);
  readonly isEGP = computed(() => this.currency() === 'EGP');
  // Whenever currency changes we need to reset
  readonly focused = linkedSignal({ source: this.isEGP, computation: () => <'from' | 'to'>'from' });

  readonly flag = computed(() => `icons/countries/${CURRENCY_FLAG[this.currency()]}.svg`);

  readonly selectedFromCurrency = computed(() => {
    const r = this.erService.rates();
    return r.find(x => x.currencyName === this.currency())!;
  });
  readonly selectedToCurrency = computed(() => {
    const r = this.erService.rates();
    return r.find(x => x.currencyName === this.erService.toCurrency())!;
  });
  // readonly toValue = computed(() => this.convertToValue(this.value(), 2));

  readonly oneCurrencyValue = computed(() => this.convertToValue(1));
  readonly toValueChange = toSignal(this.toControl.valueChanges);

  constructor() {
    this.erService.callApi.set(computed(() => !this.isEGP()));
    // reset currency fields after selecting account to avoid validation error
    let lastValue: any = undefined;
    this.transfer.fromAccount.valueChanges.subscribe(res => {
      const ac = lastValue?.accountNumber;
      lastValue = res;
      if (ac === res?.accountNumber) return;

      this.toControl.setValue(0);
      this.control()?.setValue('' as any);
      this.control()?.markAsPristine();
    });

    effect(cleanup => {
      const sub = this.control().valueChanges.subscribe(res => {
        this.value.set(res);
      });
      cleanup(() => sub.unsubscribe());
    });

    effect(() => {
      const v = this.value();
      if (untracked(this.focused) === 'from') {
        this.toControl.setValue(this.convertToValue(v, 2));
      }
    });

    effect(() => {
      const v = this.toValueChange();
      if (untracked(this.focused) === 'to') {
        this.control().setValue(this.convertToValue(v || 0, 2, true));
      }
    });

    effect(() => {
      const prevValue = this.transfer.exchangeApiFailed();
      const isFailed = this.erService.isLoading() ? false : this.erService.error();
      this.transfer.exchangeApiFailed.set(!!isFailed);
      if (isFailed && !prevValue) {
        this.toaster.showError({
          summary: this.transloco.translate('transfer.currencyField.apiError'),
          detail: this.transloco.translate('transfer.currencyField.apiErrorDetail'),
        });
      }
    });
  }

  private convertToValue(fromValue = 0, decimals = 4, reverseCalculation = false) {
    if (!this.selectedFromCurrency() || !this.selectedToCurrency()) return 0;
    return this.transferExchangeRate(
      fromValue,
      decimals,
      this.selectedFromCurrency(),
      this.selectedToCurrency(),
      reverseCalculation,
    );
  }

  transferExchangeRate(
    fromValue = 0,
    decimals = 4,
    fromCurrency?: ExchangeRateType,
    toCurrency?: ExchangeRateType,
    reverse = false,
  ) {
    fromValue = +fromValue.toString().replace(new RegExp(/[\\d,]/, 'g'), '');
    let value = 0;
    if (!fromCurrency || !toCurrency) {
      return 0;
    } else if (toCurrency.currencyName === 'EGP') {
      // Any to EGP conversion
      value = reverse ? fromValue * fromCurrency.buy : fromValue / fromCurrency.buy;
    } else if (fromCurrency.currencyName === 'EGP') {
      // EGP to any conversion
      // Not supported yet
    } else {
      // Any to any conversion
      // Not supported yet
    }
    return +value.toString().slice(0, value.toString().indexOf('.') + decimals + 1);
  }
}
