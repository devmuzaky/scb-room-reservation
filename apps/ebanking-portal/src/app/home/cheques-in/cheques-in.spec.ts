import { HttpClient } from '@angular/common/http';
import { Component, model, ResourceStatus, Signal, signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTestTransloco } from '@/config/transloco.testing';
import { AppLanguage } from '@/layout/layout-store';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { apiStatus, httpFakeResponse } from '@/models/api';
import { AuthStore, User } from '@/store/auth-store';
import { fakeService, render, RenderResult } from '@scb/util/testing';
import { ChequeInResponse, ChequesInTypes } from '../../home/dashboard/widgets/cheque-in/model';
import { WidgetStatus } from '../dashboard/dashboard-widget/dashboard-widget.ng';
import { ChequesInData } from './cheques-in';
import { ChequesInFilter } from './cheques-in-filter.ng';
import ChequesInTracker from './cheques-in.ng';

const httpClientStub = fakeService(HttpClient, {
  request: httpFakeResponse({
    collected: [],
    postDated: [],
    returned: [],
    lastUpdatedTimestamp: '',
    pagination: { pageSize: 10, pageStart: 0, totalPages: 10, totalSize: 30 },
  } as ChequeInResponse),
});

const LayoutFacadeStub = fakeService(LayoutFacadeService, {
  language: signal<AppLanguage>('en'),
  mobileMode: signal(false),
  isDarkTheme: signal(false),
});

const authStoreStub = fakeService(AuthStore, {
  user: signal({ username: '' } as User).asReadonly() as any,
});

const layoutServiceStub = fakeService(LayoutFacadeService, {
  mobileMode: signal(false),
});

const chequesInStub = fakeService(ChequesInData, {
  bankList: signal([]),
});

@Component({
  selector: 'app-cheques-in-filter',
  template: ``,
})
class ChequesFilterTest implements Partial<ChequesInFilter> {
  readonly status = model<ChequesInTypes[]>([]);
  readonly settlementDate = model<string>('');
  readonly draweeBank = model<string[]>([]);
}

describe('ChequesIn Tracker', () => {
  let view: RenderResult<ChequesInTracker>;

  beforeEach(async () => {
    view = await render(
      ChequesInTracker,
      [provideTestTransloco(), provideRouter([]), httpClientStub, authStoreStub, LayoutFacadeStub],
      {
        providers: [chequesInStub],
        components: [[{ imports: [ChequesInFilter] }, { imports: [ChequesFilterTest] }]],
      },
    );
  });

  it('should create', () => {
    view.detectChanges();
    expect(view.host).toBeTruthy();
  });

  it('should handle widget status based on the exchange rate api status', () => {
    const status = signal<ResourceStatus>(ResourceStatus.Loading);
    const host = view.host as unknown as {
      status: Signal<WidgetStatus>;
      chequesInData: { status: Signal<ResourceStatus> };
    };
    host.chequesInData.status = status;
    host.status = apiStatus(host.chequesInData.status);
    status.set(ResourceStatus.Loading);
    expect(host.status()).toBe('loading' as WidgetStatus);
    status.set(ResourceStatus.Error);
    expect(host.status()).toBe('error' as WidgetStatus);
    status.set(ResourceStatus.Idle);
    expect(host.status()).toBe('default' as WidgetStatus);
  });

  it('should call the api and set data', async () => {
    httpClientStub.v.request = httpFakeResponse(undefined);
    await view.whenStable();
    expect(view.host.totalRecords()).toBe(100);
    expect(view.host.cheques()).toEqual([]);
    expect(view.host.totalPages()).toBe(0);

    httpClientStub.v.request = httpFakeResponse({
      collected: [
        {
          chequeSerial: 'CHQ-16000006924',
          chequeValue: '1000000.00',
          draweeBank: 'Cairo Bank',
          payerName: 'Cairo Bank',
          accountNumber: '9998123123',
          currency: 'EGP',
          eventDate: '2025-03-20T08:35:00Z',
        },
      ],
      postDated: [
        {
          chequeSerial: 'CHQ-16000006924',
          chequeValue: '1000000.00',
          draweeBank: 'Cairo Bank',
          payerName: 'Cairo Bank',
          accountNumber: '9998123123',
          currency: 'EGP',
          eventDate: '2025-03-20T08:35:00Z',
        },
      ],
      returned: [
        {
          chequeSerial: 'CHQ-16000006924',
          chequeValue: '1000000.00',
          draweeBank: 'Cairo Bank',
          payerName: 'Cairo Bank',
          accountNumber: '9998123123',
          currency: 'EGP',
          eventDate: '2025-03-20T08:35:00Z',
        },
      ],
      lastUpdatedTimestamp: '',
      pagination: { pageSize: 10, pageStart: 0, totalPages: 10, totalSize: 30 },
    } as ChequeInResponse);
    view.host.chequesInData.reload();
    await view.whenStable();
    expect(view.host.totalRecords()).toBe(30);
    expect(view.host.cheques().length).toBe(3);
    expect(view.host.totalPages()).toBe(10);
  });

  it('should handle the page change', () => {
    jest.spyOn(view.host.chequesInData, 'reload');
    const value = { rows: 10, first: 1, page: 2 };
    view.host.onPageChange(value);
    expect({ first: view.host.first(), rows: view.host.rows(), page: view.host.pageNumber() - 1 }).toEqual(value);
    expect(view.host.chequesInData.reload).toHaveBeenCalled();
  });

  it('should reset the values on row change', () => {
    jest.spyOn(view.host.chequesInData, 'reload');
    const value = { rows: 10, first: 1, page: 2 };
    view.host.onPageChange(value);
    expect({ first: view.host.first(), rows: view.host.rows(), page: view.host.pageNumber() - 1 }).toEqual(value);
    expect(view.host.chequesInData.reload).toHaveBeenCalled();

    // change the rows value
    view.host.rows.set(20);
    expect(view.host.first()).toBe(0);
    expect(view.host.pageNumber()).toBe(1);
  });
});
