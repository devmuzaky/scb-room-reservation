import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  CurrencyView,
  DateView,
  DownloadButton,
  DownloadOptions,
  PaginationData,
  Skeleton,
  TablePagination,
} from '@/core/components';
import { apiStatus, handleParams, Pagination } from '@/core/models/api';
import { TranslocoDirective } from '@jsverse/transloco';
import { Breadcrumbs } from '@scb/ui/breadcrumb';
import { Button } from '@scb/ui/button';
import { FormField } from '@scb/ui/form-field';
import { Icon } from '@scb/ui/icon';
import { Option, Select, SelectTrigger } from '@scb/ui/select';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { PaginatorModule } from 'primeng/paginator';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'transactions-table',
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
    DateView,
    CurrencyView,
    TablePagination,
    DownloadButton,
  ],
  templateUrl: './transactions.html',
  host: {
    class: 'block rounded-4xl bg-foreground px-xl sm:px-3xl 2xl:px-xl py-3xl',
  },
})
export default class TransactionsTableComponent {
  readonly route = inject(ActivatedRoute);

  readonly overdraftId = this.route.snapshot.paramMap.get('overdraftId') || '';
  readonly isEmpty = computed(() => this.transactionsList().length === 0);
  readonly transactionTypesValue = signal<TransactionType | ''>('');
  readonly transactionTypes = signal<TransactionType[]>(TRANSACTIONS_TYPES);

  readonly downloadOptions = {} as DownloadOptions;

  readonly transactionsResource = httpResource<TransactionsResponse>(() => {
    const params = {
      pageNo: this.page.reqPageNumber(),
      pageSize: this.page.rows(),
      type: this.transactionTypesValue().toUpperCase(),
    };

    return { url: `/api/dashboard/accounts/${this.overdraftId}/transactions`, params: handleParams(params) };
  });

  readonly status = apiStatus(this.transactionsResource.status);

  readonly transactionsList = computed(() => this.transactionsResource.value()?.transactions || []);
  readonly page = new PaginationData(this.transactionTypesValue);
  readonly totalPages = computed(() => this.transactionsResource.value()?.pagination.totalPages || 0);
  readonly totalRecords = computed(() => this.transactionsResource.value()?.pagination.totalSize || 0);
  readonly showClearFilter = computed(() => this.transactionTypesValue() !== '');

  clearFilter() {
    this.transactionTypesValue.set('');
    this.transactionsResource.reload();
  }
}

export interface TransactionsList {
  accountId: number;
  transactionDate: string;
  transactionType: TransactionType;
  transactionCategory: string;
  transactionCode: string;
  description: string;
  referenceNumber: string;
  debitAmount: number;
  creditAmount: number;
  status: string;
  currencyId: string;
  balanceAfter: number;
}

export interface TransactionsResponse {
  transactions: TransactionsList[];
  pagination: Pagination;
}

export type TransactionType = 'Debit' | 'Credit';
export const TRANSACTIONS_TYPES: TransactionType[] = ['Debit', 'Credit'];
