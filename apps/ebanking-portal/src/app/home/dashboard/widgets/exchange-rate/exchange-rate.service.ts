import { httpResource } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { CURRENCY_FLAG } from '../../model/constants';

export interface ExchangeRateType {
  currencyName: string;
  buy: number;
  sell: number;
  trend: string;
}

export interface ExchangeRatesResponse {
  lastUpdated: string;
  rates: ExchangeRateType[];
}

export interface ExchangeRateWithFlags extends ExchangeRateType {
  flagSrc: string;
}

export function convertExchangeRate(
  fromValue = 0,
  decimals = 4,
  fromCurrency?: ExchangeRateType,
  toCurrency?: ExchangeRateType,
) {
  fromValue = +fromValue.toString().replace(new RegExp(/[\\d,]/, 'g'), '');
  // const fromCurrency = this.selectedFromCurrency();
  // const toCurrency = this.selectedToCurrency();
  let value = 0;
  if (!fromCurrency || !toCurrency) {
    return 0;
  } else if (toCurrency.currencyName === 'EGP') {
    // Any to EGP conversion
    value = fromValue / fromCurrency.buy;
  } else if (fromCurrency.currencyName === 'EGP') {
    // EGP to any conversion
    value = fromValue * toCurrency.sell;
  } else {
    // Any to any conversion
    const egp = fromValue / fromCurrency.buy;
    value = egp * toCurrency.sell;
  }
  return +value.toFixed(decimals);
}

@Injectable()
export class ExchangeRateService {
  readonly callApi = signal(signal(true).asReadonly());
  private readonly exchangeData = httpResource<ExchangeRatesResponse>(() => {
    return this.callApi()() ? `/api/dashboard/exchange-rate/fetch` : undefined;
  });

  readonly rates = computed(() => {
    const rates = this.value()?.rates || [];
    const withFlags = rates.map<ExchangeRateWithFlags>(x => ({
      ...x,
      flagSrc: `icons/countries/${CURRENCY_FLAG[x.currencyName]}.svg`,
    }));
    return [
      { currencyName: 'EGP', buy: 1, sell: 1, trend: 'up', flagSrc: `icons/countries/${CURRENCY_FLAG['EGP']}.svg` },
      ...withFlags,
    ];
  });

  readonly fromValue = signal(1);
  readonly fromCurrency = signal('USD');
  readonly toCurrency = signal('EGP');

  readonly value = this.exchangeData.value;
  readonly status = this.exchangeData.status;
  readonly error = this.exchangeData.error;
  readonly isLoading = this.exchangeData.isLoading;

  reload() {
    this.exchangeData.reload();
  }

  swapCurrency() {
    const from = this.fromCurrency();
    const to = this.toCurrency();
    this.fromCurrency.set(to);
    this.toCurrency.set(from);
  }

  exchangeRate = convertExchangeRate;
}
