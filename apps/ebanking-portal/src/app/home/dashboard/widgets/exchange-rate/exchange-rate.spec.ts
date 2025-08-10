import { Component, ResourceStatus, signal } from '@angular/core';
import { provideTestTransloco } from '@/config/transloco.testing';
import { fakeService, render, RenderResult } from '@scb/util/testing';
import { CurrencyConverter } from './currency-converter.ng';
import { ExchangeRate } from './exchange-rate';
import { ExchangeRateService } from './exchange-rate.service';
import { RealTime } from './realtime.ng';

const exchangeRateServiceStub = fakeService(ExchangeRateService, () => {
  const status = signal(ResourceStatus.Resolved);
  return {
    value: signal(undefined),
    status,
    reload: jest.fn(),
    __: { status },
  };
});

@Component({ selector: 'app-real-time', template: '' })
class TestRealTime {}

@Component({ selector: 'app-currency-converter', template: '' })
class TestCurrencyConverter {}

describe('ExchangeRate', () => {
  let view: RenderResult<ExchangeRate>;

  beforeEach(async () => {
    view = await render(ExchangeRate, [provideTestTransloco()], {
      providers: [exchangeRateServiceStub],
      components: [
        [{ imports: [RealTime] }, { imports: [TestRealTime] }],
        [{ imports: [CurrencyConverter] }, { imports: [TestCurrencyConverter] }],
      ],
    });
    view.detectChanges();
  });

  it('should create', () => {
    jest.spyOn(exchangeRateServiceStub.useFactory(), 'value').mockReturnValue({ lastUpdated: '', rates: [] });
    expect(view.host).toBeTruthy();
  });

  it('should handle widget status based on the exchange rate api status', () => {
    exchangeRateServiceStub._.status.set(ResourceStatus.Loading);
    expect(view.host.status()).toBe('loading');
    exchangeRateServiceStub._.status.set(ResourceStatus.Error);
    expect(view.host.status()).toBe('error');
    exchangeRateServiceStub._.status.set(ResourceStatus.Idle);
    expect(view.host.status()).toBe('default');
  });
});
