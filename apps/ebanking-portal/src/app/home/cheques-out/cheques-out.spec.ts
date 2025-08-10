import { HttpClient } from '@angular/common/http';
import { Component, model, ResourceStatus, Signal, signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTestTransloco } from '@/config/transloco.testing';
import { AppLanguage } from '@/layout/layout-store';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { apiStatus, httpFakeResponse } from '@/models/api';
import { AuthStore, User } from '@/store/auth-store';
import { fakeService, render, RenderResult } from '@scb/util/testing';
import { WidgetStatus } from '../dashboard/dashboard-widget/dashboard-widget.ng';
import { ChequesOutRes, ChequesOutStatus } from '../dashboard/widgets/cheque-out/model';
import { ChequesOutFilter } from './cheques-out-filter.ng';
import ChequesOutTracker from './cheques-out.ng';

const httpClientStub = fakeService(HttpClient, {
  request: httpFakeResponse({
    cheques: [],
    lastUpdatedTimestamp: 1743617701,
    totalPages: 2,
    totalRecords: 20,
  } as ChequesOutRes),
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

@Component({
  selector: 'app-cheques-out-filter',
  template: ``,
})
class ChequesFilterTest implements Partial<ChequesOutFilter> {
  readonly status = model<ChequesOutStatus[]>([]);
  readonly settlementDate = model<string>('');
  readonly draweeBank = model<string>('');
}

describe('ChequesOut Tracker', () => {
  let view: RenderResult<ChequesOutTracker>;

  beforeEach(async () => {
    view = await render(
      ChequesOutTracker,
      [provideTestTransloco(), provideRouter([]), httpClientStub, authStoreStub, LayoutFacadeStub],
      {
        components: [[{ imports: [ChequesOutFilter] }, { imports: [ChequesFilterTest] }]],
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
      chequesOutData: { status: Signal<ResourceStatus> };
    };
    host.chequesOutData.status = status;
    host.status = apiStatus(host.chequesOutData.status);
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
    expect(view.host.totalRecords()).toBe(0);
    expect(view.host.cheques()).toEqual([]);
    expect(view.host.totalPages()).toBe(0);

    httpClientStub.v.request = httpFakeResponse({
      cheques: [],
      lastUpdatedTimestamp: 1743617701,
      totalPages: 2,
      totalRecords: 20,
    } as ChequesOutRes);
    view.host.chequesOutData.reload();
    await view.whenStable();
    expect(view.host.totalRecords()).toBe(20);
    expect(view.host.cheques()).toEqual([]);
    expect(view.host.totalPages()).toBe(2);
  });

  it('should handle the page change', () => {
    jest.spyOn(view.host.chequesOutData, 'reload');
    const value = { rows: 10, first: 1, page: 2 };
    view.host.onPageChange(value);
    expect({ first: view.host.first(), rows: view.host.rows(), page: view.host.pageNumber() - 1 }).toEqual(value);
    expect(view.host.chequesOutData.reload).toHaveBeenCalled();
  });

  it('should reset the values on row change', () => {
    jest.spyOn(view.host.chequesOutData, 'reload');
    const value = { rows: 10, first: 1, page: 2 };
    view.host.onPageChange(value);
    expect({ first: view.host.first(), rows: view.host.rows(), page: view.host.pageNumber() - 1 }).toEqual(value);
    expect(view.host.chequesOutData.reload).toHaveBeenCalled();

    // change the rows value
    view.host.rows.set(20);
    expect(view.host.first()).toBe(0);
    expect(view.host.pageNumber()).toBe(1);
  });
});
