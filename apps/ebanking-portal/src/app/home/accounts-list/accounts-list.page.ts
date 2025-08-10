import { DatePipe, NgClass } from '@angular/common';
import { httpResource } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  linkedSignal,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { LastUpdated, TableSkeletonComponent } from '@/core/components';
import { NumberCommaFormatPipe } from '@/core/pipes/format-number.pipe';
import { MaskedPipe } from '@/core/pipes/masked.pipe';
import { ShortNumberPipe } from '@/core/pipes/short-number.pipe';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { apiStatus, handleParams } from '@/models/api';
import { DashboardStore } from '@/store/dashboard.store';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Directionality } from '@scb/ui/bidi';
import { Breadcrumbs } from '@scb/ui/breadcrumb';
import { Button } from '@scb/ui/button';
import { Card } from '@scb/ui/card';
import { FormField } from '@scb/ui/form-field';
import { Icon } from '@scb/ui/icon';
import { Option, Select, SelectTrigger } from '@scb/ui/select';
import { Base64ConverterService } from '@scb/util/base64-converter';
import { MenuModule } from 'primeng/menu';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { AccountDetailsService } from '../account-details/account-details.service';
import { AccountData } from './accounts-list.models';
import { AccountsListService } from './accounts-list.service';

@Component({
  selector: 'app-account-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AccountsListService, AccountDetailsService, Breadcrumbs, DatePipe, ShortNumberPipe, MaskedPipe],
  imports: [
    RouterLink,
    TooltipModule,
    Card,
    NgClass,
    TableModule,
    PaginatorModule,
    Select,
    SelectTrigger,
    Option,
    FormField,
    TableSkeletonComponent,
    TranslocoDirective,
    Button,
    ShortNumberPipe,
    MenuModule,
    Icon,
    NumberCommaFormatPipe,
    LastUpdated,
    MaskedPipe,
  ],
  templateUrl: './accounts-list.html',
})
export class AccountListPage {
  readonly accountDetailService = inject(AccountDetailsService);
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly datePipe = inject(DatePipe);
  readonly directionality = inject(Directionality, { optional: true });
  readonly service = inject(AccountsListService);
  readonly masked = inject(MaskedPipe);

  readonly router = inject(Router);
  readonly dashboardStore = inject(DashboardStore);
  readonly activatedRoute = inject(ActivatedRoute);
  readonly base64Converter = inject(Base64ConverterService);
  readonly translateService = inject(TranslocoService);
  readonly currencySelect = viewChild<Select<string>>('currencySelect');

  readonly loading = signal(false);
  readonly first = signal(0);
  readonly rows = signal(10);
  readonly currentPage = computed(() => this.first() / this.rows());

  readonly currenciesList = computed<string[]>(() => this.dashboardStore.currencyList()['accounts']);
  readonly lang = computed(() => this.layoutFacade.language());
  readonly currencyParam = toSignal(this.activatedRoute.queryParams.pipe(map(params => params['currency'])));
  readonly currencyValue = linkedSignal({
    source: () => ({ lang: this.lang(), currency: this.currencyParam() }),
    computation: ({ currency }) => (currency ? currency.split(',') : []),
  });
  readonly downloadOptionsList = [
    {
      icon: 'pdf',
      label: 'PDF',
    },
    {
      icon: 'csv',
      label: 'CSV',
    },
  ];

  // this is an hacky way to refresh the request
  readonly refresh = signal(1);
  readonly accountListResource = httpResource<AccountData>(() => {
    const _ = this.refresh();
    const params = untracked(() => {
      const currency = this.currencyValue().join(',');
      const params = { page: this.currentPage(), size: this.rows(), currency };
      return params;
    });
    return { url: `/api/dashboard/accounts/list/user`, params: handleParams(params) };
  });

  readonly accountList = computed(() => this.accountListResource.value()?.accountList || []);
  readonly totalBalance = computed(() => this.accountListResource.value()?.totalBalance || 0);
  readonly totalPages = computed(() => this.accountListResource.value()?.totalPages || 0);
  readonly totalRecords = computed(() => this.accountListResource.value()?.totalRecords || 0);

  readonly lastUpdatedAt = computed(() => this.accountListResource.value()?.lastUpdatedTimestamp);
  readonly status = apiStatus(this.accountListResource.status);

  clearFilter() {
    this.currencyValue.set([]);
    this.first.set(0);
    this.rows.set(10);
    this.onUpdateCurrencies();
    this.reload();
  }

  applyFilter() {
    (this.currencySelect() as Select<string>).close();
    this.first.set(0);
    this.rows.set(10);
    this.onUpdateCurrencies();
    this.reload();
  }

  reload() {
    this.refresh.update(x => x + 1);
    this.accountListResource.reload();
  }

  resetFilter() {
    this.currencyValue.set([]);
    this.onUpdateCurrencies();
  }

  onUpdateCurrencies() {
    const currencies = this.currencyValue().join(',');
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { currency: currencies },
      queryParamsHandling: 'merge',
    });
  }

  onPageChange(e: PaginatorState) {
    this.first.set(e.first as number);
    this.rows.set(e.rows as number);
    this.reload();
  }

  exportData(extension: string) {
    const filename = this.translateService.translate('titles.accountsOverview');
    const currencies = this.currencyValue().join(',');
    this.loading.set(true);
    this.service.downloadAccountList(extension, currencies, this.currentPage(), this.rows()).subscribe({
      next: ({ file }) => {
        this.loading.set(false);
        if (extension === 'pdf') {
          this.base64Converter.downloadPdf(file, filename);
        } else {
          this.base64Converter.base64ToFile(file, extension, filename);
        }
      },
    });
  }

  showAccountDetailPDF(accountNumber: string): void {
    const filename = this.translateService.translate('titles.account-details');
    this.loading.set(true);
    this.accountDetailService.generateAccountDetailPDF({ accountNumber: accountNumber }).subscribe({
      next: ({ pdfBase64 }) => {
        this.loading.set(false);
        this.base64Converter.downloadPdf(pdfBase64, filename);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
