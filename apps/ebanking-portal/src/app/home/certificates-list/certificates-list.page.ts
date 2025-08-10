import { DatePipe, NgClass } from '@angular/common';
import { HttpClient, httpResource } from '@angular/common/http';
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
import { Breadcrumbs } from '@scb/ui/breadcrumb';
import { Button } from '@scb/ui/button';
import { Card } from '@scb/ui/card';
import { FormField } from '@scb/ui/form-field';
import { Icon } from '@scb/ui/icon';
import { Option, Select, SelectTrigger } from '@scb/ui/select';
import { Base64ConverterService } from '@scb/util/base64-converter';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuModule } from 'primeng/menu';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { AccountDetailsService } from '../account-details/account-details.service';
import { CertificatesData } from './certificates-list.models';

@Component({
  selector: 'app-certificates-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AccountDetailsService, Breadcrumbs, DatePipe, ShortNumberPipe, MaskedPipe],
  imports: [
    RouterLink,
    BreadcrumbModule,
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
    NumberCommaFormatPipe,
    MenuModule,
    Icon,
    LastUpdated,
    DateView,
    MaskedPipe,
  ],
  templateUrl: './certificates-list.page.html',
})
export class CertificatesListPage {
  private readonly http = inject(HttpClient);
  readonly accountDetailService = inject(AccountDetailsService);
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly datePipe = inject(DatePipe);
  readonly directionality = inject(Directionality, { optional: true });
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
  readonly certificateId = computed(() => this.activatedRoute.snapshot.paramMap.get('certificateId') || '');

  readonly currenciesList = computed<string[]>(() => this.dashboardStore.currencyList()['certificates']);
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

  readonly params = signal(this.getParams());
  readonly certificatesListResource = httpResource<CertificatesData>(() => {
    return { url: `/api/dashboard/deposits/certificates-list/user`, params: this.params() };
  });

  readonly certificatesList = computed(() => this.certificatesListResource.value()?.certificateListDos || []);
  readonly totalBalance = computed(() => this.certificatesListResource.value()?.totalBalance || 0);
  readonly totalPages = computed(() => this.certificatesListResource.value()?.totalPages || 0);
  readonly totalRecords = computed(() => this.certificatesListResource.value()?.totalRecords || 0);
  readonly lastUpdatedAt = computed(() => this.certificatesListResource.value()?.lastUpdatedTimestamp);
  readonly status = apiStatus(this.certificatesListResource.status);

  getParams() {
    const currencies = this.currencyValue().join(',');
    const params: Record<string, string | number | boolean> = {
      page: this.currentPage(),
      size: this.rows(),
    };

    if (currencies.trim() !== '') {
      params['currency'] = currencies;
    }
    return params;
  }

  reload() {
    this.params.set(this.getParams());
  }

  clearFilter() {
    this.currencyValue.set([]);
    this.first.set(0);
    this.rows.set(10);
    this.reload();
  }

  applyFilter() {
    this.currencySelect()?.close();
    this.first.set(0);
    this.rows.set(10);

    const currencies = this.currencyValue().join(',');

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { currency: currencies },
      queryParamsHandling: 'merge',
    });

    this.reload();
  }

  resetFilter() {
    this.currencyValue.set([]);
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

  download(extension: string) {
    const filename = this.translateService.translate('titles.certificates');
    const currencies = this.currencyValue().join(',');
    this.loading.set(true);

    const queryParams = new URLSearchParams({
      page: this.currentPage().toString(),
      size: this.rows().toString(),
    });

    if (currencies) {
      queryParams.set('currency', currencies);
    }

    this.http
      .get<{
        file: string;
      }>(`/api/dashboard/files/export/certificates/user/format/${extension.toUpperCase()}?${queryParams.toString()}`)
      .subscribe({
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

  showCertificateDetailPDF(accountNumber: string): void {
    const filename = this.translateService.translate('titles.certificate-details');
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
