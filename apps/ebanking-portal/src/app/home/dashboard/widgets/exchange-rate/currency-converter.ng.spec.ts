import { signal } from '@angular/core';
import { fakeService, render, RenderResult } from '@scb/util/testing';
import { CurrencyConverter } from './currency-converter.ng';
import { convertExchangeRate, ExchangeRateService } from './exchange-rate.service';

const EXCHANGE_RATE = {
  rates: [
    { currencyName: 'EGP', buy: 1, sell: 1, trend: 'up', flagSrc: '' },
    {
      currencyName: 'USD',
      buy: 0.0202716399756,
      sell: 0.0202306291725,
      trend: 'up',
      flagSrc: '',
    },
    {
      currencyName: 'EUR',
      buy: 0.0185739652443,
      sell: 0.0184906455823,
      trend: 'up',
      flagSrc: '',
    },
  ],
  lastUpdated: '2025-02-26T06:58:50.553415815Z',
};

const exchangeRateServiceStub = fakeService(ExchangeRateService, {
  fromCurrency: signal('USD'),
  toCurrency: signal('EGP'),
  fromValue: signal(1),
  rates: signal(EXCHANGE_RATE.rates),
  exchangeRate: convertExchangeRate,
});

describe('CurrencyConverter Rate', () => {
  let view: RenderResult<CurrencyConverter>;

  beforeEach(async () => {
    view = await render(CurrencyConverter, [exchangeRateServiceStub]);
    view.detectChanges();
  });

  it('should create', () => {
    expect(view.host).toBeTruthy();
  });

  it('should handle the to value if from other currencies to EGP', () => {
    exchangeRateServiceStub.v.fromCurrency.set('USD');
    exchangeRateServiceStub.v.toCurrency.set('EGP');

    view.detectChanges();
    expect(view.host.toValue()).toBe(49.33);
  });

  it('should handle the to value if from EGP to other currencies', () => {
    exchangeRateServiceStub.v.fromCurrency.set('EGP');
    exchangeRateServiceStub.v.toCurrency.set('USD');

    view.detectChanges();
    expect(view.host.toValue()).toBe(0.02);
  });

  it('should handle the to value if from other to other currencies', () => {
    exchangeRateServiceStub.v.fromCurrency.set('EUR');
    exchangeRateServiceStub.v.toCurrency.set('USD');

    view.detectChanges();
    expect(view.host.toValue()).toBe(1.09);
  });
});
