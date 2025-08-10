import { NgClass, TitleCasePipe } from '@angular/common';
import { HttpClient, httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DateView, SelectFooter, SelectValue, Skeleton } from '@/core/components';
import { apiStatus, Pagination } from '@/core/models/api';
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
  selector: 'repayment-table',
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
    NgClass,
    SelectFooter,
    SelectValue,
    ShortNumberPipe,
    TitleCasePipe,
    DateView,
  ],
  templateUrl: './repayment-ng.html',
  host: {
    class: 'block rounded-4xl bg-foreground px-xl sm:px-3xl 2xl:px-xl py-3xl',
  },
})
export default class RepaymentTableComponent {
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly route = inject(ActivatedRoute);
  readonly base64Converter = inject(Base64ConverterService);
  readonly translateService = inject(TranslocoService);
  readonly http = inject(HttpClient);

  readonly darkMode = computed(() => this.layoutFacade.isDarkTheme());
  readonly statusValue = signal([]);
  readonly lang = computed(() => this.layoutFacade.language());
  readonly pageNumber = linkedSignal({ source: this.lang, computation: () => 0 });
  readonly totalPage = linkedSignal({ source: this.lang, computation: () => 1 });

  readonly first = signal(0);
  readonly rows = signal(10);
  readonly loading = signal(false);
  readonly isEmpty = computed(() => this.repaymentList().length === 0);
  readonly paymentTypes = signal<PaymentTypes[]>(PAYMENT_TYPES);
  readonly loanId = computed(() => this.route.snapshot.paramMap.get('loanId') || '');
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
  readonly loanRepaymentResource = httpResource<LoanRepaymentResponse>(() => {
    const _ = this.refresh();
    const params = untracked(() => {
      const queryParts = [
        `pageStart=${this.pageNumber()}`,
        `pageSize=${this.rows()}`,
        ...this.statusValue()
          .filter(Boolean)
          .map(status => `status=${status}`),
      ];
      return queryParts.join('&');
    });

    return {
      url: `/api/dashboard/loans/schedule/${this.loanId()}?${params}`,
    };
  });

  readonly status = apiStatus(this.loanRepaymentResource.status);

  readonly repaymentList = computed(() => this.loanRepaymentResource.value()?.loansList || []);
  readonly totalPages = computed(() => this.loanRepaymentResource.value()?.pagination.totalPages || 0);
  readonly totalRecords = computed(() => this.loanRepaymentResource.value()?.pagination.totalSize || 0);

  idcTypeClosed() {
    if (this.statusValue().length) {
      this.statusValue.set([]);
    }
  }

  onPageChange(e: PaginatorState) {
    this.first.set(e.first as number);
    this.pageNumber.set(e.page as number);
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

  clearFilter() {
    this.statusValue.set([]);
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
    const filename = this.translateService.translate('loanDetailsPage.repayments.title');
    this.loading.set(true);
    const queryParts: string[] = [];
    const status: string[] = this.statusValue();
    if (status.length > 0) {
      status.forEach(type => {
        if (type) {
          queryParts.push(`status=${encodeURIComponent(type)}`);
        }
      });
    }
    const queryString = queryParts.join('&');

    this.http
      .get<{
        file: string;
      }>(
        `/api/dashboard/files/export/loanRepay/schedule/${this.loanId()}/format/${extension.toUpperCase()}?${queryString}`,
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

export interface LoanRepayment {
  installmentDate: string;
  installmentAmount: number;
  status: string;
  currency: string;
}

export interface LoanRepaymentResponse {
  pagination: Pagination;
  loansList: LoanRepayment[];
}

export type PaymentTypes = 'Paid' | 'Pending' | 'Others';
export const PAYMENT_TYPES: PaymentTypes[] = ['Paid', 'Pending', 'Others'];
