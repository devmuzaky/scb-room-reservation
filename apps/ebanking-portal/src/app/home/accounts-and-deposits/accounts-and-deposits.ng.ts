import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, effect, inject, linkedSignal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DashboardStore } from '@/store/dashboard.store';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { Icon } from '@scb/ui/icon';
import { Tab, TabHeader, TabLazy, Tabs } from '@scb/ui/tabs';
import { Base64ConverterService } from '@scb/util/base64-converter';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';
import { AccountListPage } from '../accounts-list/accounts-list.page';
import { CertificatesListPage } from '../certificates-list/certificates-list.page';
import { DashboardResponse } from '../dashboard/model';
import { DepositsListPage } from '../deposits-list/deposits-list.page';
import { AccountsAndDepositsState } from './accounts-and-deposits-state';
import { AllListPage } from './all/all-list.ng';

const ROUTE_MAP: Record<string, number> = {
  all: 0,
  accounts: 1,
  certificates: 2,
  deposits: 3,
};

@Component({
  selector: 'app-accounts-and-deposits',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AccountsAndDepositsState],
  imports: [
    Tabs,
    Tab,
    TabHeader,
    TabLazy,
    TranslocoDirective,
    AllListPage,
    AccountListPage,
    CertificatesListPage,
    DepositsListPage,
    Button,
    MenuModule,
    Icon,
    TooltipModule,
    RouterLink,
  ],
  templateUrl: './accounts-and-deposits.ng.html',
  host: {
    class: 'container-grid py-3xl px-3xl',
  },
})
export default class AccountsAndDeposits {
  readonly route = inject(ActivatedRoute);
  readonly dashboardStore = inject(DashboardStore);
  readonly params = toSignal(this.route.paramMap);
  readonly accountId = computed(() => this.params()?.get('id') || '');
  private readonly allListService = inject(AccountsAndDepositsState);
  private readonly translateService = inject(TranslocoService);
  readonly base64Converter = inject(Base64ConverterService);
  readonly selectedTab = linkedSignal({
    source: this.accountId,
    computation: id => ROUTE_MAP[id] || ROUTE_MAP['all'],
  });
  readonly loading = signal(false);

  readonly downloadOptionsList = [
    { icon: 'pdf', label: 'PDF' },
    { icon: 'csv', label: 'CSV' },
  ];

  readonly dashboardData = httpResource<DashboardResponse>(() => {
    return `/api/dashboard/accounts/overview/user`;
  });

  constructor() {
    // We have to call the api to get the list of currencies
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

  exportData(format: string) {
    const filename = this.translateService.translate('titles.accounts-and-details');
    this.loading.set(true);
    this.allListService
      .download(format, this.allListService.page.reqPageNumber(), this.allListService.page.rows())
      .subscribe({
        next: ({ file }) => {
          this.loading.set(false);
          if (format === 'pdf') {
            this.base64Converter.downloadPdf(file, filename);
          } else {
            this.base64Converter.base64ToFile(file, format, filename);
          }
        },
      });
  }
}
