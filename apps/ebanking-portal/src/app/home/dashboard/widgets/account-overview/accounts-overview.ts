import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { Skeleton } from '@/core/components';
import { apiStatus } from '@/core/models/api';
import { NumberCommaFormatPipe } from '@/core/pipes/format-number.pipe';
import { MaskedPipe } from '@/core/pipes/masked.pipe';
import { ShortNumberPipe } from '@/core/pipes/short-number.pipe';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { DashboardStore } from '@/store/dashboard.store';
import { lastUpdateProcess } from '@/utils/utils';
import { TranslocoDirective } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { Tab, TabChangeEvent, Tabs } from '@scb/ui/tabs';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { Tooltip } from 'primeng/tooltip';
import { DashboardWidget } from '../../dashboard-widget/dashboard-widget.ng';
import { Accounts, Certificates, DashboardResponse, Deposits } from '../../model';
import { AccountsTab } from './accounts/accounts-tab.ng';
import { CertificatesTab } from './certificates/certificates-tab.ng';
import { TimeDepositsTab } from './time-deposit/time-deposit-tab.ng';

export interface Product {
  id?: string;
  code?: string;
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  inventoryStatus?: string;
  category?: string;
  image?: string;
  rating?: number;
}

export enum AccountTabs {
  ACCOUNTS = 0,
  CERTIFICATES = 1,
  DEPOSITS = 2,
}
@Component({
  selector: 'app-account-overview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe],
  imports: [
    DashboardWidget,
    Skeleton,
    Tabs,
    Tab,
    AccountsTab,
    CertificatesTab,
    TimeDepositsTab,
    TranslocoDirective,
    ShortNumberPipe,
    Button,
    MaskedPipe,
    CarouselModule,
    TagModule,
    NumberCommaFormatPipe,
    Tooltip,
  ],
  templateUrl: './account-overview.html',
})
export class AccountOverview {
  readonly layoutFacade = inject(LayoutFacadeService);

  readonly dashboardStore = inject(DashboardStore);
  readonly datePipe = inject(DatePipe);

  readonly lang = computed(() => this.layoutFacade.language());

  readonly selectedTab = signal<AccountTabs>(AccountTabs.ACCOUNTS);

  readonly dashboardData = httpResource<DashboardResponse>(() => {
    return `/api/dashboard/accounts/overview/user`;
  });
  readonly status = apiStatus(this.dashboardData.status);

  readonly isArabic = computed(() => this.layoutFacade.language() == 'ar');
  readonly accounts = computed<Accounts>(
    () => this.dashboardData.value()?.accountsOverView.accounts ?? ({} as Accounts),
  );
  readonly certificates = computed<Certificates>(
    () => this.dashboardData.value()?.accountsOverView.certificates ?? ({} as Certificates),
  );
  readonly deposits = computed<Deposits>(
    () => this.dashboardData.value()?.accountsOverView.deposits ?? ({} as Deposits),
  );

  readonly lastUpdatedAt = lastUpdateProcess(() => this.dashboardData.value()?.accountsOverView.lastUpdateAt);

  readonly totalEquivalent = computed(() => {
    const data = this.dashboardData.value()?.accountsOverView;
    switch (this.selectedTab()) {
      case AccountTabs.ACCOUNTS:
        return data?.accounts?.equivalentInEGP || 0;
      case AccountTabs.CERTIFICATES:
        return data?.certificates?.equivalentInEGP || 0;
      case AccountTabs.DEPOSITS:
        return data?.deposits?.equivalentInEGP || 0;
      default:
        return 0;
    }
  });

  constructor() {
    effect(() => {
      const data = this.dashboardData.value();
      if (data) {
        // set list of currencies to the store
        this.dashboardStore.setCurrencyList(
          'accounts',
          data.accountsOverView.accounts.accountsList.map(account => account.currency),
        );
        this.dashboardStore.setCurrencyList(
          'certificates',
          data.accountsOverView.certificates.certificatesList.map(certificate => certificate.currency),
        );
        this.dashboardStore.setCurrencyList(
          'deposits',
          data.accountsOverView.deposits.depositsList.map(deposit => deposit.currency),
        );
      } else {
        this.dashboardStore.setCurrencyList('accounts', []);
        this.dashboardStore.setCurrencyList('certificates', []);
        this.dashboardStore.setCurrencyList('deposits', []);
      }
    });
  }

  onTabChange(tabId: TabChangeEvent): void {
    this.selectedTab.set(tabId.index);
  }
}
