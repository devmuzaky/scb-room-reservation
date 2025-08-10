import { HttpClient, HttpParams, httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyView, DateView, SelectFooter, SelectValue, TableSkeletonComponent } from '@/core/components';
import { apiStatus, Pagination } from '@/core/models/api';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Breadcrumbs } from '@scb/ui/breadcrumb';
import { Button } from '@scb/ui/button';
import { FormField } from '@scb/ui/form-field';
import { Icon } from '@scb/ui/icon';
import { Option, Select, SelectTrigger } from '@scb/ui/select';
import { Base64ConverterService } from '@scb/util/base64-converter';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'idc-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [Breadcrumbs, TranslocoDirective],
  imports: [
    BreadcrumbModule,
    TableModule,
    Select,
    SelectTrigger,
    Option,
    FormField,
    TranslocoDirective,
    Button,
    TableSkeletonComponent,
    Icon,
    PaginatorModule,
    DropdownModule,
    FormsModule,
    SelectModule,
    MenuModule,
    SelectFooter,
    SelectValue,
    DateView,
    CurrencyView,
  ],
  templateUrl: './idc-ng.html',
  host: {
    class: 'block rounded-4xl bg-foreground px-xl sm:px-3xl 2xl:px-xl py-3xl',
  },
})
export default class IDCTableComponent {
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly route = inject(ActivatedRoute);

  readonly base64Converter = inject(Base64ConverterService);
  readonly translateService = inject(TranslocoService);
  readonly http = inject(HttpClient);

  readonly darkMode = computed(() => this.layoutFacade.isDarkTheme());
  readonly idcTypeValue = signal([]);
  readonly statusValue = signal([]);
  readonly lang = computed(() => this.layoutFacade.language());
  readonly pageNumber = linkedSignal({ source: this.lang, computation: () => 0 });
  readonly totalPage = linkedSignal({ source: this.lang, computation: () => 1 });

  readonly first = signal(0);
  readonly rows = signal(10);
  readonly loading = signal(false);

  readonly isEmpty = computed(() => this.idcList().idcList.length === 0);
  readonly selectedPage = signal(10);
  readonly idcStatus = signal<idcStatus[]>(['Settled', 'Pending']);
  readonly router = inject(Router);

  readonly filterIdcType = (option: IdcType) => option.value;
  readonly paginationSizeOptions = signal([
    { label: '10', value: 10 },
    { label: '20', value: 20 },
    { label: '50', value: 50 },
    { label: '100', value: 100 },
  ]);

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

  readonly idcLookUpTypes = httpResource<IdcTypeResponse>(() => {
    const _ = this.lang();
    return `/api/dashboard/lookup/static-data?listId=2`;
  });

  readonly refresh = signal(1);
  readonly idcResource = httpResource<IdcResponse>(() => {
    const _ = this.refresh();
    const params = untracked(() => {
      let httpParams = new HttpParams()
        .set('pageStart', this.pageNumber().toString())
        .set('pageSize', this.rows().toString());

      const idcType = this.idcTypeValue().join(',');
      const status = this.statusValue().join(',');

      if (idcType) {
        httpParams = httpParams.set('idcType', idcType);
      }
      if (status) {
        httpParams = httpParams.set('status', status);
      }
      return httpParams;
    });

    return {
      url: `/api/dashboard/facilities-overview/idc`,
      params,
    };
  });

  readonly status = apiStatus(this.idcResource.status);
  readonly idcList = computed(() => {
    const data = this.idcResource.value();
    return {
      totalPages: data?.pagination.totalPages || 0,
      totalRecords: data?.pagination.totalSize || 0,
      idcList: data?.data || [],
    };
  });

  readonly totalPages = computed(() => this.idcResource.value()?.pagination.totalPages || 0);
  readonly totalRecords = computed(() => this.idcResource.value()?.pagination.totalSize || 0);
  readonly idcLookupTypes = computed(() => this.idcLookUpTypes.value()?.idcTypes || []);

  onPageChange(e: PaginatorState) {
    this.first.set(e.first as number);
    this.pageNumber.set(e.page as number);
    this.rows.set(e.rows as number);
    this.reload();
  }

  applyFilter() {
    this.first.set(0);
    this.rows.set(10);
    this.reload();
  }

  resetFilter() {
    this.first.set(0);
    this.rows.set(10);
    this.reload();
  }

  idcTypeClosed() {
    if (this.idcTypeValue().length) {
      this.idcTypeValue.set([]);
    }
  }

  idcStatusClosed() {
    if (this.statusValue().length) {
      this.statusValue.set([]);
    }
  }

  clearFilter() {
    this.statusValue.set([]);
    this.idcTypeValue.set([]);
    this.reload();
  }

  onPageSizeChange(e: DropdownChangeEvent) {
    this.rows.set(e.value as number);
    this.reload();
  }

  reload() {
    this.refresh.update(x => x + 1);
  }

  download(extension: string) {
    const filename = this.translateService.translate('facilitiesIdc.title');
    this.loading.set(true);
    this.http
      .get<{
        file: string;
      }>(`/api/dashboard/files/export/idc/user/format/${extension.toUpperCase()}`)
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

  navigateToDetails(idcNumber: string) {
    this.router.navigate(['/dashboard/idc-details', idcNumber]);
  }
}

export interface IdcList {
  idcNumber: string;
  idcAmount: number;
  dueDate: string;
  idcDrawer: string;
  idcType: string;
  idcTypeDescription: string;
  status: string;
  idcCurrency: string;
}

export interface IdcResponse {
  data: IdcList[];
  pagination: Pagination;
}

export interface IdcTypeResponse {
  idcTypes: IdcType[];
}
export interface IdcType {
  key: string;
  value: string;
}

export type idcStatus = 'Settled' | 'Pending';
