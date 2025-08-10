import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CurrencyView, DateView, PaginationData, Skeleton, TablePagination } from '@/core/components';
import { RolePermissionDirective } from '@/core/directives/role-permission.directive';
import { apiStatus, handleParams, Pagination } from '@/core/models/api';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { Icon } from '@scb/ui/icon';
import { TableModule } from 'primeng/table';
import { ScheduledTransferDetailsService } from '../scheduled-transfer-details/schduled-transfer-details.service';
import { UpcomingTransferFilter } from './upcoming-transfer-filter.ng';

@Component({
  selector: 'app-upcoming-transfer-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TableModule,
    Button,
    TranslocoDirective,
    TablePagination,
    Skeleton,
    Icon,
    CurrencyView,
    DateView,
    UpcomingTransferFilter,
    RolePermissionDirective,
  ],
  templateUrl: './upcoming-transfer-details.html',
  host: {
    class: 'block rounded-4xl bg-foreground px-xl sm:px-3xl 2xl:px-xl py-3xl',
  },
})
export class UpcomingTransferDetails {
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly route = inject(ActivatedRoute);
  readonly stService = inject(ScheduledTransferDetailsService);
  readonly reload = output<'reload' | 'back'>();

  readonly lang = this.layoutFacade.language;
  readonly scheduledId = this.route.snapshot.params['scheduledId'];
  readonly refreshUpcomingTransfer = signal(0);
  readonly utData = httpResource<UpcomingTransferRes>(() => {
    const _ = this.refreshUpcomingTransfer();
    const params = this.params();
    return {
      url: `/api/transfer/transfers/schedule/${this.scheduledId}/upcoming`,
      params: handleParams(params),
    };
  });
  readonly status = apiStatus(this.utData.status);

  readonly date = signal<string>('');
  readonly filters = computed(() => {
    const [fromDate, toDate] = this.date().split(',');
    return {
      fromDate,
      toDate,
    };
  });
  readonly page = new PaginationData(this.date, undefined, 10);
  readonly params = computed(() => {
    return {
      ...this.filters(),
      pageStart: this.page.reqPageNumber().toString(),
      pageSize: this.page.rows().toString(),
    };
  });
  readonly utList = computed(() => this.utData.value()?.upcomingTransfers || []);
  readonly totalRecords = computed(() => this.utData.value()?.pagination.totalSize ?? 0);
  readonly totalPages = computed(() => this.utData.value()?.pagination.totalPages ?? 0);

  readonly isEmpty = computed(() => this.utList().length === 0);
  readonly isFiltersApplied = computed(() => this.filters()?.fromDate && this.filters().toDate);

  cancel(id: string) {
    const callback = () => {
      // this.refreshUpcomingTransfer.update(x => x + 1);
      this.reload.emit(this.utList().length === 1 && this.page.pageNumber() === 1 ? 'back' : 'reload');
    };
    this.stService.cancelTransfer(id, callback);
  }
}

export interface UpcomingTransferRes {
  upcomingTransfers: UpcomingTransferList[];
  pagination: Pagination;
}

interface UpcomingTransferList {
  transferId: string;
  transactionDate: string;
  transferAmount: number;
  transferCurrency: string;
}
