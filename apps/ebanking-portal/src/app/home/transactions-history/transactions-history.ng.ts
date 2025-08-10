import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AppBreadcrumbsComponent,
  DateView,
  DownloadButton,
  DownloadOptions,
  LastUpdated,
  Skeleton,
} from '@/core/components';
import {
  TransactionsResponse,
  TransactionsStatusTypes,
  TransactionsTransferTypes,
  TransferStatusEnum,
  TransferTypeEnum,
} from '@/home/transactions-history/model';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { apiStatus, handleParams } from '@/models/api';
import { TranslocoDirective } from '@jsverse/transloco';
import { Badge } from '@scb/ui/badge';
import { Button } from '@scb/ui/button';
import { Card } from '@scb/ui/card';
import { Icon } from '@scb/ui/icon';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { TransactionsHistoryData } from './transactions-history';
import { TransactionsHistoryFilter } from './transactions-history-filter.ng';

@Component({
  selector: 'app-transactions-history',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe, TransactionsHistoryData],
  imports: [
    BreadcrumbModule,
    Skeleton,
    Card,
    Button,
    Icon,
    TooltipModule,
    TableModule,
    PaginatorModule,
    TranslocoDirective,
    Badge,
    TransactionsHistoryFilter,
    DropdownModule,
    SelectModule,
    FormsModule,
    AppBreadcrumbsComponent,
    LastUpdated,
    DateView,
    DownloadButton,
  ],
  templateUrl: 'transactions-history.ng.html',
  host: {
    class: `container-grid py-3xl px-3xl`,
  },
})
export default class TransactionsHistory {
  readonly router = inject(Router);
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly transactionsHistoryData = inject(TransactionsHistoryData);

  readonly lang = computed(() => this.layoutFacade.language());
  readonly darkMode = computed(() => this.layoutFacade.isDarkTheme());
  readonly date = signal('');
  readonly transactionStatus = signal<TransactionsStatusTypes[]>([]);
  readonly transferType = signal<TransactionsTransferTypes[]>([]);
  readonly searchTerm = signal('');

  readonly filters = computed(() => {
    const [fromDate, toDate] = this.date().split(',');
    return {
      transferStatus: this.transactionStatus().join(','),
      transferType: this.transferType().join(','),
      fromDate,
      toDate,
    };
  });

  readonly params = computed(() => {
    const filtered = Object.entries(this.filters()).reduce((acc, [key, value]) => {
      if (value && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {} as any);

    return {
      ...filtered,
      pageStart: this.pageNumber() - 1,
      pageSize: this.rows(),
    };
  });

  readonly transactionsData = httpResource<TransactionsResponse>(() => {
    return {
      url: `/api/transfer/transfers/history`,
      params: handleParams(this.params()),
      headers: {
        'Accept-Language': this.lang(),
      },
    };
  });

  readonly lastUpdatedAt = computed(() => this.transactionsData.value()?.lastUpdatedTimestamp);
  readonly status = apiStatus(this.transactionsData.status);

  readonly dropdownOptions = [
    { label: '10', value: 10 },
    { label: '20', value: 20 },
    { label: '50', value: 50 },
    { label: '100', value: 100 },
  ];

  readonly rows = signal(10);
  readonly reset = computed(() => [this.rows(), this.layoutFacade.language(), this.filters()]);
  readonly first = linkedSignal({ source: this.reset, computation: () => 0 });
  readonly pageNumber = linkedSignal({ source: this.reset, computation: () => 1 });
  readonly totalRecords = computed(() => this.transactionsData.value()?.pagination.totalSize ?? 0);
  readonly totalPages = computed(() => this.transactionsData.value()?.pagination.totalPages ?? 0);
  readonly isEmpty = computed(
    () => this.transactionsData.value()?.transferHistory?.length === 0 || this.totalRecords() === 0,
  );

  readonly transactions = computed(() => {
    const data = this.transactionsData.value()?.transferHistory || [];
    return data.sort((a, b) => {
      const dateA = this.parseTransactionDate(a.transactionDate);
      const dateB = this.parseTransactionDate(b.transactionDate);
      return dateB.getTime() - dateA.getTime();
    });
  });

  readonly hasNoRecords = computed(() => {
    return this.transactionsData.value()?.transferHistory?.length === 0 || this.totalRecords() === 0;
  });

  readonly hasFilters = computed(() => {
    return this.transactionStatus().length > 0 || this.date() !== '' || this.transferType().length > 0;
  });

  readonly downloadOptions: DownloadOptions = {
    filename: 'transactions.title',
    url: ext => {
      const queryParams = new URLSearchParams();

      queryParams.set('format', ext);

      queryParams.set('lang', this.lang());

      queryParams.set('pageStart', (this.pageNumber() - 1).toString());
      queryParams.set('pageSize', this.rows().toString());

      const filters = this.filters();

      if (filters.fromDate) {
        queryParams.set('fromDate', filters.fromDate);
      }
      if (filters.toDate) {
        queryParams.set('toDate', filters.toDate);
      }

      if (filters.transferStatus) {
        const statuses = filters.transferStatus.split(',').filter(status => status.trim());
        statuses.forEach(status => {
          queryParams.append('transferStatus', status.trim());
        });
      }

      if (filters.transferType) {
        const types = filters.transferType.split(',').filter(type => type.trim());
        types.forEach(type => {
          queryParams.append('transferType', type.trim());
        });
      }

      return `/api/transfer/transfers/history/download?${queryParams.toString()}`;
    },
  };

  parseTransactionDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split('-');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }

  getStatusVariant(status: TransferStatusEnum) {
    switch (status) {
      case TransferStatusEnum.SUCCESS:
        return 'success';
      case TransferStatusEnum.PENDING:
        return 'warning';
      case TransferStatusEnum.FAILED:
        return 'red';
      default:
        return 'grey';
    }
  }

  getStatusLabel(status: TransferStatusEnum): string {
    const statusItem = this.transactionsHistoryData.transferStatus().find(item => item.key === status);
    return statusItem?.value || status;
  }

  getTransferTypeLabel(type: TransferTypeEnum): string {
    const typeItem = this.transactionsHistoryData.transferTypes().find(item => item.key === type);
    return typeItem?.value || type;
  }

  onPageChange(e: PaginatorState) {
    this.first.set(e.first!);
    this.rows.set(e.rows!);
    this.pageNumber.set(e.page! + 1);
    this.transactionsData.reload();
  }
  viewTransfer(transferId: string) {
    this.router.navigate(['/transfer/transfer-details', transferId], {});
  }
}
