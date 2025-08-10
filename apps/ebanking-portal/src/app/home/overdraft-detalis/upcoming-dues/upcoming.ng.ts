import { HttpClient, HttpParams, httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DateView, SelectFooter, Skeleton } from '@/core/components';
import { RolePermissionDirective } from '@/core/directives/role-permission.directive';
import { apiStatus } from '@/core/models/api';
import { ShortNumberPipe } from '@/core/pipes/short-number.pipe';
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
  selector: 'upcoming-table',
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
    Skeleton,
    Icon,
    PaginatorModule,
    DropdownModule,
    FormsModule,
    SelectModule,
    MenuModule,
    ShortNumberPipe,
    SelectFooter,
    DateView,
    RolePermissionDirective,
  ],
  templateUrl: './upcoming.html',
  host: {
    class: 'block rounded-4xl bg-foreground px-xl sm:px-3xl 2xl:px-xl py-3xl',
  },
})
export default class UpcomingTableComponent {
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly route = inject(ActivatedRoute);

  readonly base64Converter = inject(Base64ConverterService);
  readonly translateService = inject(TranslocoService);
  private readonly http = inject(HttpClient);
  readonly darkMode = computed(() => this.layoutFacade.isDarkTheme());
  readonly lang = computed(() => this.layoutFacade.language());
  readonly pageNumber = linkedSignal({ source: this.lang, computation: () => 0 });
  readonly totalPage = linkedSignal({ source: this.lang, computation: () => 1 });
  readonly currentPage = linkedSignal({ source: this.lang, computation: () => 1 });
  readonly selectedPage = signal(10);
  readonly first = signal(0);
  readonly rows = signal(10);
  readonly loading = signal(false);
  readonly lastUpdatedAt = computed(() => this.upcomingDuesResponse.value()?.lastUpdatedTimestamp);
  readonly accountNumber = computed(() => this.route.snapshot.paramMap.get('overdraftId'));
  readonly statusValue = signal('');
  readonly isEmpty = computed(() => {
    const data = this.upcomingDuesResponse.value();
    return !data?.upcomingDues || data.upcomingDues.length === 0;
  });
  readonly dateRangeList = signal<DateRangeType[]>(DATE_RANGE_TYPES);
  readonly dateRangeValue = signal<DateRangeType | ''>('');
  readonly showClearFilter = computed(() => this.dateRangeValue() !== '');

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

  readonly refresh = signal(1);
  readonly upcomingDuesResponse = httpResource<UpcomingDuesResponse>(() => {
    const _ = this.refresh();
    const params = untracked(() => {
      let httpParams = new HttpParams()
        .set('pageStart', this.pageNumber().toString())
        .set('pageSize', this.rows().toString());

      // Add date range filter if selected
      const dateRange = this.dateRangeValue();
      if (dateRange) {
        const today = new Date();
        const toDate = new Date();

        switch (dateRange) {
          case '7days':
            toDate.setDate(today.getDate() + 7);
            break;
          case '30days':
            toDate.setDate(today.getDate() + 30);
            break;
          case '90days':
            toDate.setDate(today.getDate() + 90);
            break;
        }

        httpParams = httpParams.set('fromDate', this.formatDate(today)).set('toDate', this.formatDate(toDate));
      }

      return httpParams;
    });

    return {
      url: `/api/dashboard/overdrafts/upcomingDues/accountNumber/${this.accountNumber()}`,
      params,
    };
  });

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  readonly status = apiStatus(this.upcomingDuesResponse.status);

  readonly upcomingDues = computed(() => {
    const data = this.upcomingDuesResponse.value();
    return {
      totalPages: data?.pagination.totalPages || 0,
      totalRecords: data?.pagination.totalSize || 0,
      upcomingDuesList: data?.upcomingDues || [],
    };
  });

  readonly totalPages = computed(() => this.upcomingDuesResponse.value()?.pagination.totalPages || 0);
  readonly totalRecords = computed(() => this.upcomingDuesResponse.value()?.pagination.totalSize || 0);

  onPageChange(e: PaginatorState) {
    this.first.set(e.first as number);
    this.pageNumber.set(e.page as number);
    this.currentPage.set((e.page as number) + 1);
    this.rows.set(e.rows as number);
    this.reload();
  }

  applyFilter() {
    this.pageNumber.set(0);
    this.first.set(0);
    this.rows.set(10);
    this.reload();
  }

  resetFilter() {
    this.first.set(0);
    this.rows.set(10);
    this.reload();
  }

  dateRangeClosed() {
    if (this.dateRangeValue() === '') {
      this.dateRangeValue.set('');
    }
  }

  clearFilter() {
    this.dateRangeValue.set('');
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
    const filename = this.translateService.translate('overdraftDetailsPage.upcoming.title');
    this.loading.set(true);
    this.http
      .get<{
        file: string;
      }>(
        `/api/dashboard/files/export/overdrafts/upcomingDues/user/accountNumber/${this.accountNumber()}/format/${extension.toUpperCase()}`,
      )
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
}

export interface UpcomingDuesList {
  transactionDate: string;
  utilizedAmount: number;
  dueAmount: number;
  currency: string;
  dueDate: string;
}

export interface Pagination {
  pageStart: number;
  totalSize: number;
  pageSize: number;
  totalPages: number;
}

export interface UpcomingDuesResponse {
  lastUpdatedTimestamp: string;
  upcomingDues: UpcomingDuesList[];
  pagination: Pagination;
}

export type DateRangeType = '7days' | '30days' | '90days';
export const DATE_RANGE_TYPES: DateRangeType[] = ['7days', '30days', '90days'];
