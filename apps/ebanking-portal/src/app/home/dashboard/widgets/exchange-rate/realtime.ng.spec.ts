import { signal } from '@angular/core';
import { provideTestTransloco } from '@/config/transloco.testing';
import { fakeService, render, RenderResult } from '@scb/util/testing';
import { ExchangeRateService } from './exchange-rate.service';
import { RealTime } from './realtime.ng';

const exchangeRateServiceStub = fakeService(ExchangeRateService, {
  rates: signal([
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
    {
      currencyName: 'AED',
      buy: 0.0745795577432,
      sell: 0.0743091110401,
      trend: 'up',
      flagSrc: '',
    },
    {
      currencyName: 'SAR',
      buy: 0.0764076193678,
      sell: 0.0758990239385,
      trend: 'up',
      flagSrc: '',
    },
  ]),
});

describe('RealTime Rate', () => {
  let view: RenderResult<RealTime>;

  beforeEach(async () => {
    view = await render(RealTime, [provideTestTransloco(), exchangeRateServiceStub]);
    view.detectChanges();
  });

  it('should create', () => {
    expect(view.host).toBeTruthy();
  });
});
