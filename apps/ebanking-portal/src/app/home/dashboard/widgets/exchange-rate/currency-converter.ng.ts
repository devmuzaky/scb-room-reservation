import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { IconButton } from '@scb/ui/button';
import { CurrencyField } from './currency-field.ng';
import { ExchangeRateService } from './exchange-rate.service';

@Component({
  selector: 'app-currency-converter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyField, IconButton],
  template: `<div class="gap-lg flex flex-col">
    <div class="gap-lg py-md flex flex-col">
      <app-currency-field
        [(value)]="erService.fromValue"
        [rates]="erService.rates()"
        [decimals]="0"
        [length]="10"
        [(selectedCurrency)]="erService.fromCurrency"
        [skipCurrency]="selectedToCurrency()"
        testId="ERATE_CONVERTER_SELECT_FROM_CURRENCY"
        valueTestId="ERATE_CONVERTER_SELECT_FROM_VALUE" />
      <div>
        <button
          scbIconButton="exchange"
          size="sm"
          class="exchange-btn text-icon-always-white mx-auto"
          data-testid="ERATE_CONVERTER_BTN_SWAP_CURRENCY"
          (click)="erService.swapCurrency()"></button>
      </div>
      <app-currency-field
        [value]="toValue()"
        [rates]="erService.rates()"
        [(selectedCurrency)]="erService.toCurrency"
        [readonly]="true"
        [skipCurrency]="selectedFromCurrency()"
        testId="ERATE_CONVERTER_SELECT_TO_CURRENCY"
        valueTestId="ERATE_CONVERTER_SELECT_TO_VALUE" />
    </div>
    <div
      class="gap-sm caption text-text-secondary flex items-center justify-center"
      dir="ltr">
      <div class="body-sm-s text-text-primary">1</div>
      <div>{{ erService.fromCurrency() }}</div>
      <div class="body-label-sm">=</div>
      <div
        class="body-sm-s text-text-primary"
        data-testid="ERATE_CONVERTER_TXT_EGP_VALUE">
        {{ oneCurrencyValue() }}
      </div>
      <div>{{ erService.toCurrency() }}</div>
    </div>
  </div>`,
  styles: `
    .exchange-btn {
      background:
        linear-gradient(180deg, rgba(241, 249, 254, 0.25) 7%, rgba(255, 255, 255, 0) 100%),
        var(--color-icon-brand, #00518d);
    }
  `,
})
export class CurrencyConverter {
  readonly erService = inject(ExchangeRateService);
  readonly selectedFromCurrency = computed(() => {
    const r = this.erService.rates();
    return r.find(x => x.currencyName === this.erService.fromCurrency())!;
  });
  readonly selectedToCurrency = computed(() => {
    const r = this.erService.rates();
    return r.find(x => x.currencyName === this.erService.toCurrency())!;
  });
  readonly toValue = computed(() => this.convertToValue(this.erService.fromValue(), 2));

  readonly oneCurrencyValue = computed(() => this.convertToValue(1));

  private convertToValue(fromValue = 0, decimals = 4) {
    // Remove , from the value to convert it number
    return this.erService.exchangeRate(fromValue, decimals, this.selectedFromCurrency(), this.selectedToCurrency());
  }
}
