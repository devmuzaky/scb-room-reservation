import { CurrencyPipe, DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { HttpParams, httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { DateView, LastUpdated, TableSkeletonComponent } from '@/core/components';
import { apiStatus } from '@/core/models/api';
import { NumberCommaFormatPipe } from '@/core/pipes/format-number.pipe';
import { MaskedPipe } from '@/core/pipes/masked.pipe';
import { ShortNumberPipe } from '@/core/pipes/short-number.pipe';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { DashboardStore } from '@/store/dashboard.store';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Directionality } from '@scb/ui/bidi';
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
import { TimeDeposit, TimeDepositsResponse } from './deposits-list.models';
import { DepositsListService } from './deposits-list.service';

@Component({
  selector: 'app-deposits-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe, CurrencyPipe, DatePipe, DecimalPipe, DepositsListService, ShortNumberPipe, MaskedPipe],
  imports: [
    RouterLink,
    TooltipModule,
    Card,
    NgClass,
    TableModule,
    Select,
    SelectTrigger,
    Option,
    FormField,
    Button,
    NgClass,
    PaginatorModule,
    TableSkeletonComponent,
    ShortNumberPipe,
    MenuModule,
    Icon,
    DecimalPipe,
    TranslocoDirective,
    NumberCommaFormatPipe,
    LastUpdated,
    DateView,
    MaskedPipe,
  ],
  templateUrl: './deposits-list.page.html',
})
export class DepositsListPage {
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly datePipe = inject(DatePipe);
  readonly transloco = inject(TranslocoService);
  readonly directionality = inject(Directionality, { optional: true });
  private readonly depositsListService = inject(DepositsListService);
  private readonly translateService = inject(TranslocoService);
  readonly router = inject(Router);
  readonly dashboardStore = inject(DashboardStore);
  readonly activatedRoute = inject(ActivatedRoute);
  readonly base64Converter = inject(Base64ConverterService);
  readonly masked = inject(MaskedPipe);

  readonly currencySelect = viewChild<Select<string>>('currencySelect');

  // --- State Signals ---
  readonly loading = signal(false);
  readonly first = signal(0);
  readonly rows = signal(10);
  readonly currentPage = computed(() => this.first() / this.rows());

  readonly currenciesList = computed<string[]>(() => this.dashboardStore.currencyList()['deposits']);
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

  // --- Time Deposits Data ---
  readonly params = signal(this.getParams());
  readonly timeDepositsListResource = httpResource<TimeDepositsResponse>(() => {
    return { url: `/api/dashboard/accounts/tdoverview`, params: this.params() };
  });

  readonly timeDepositsList = computed<TimeDeposit[]>(() => this.timeDepositsListResource.value()?.tdList || []);
  readonly totalAmount = computed(() => this.timeDepositsListResource.value()?.totalAmount || 0);
  readonly totalPages = computed(() => this.timeDepositsListResource.value()?.totalPages || 0);
  readonly totalSize = computed(() => this.timeDepositsListResource.value()?.totalSize || 0);
  readonly lastUpdatedAt = computed(() => this.timeDepositsListResource.value()?.lastUpdated);
  readonly status = apiStatus(this.timeDepositsListResource.status);

  getParams() {
    let httpParams = new HttpParams().set('page', this.currentPage()).set('size', this.rows());
    const currencies: string[] = this.currencyValue();
    if (currencies.length > 0) {
      currencies.forEach(type => {
        if (type) {
          httpParams = httpParams.append('currencies', type);
        }
      });
    }
    return httpParams;
  }

  // --- Event Handlers for Regular Deposits ---
  clearFilter() {
    this.currencyValue.set([]);
    this.first.set(0);
    this.rows.set(10);
    this.updateCurrencyQueryParams();
    this.reload();
  }

  applyFilter() {
    this.currencySelect()?.close();
    this.first.set(0);
    this.rows.set(10);
    this.updateCurrencyQueryParams();
    this.reload();
  }

  reload() {
    this.params.set(this.getParams());
  }

  resetFilter() {
    this.currencyValue.set([]);
    this.updateCurrencyQueryParams();
  }

  updateCurrencyQueryParams() {
    const currencies = this.currencyValue().join(',');
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { currency: currencies || null },
      queryParamsHandling: 'merge',
    });
  }

  onPageChange(e: PaginatorState) {
    this.first.set(e.first as number);
    this.rows.set(e.rows as number);
    this.reload();
  }

  // --- Event Handlers for Time Deposits ---
  refreshTimeDeposits() {
    this.reload();
  }
  exportData(format: string) {
    const filename = this.translateService.translate('titles.deposits');
    const currencies = this.currencyValue();
    this.loading.set(true);
    this.depositsListService.download(format, currencies, this.currentPage(), this.rows()).subscribe({
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
