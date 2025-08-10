import { HttpClient } from '@angular/common/http';
import { Component, input, NgModule, ResourceStatus, signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTestTransloco } from '@/config/transloco.testing';
import { AppLanguage } from '@/layout/layout-store';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { httpFakeResponse } from '@/models/api';
import { AuthStore, User } from '@/store/auth-store';
import { fakeService, render, RenderResult } from '@scb/util/testing';
import { ChartModule } from 'primeng/chart';
import { FacilitiesOverview } from './facilities-overview';

const layoutFacadeStub = fakeService(LayoutFacadeService, {
  language: signal<AppLanguage>('en'),
  isDarkTheme: signal(false),
  showBalances: signal(true),
});

const authStore = fakeService(AuthStore, {
  user: signal({ username: '' } as User).asReadonly() as any,
});

const httpClientStub = fakeService(HttpClient, {
  request: httpFakeResponse({
    lastUpdated: '2025-02-10T11:53:00Z',
    totalAuthorizedLimit: '100000000',
    totalUtilizedLimit: '51000000',
    availableLimit: '49000000',
    facilities: [
      {
        type: 'Overdraft',
        utilized: '5000000',
        authorized: '10000000',
        currency: 'EGP',
      },
      {
        type: 'Loans',
        utilized: '25000000',
        authorized: '50000000',
        currency: 'EGP',
      },
      {
        type: 'LCs',
        utilized: '10000000',
        authorized: '20000000',
        currency: 'USD',
        equivalentEGP: '310000000',
      },
      {
        type: 'Cards',
        utilized: '1000000',
        authorized: '2000000',
        currency: 'USD',
        equivalentEGP: '31000000',
      },
      {
        type: 'LGs',
        utilized: '10000000',
        authorized: '2000000',
        currency: 'USD',
        equivalentEGP: '31000000',
      },
    ],
  } as any),
});

@Component({
  selector: 'p-chart',
  template: ``,
})
class Charts {
  readonly type = input('');
  readonly data = input('');
  readonly options = input('');
}

@NgModule({
  imports: [Charts],
  exports: [Charts],
})
class FakeCharts {}

describe('Facilities Overview', () => {
  let view: RenderResult<FacilitiesOverview>;

  beforeEach(async () => {
    view = await render(
      FacilitiesOverview,
      [provideTestTransloco(), provideRouter([]), layoutFacadeStub, httpClientStub, authStore],
      {
        components: [[{ imports: [ChartModule] }, { imports: [FakeCharts] }]],
      },
    );
    view.detectChanges();
  });

  it('should create', async () => {
    await view.sleep(1);
    expect(view.host).toBeTruthy();
  });

  it('should handle widget status based on the exchange rate api status', () => {
    const status = signal(ResourceStatus.Loading);
    (view.host.facilitiesData.status as any) = status;
    status.set(ResourceStatus.Loading);
    expect(view.host.status()).toBe('loading');
    status.set(ResourceStatus.Error);
    expect(view.host.status()).toBe('error');
    status.set(ResourceStatus.Idle);
    expect(view.host.status()).toBe('default');
  });
});
