import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { httpFakeResponse } from '@/models/api';
import { fakeService, render, RenderResult } from '@scb/util/testing';
import { ExchangeRateService } from './exchange-rate.service';

const exchangeRate = {
  rates: [
    {
      currencyName: 'USD',
      buy: 0.0202716399756,
      sell: 0.0202306291725,
      trend: 'up',
    },
    {
      currencyName: 'EUR',
      buy: 0.0185739652443,
      sell: 0.0184906455823,
      trend: 'up',
    },
  ],
  lastUpdated: '2025-02-26T06:58:50.553415815Z',
};

const httpStub = fakeService(HttpClient, {
  request: httpFakeResponse(exchangeRate),
});

@Component({ template: ``, providers: [ExchangeRateService] })
class TestComponent {}

describe('ExchangeRate service', () => {
  let view: RenderResult<TestComponent>;
  let service: ExchangeRateService;

  beforeEach(async () => {
    view = await render(TestComponent, [httpStub]);
    service = view.injectHost(ExchangeRateService);
  });

  it('should create', async () => {
    expect(service).toBeTruthy();
  });

  it('should handle rates properly', () => {
    expect(service.rates()).toEqual([
      {
        buy: 1,
        currencyName: 'EGP',
        flagSrc: 'icons/countries/Egypt.svg',
        sell: 1,
        trend: 'up',
      },
    ]);
  });

  it('should get data from api', async () => {
    await view.sleep(1);
    view.detectChanges();
    expect(service.rates()).toEqual([
      { buy: 1, currencyName: 'EGP', flagSrc: 'icons/countries/Egypt.svg', sell: 1, trend: 'up' },
      {
        buy: 0.0202716399756,
        currencyName: 'USD',
        flagSrc: 'icons/countries/United States.svg',
        sell: 0.0202306291725,
        trend: 'up',
      },
      {
        buy: 0.0185739652443,
        currencyName: 'EUR',
        flagSrc: 'icons/countries/European Union.svg',
        sell: 0.0184906455823,
        trend: 'up',
      },
    ]);
  });

  it('should call reload in resource', () => {
    jest.spyOn(service['exchangeData'], 'reload');

    service.reload();
    expect(service['exchangeData'].reload).toHaveBeenCalled();
  });

  it('should swap currency on calling swapCurrency', () => {
    expect(service.fromCurrency()).toBe('USD');
    expect(service.toCurrency()).toBe('EGP');

    service.swapCurrency();
    expect(service.fromCurrency()).toBe('EGP');
    expect(service.toCurrency()).toBe('USD');
  });

  it('should handle options values in exchange rate', () => {
    expect(service.exchangeRate()).toBe(0);

    expect(
      service.exchangeRate(
        50,
        2,
        {
          buy: 0.0202716399756,
          currencyName: 'USD',
          sell: 0.0202306291725,
          trend: 'up',
        },
        { buy: 1, currencyName: 'EGP', sell: 1, trend: 'up' },
      ),
    ).toBe(2466.5);
    expect(
      service.exchangeRate(
        1,
        2,
        { buy: 1, currencyName: 'EGP', sell: 1, trend: 'up' },
        {
          buy: 0.0202716399756,
          currencyName: 'USD',
          sell: 0.0202306291725,
          trend: 'up',
        },
      ),
    ).toBe(0.02);
  });
});
