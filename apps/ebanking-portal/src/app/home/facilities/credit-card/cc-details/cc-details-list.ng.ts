import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  CurrencyView,
  DateView,
  DownloadButton,
  DownloadOptions,
  PaginationData,
  TablePagination,
  TableSkeletonComponent,
} from '@/core/components';
import { apiStatus, handleParams, queryParamsString } from '@/core/models/api';
import { TranslocoDirective } from '@jsverse/transloco';
// import { Badge } from '@scb/ui/badge';
import { Button } from '@scb/ui/button';
import { Icon } from '@scb/ui/icon';
import { TableModule } from 'primeng/table';
import { TransactionsRes, TransactionStatus } from '../model';
// import { CcDetailsFilter } from './cc-details-filter.ng';
import { CcDetailsService } from './cc-details.service';

@Component({
  selector: 'app-cc-details-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TableModule,
    Button,
    TranslocoDirective,
    // CcDetailsFilter,
    TableSkeletonComponent,
    Icon,
    CurrencyView,
    DateView,
    TablePagination,
    // Badge,
    DownloadButton,
  ],
  templateUrl: 'cc-details-list.ng.html',
  host: {
    class: 'block rounded-4xl bg-foreground px-xl sm:px-3xl 2xl:px-xl py-3xl',
  },
})
export class CreditCardList {
  readonly ccDetails = inject(CcDetailsService);

  readonly transactionsData = httpResource<TransactionsRes>(() => {
    const _ = this.ccDetails.refresh();
    const params = {
      status: this.ccStatus(),
      pageStart: this.page.reqPageNumber(),
      pageSize: this.page.rows(),
    };
    return {
      url: `/api/dashboard/credit-cards/${this.ccDetails.cardNumber}/transactions`,
      params: handleParams(params),
    };
  });
  readonly status = apiStatus(this.transactionsData.status);

  readonly statusList = signal(['settled', 'pending'] as TransactionStatus[]);
  readonly ccStatus = signal<TransactionStatus[]>([]);
  readonly page = new PaginationData(this.ccStatus);
  readonly transactionList = computed(() => this.transactionsData.value()?.transactions || []);
  readonly totalRecords = computed(() => this.transactionsData.value()?.pagination.totalSize ?? 0);
  readonly totalPages = computed(() => this.transactionsData.value()?.pagination.totalPages ?? 0);
  readonly isEmpty = computed(() => this.transactionList().length === 0);
  readonly downloadOptions: DownloadOptions = {
    filename: 'facilities.facilitiesCcTransactions.title',
    url: ext => {
      const queryString = queryParamsString({
        pageStart: this.page.reqPageNumber().toString(),
        pageSize: this.page.rows().toString(),
        status: this.ccStatus().join(','),
      });
      return `/api/dashboard/credit-cards/${this.ccDetails.cardNumber}/transactions/download/${ext}?${queryString}`;
    },
  };
}
