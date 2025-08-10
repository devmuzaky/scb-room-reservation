import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppBreadcrumbsComponent, CurrencyView, DateView, LastUpdated, Skeleton } from '@/core/components';
import { apiStatus, handleParams } from '@/core/models/api';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { Card } from '@scb/ui/card';
import { Icon } from '@scb/ui/icon';
import { Tab, TabChangeEvent, TabHeader, Tabs } from '@scb/ui/tabs';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';
import { TransactionsHistoryData } from '../transactions-history/transactions-history';
import { ScheduledTabsEnum, TransfersResponse } from '../transfer/model';
import { TransactionsStatusTypes, TransferTypes } from './model';
import { ScheduledTransfersFilter } from './scheduled-transfers-filter.ng';
import { TransferProgress } from './transfer-progress.ng';

@Component({
  selector: 'scheduled-transfers-list',
  templateUrl: './scheduled-transfers-list.ng.html',
  providers: [DatePipe, TransactionsHistoryData],
  imports: [
    Tabs,
    Tab,
    TabHeader,
    Button,
    MenuModule,
    Icon,
    TooltipModule,
    Card,
    Skeleton,
    AppBreadcrumbsComponent,
    TranslocoDirective,
    ScheduledTransfersFilter,
    LastUpdated,
    CurrencyView,
    DateView,
    TransferProgress,
    RouterLink,
  ],
  host: {
    class: 'container-grid py-3xl px-3xl',
  },
})
export default class ScheduledTransferList {
  readonly selectedTab = signal<ScheduledTabsEnum>(0);
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly darkMode = computed(() => this.layoutFacade.isDarkTheme());
  readonly date = signal('');
  readonly transactionStatus = signal<TransactionsStatusTypes[]>([]);
  readonly transferType = signal<TransferTypes[]>([]);
  readonly totalRecords = computed(() => this.scheduledTransfers.value()?.pagination.totalSize ?? 0);
  readonly searchTerm = signal('');
  readonly isOneTime = signal(true);

  readonly filters = computed(() => {
    const [fromDate, toDate] = this.date().split(',');
    return {
      transferStatus: this.transactionStatus().join(','),
      transferType: this.transferType().join(','),
      isOneTime: this.isOneTime(),
      fromDate,
      toDate,
    };
  });

  readonly params = computed(() => {
    const filtered = Object.entries(this.filters()).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as any);

    return {
      ...filtered,
      pageStart: 0,
      pageSize: 100,
    };
  });

  readonly scheduledTransfers = httpResource<TransfersResponse>(() => {
    return {
      url: `/api/transfer/transfers/recurring/list`,
      params: handleParams(this.params()),
    };
  });

  readonly scheduledTransfersList = computed(() => this.scheduledTransfers.value()?.transferList || []);
  readonly hasNoRecords = computed(() => {
    return this.scheduledTransfers.value()?.transferList?.length === 0 || this.totalRecords() === 0;
  });

  readonly hasFilters = computed(() => {
    return this.transactionStatus().length > 0 || this.date() !== '' || this.transferType().length > 0;
  });
  readonly lastUpdatedAt = computed(() => this.scheduledTransfers.value()?.lastUpdatedTimestamp);
  readonly status = apiStatus(this.scheduledTransfers.status);

  onTabChange(tabId: TabChangeEvent): void {
    if (this.selectedTab() !== tabId.index) {
      this.selectedTab.set(tabId.index);
      this.isOneTime.set(tabId.index === 0);
      this.transactionStatus.set([]);
      this.transferType.set([]);
      this.date.set('');
      handleParams(this.params());
    }
  }
}
