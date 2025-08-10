import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, linkedSignal, signal } from '@angular/core';
import { CurrencyView, DateView, PaginationData, TablePagination, TableSkeletonComponent } from '@/core/components';
import { apiStatus, handleParams } from '@/core/models/api';
import { TranslocoDirective } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { Card } from '@scb/ui/card';
import { Icon } from '@scb/ui/icon';
import { Tab, TabHeader, TabLazy, Tabs } from '@scb/ui/tabs';
import { TableModule } from 'primeng/table';
import { AllList } from './all/all-list.ng';
import { ApprovalProgress } from './approval-progress.ng';
import { ApprovedList } from './approved/approved-list.ng';
import { IPendingApprovalsRes } from './model';
import { PendingApprovalFilter } from './pending-transactions-filter.ng';
import { PendingList } from './pending/pending-list.ng';
import { RejectedList } from './rejected/rejected-list.ng';
import { WaitingList } from './waiting/waiting-list.ng';

@Component({
  selector: 'app-pending-transactions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe],
  imports: [
    TranslocoDirective,
    Card,
    TableSkeletonComponent,
    Icon,
    TableModule,
    DateView,
    CurrencyView,
    TablePagination,
    PendingApprovalFilter,
    Button,
    ApprovalProgress,
    ApprovedList,
    WaitingList,
    RejectedList,
    PendingList,
    AllList,
    Tabs,
    Tab,
    TabHeader,
    TabLazy,
  ],
  templateUrl: './pending-transactions.ng.html',
  host: {
    class: 'block',
  },
})
export default class PendingTransactions {
  readonly isEmpty = signal(false);
  readonly transferType = signal<any[]>([]);
  readonly selectedTab = 0;

  readonly approvalSource = httpResource<IPendingApprovalsRes>(() => {
    const params = {
      lcType: this.transferType(),
      pageStart: this.page.reqPageNumber(),
      pageSize: this.page.rows(),
    };
    return { url: '/api/dashboard/facilities-overview/lc', params: handleParams(params) };
  });

  readonly transferTypeList = computed(() => this.approvalSource.value()?.transferTypes || []);
  readonly approvalList = computed(() => this.approvalSource.value()?.data || []);
  readonly page = new PaginationData(this.transferType);
  readonly status = apiStatus(this.approvalSource.status);

  readonly totalRecords = computed(() => 0); // this.lcsData.value()?.pagination.totalSize ?? 0);
  readonly totalPages = computed(() => 0); //this.lcsData.value()?.pagination.totalPages ?? 0);
}
