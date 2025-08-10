import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppBreadcrumbsComponent, DateView, LastUpdated, TableSkeletonComponent } from '@/core/components';
import { ShortNumberPipe } from '@/core/pipes/short-number.pipe';
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
import { ChequesOutRes, ChequesOutStatus } from '../dashboard/widgets/cheque-out/model';
import { ChequesOutFilter } from './cheques-out-filter.ng';

@Component({
  selector: 'app-cheques-out',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BreadcrumbModule,
    Card,
    Button,
    Icon,
    TooltipModule,
    TableModule,
    PaginatorModule,
    TranslocoDirective,
    Badge,
    ChequesOutFilter,
    DropdownModule,
    SelectModule,
    FormsModule,
    ShortNumberPipe,
    AppBreadcrumbsComponent,
    TableSkeletonComponent,
    LastUpdated,
    DateView,
  ],
  templateUrl: 'cheques-out.ng.html',
  host: {
    class: `container-grid py-3xl px-3xl`,
  },
})
export default class ChequesOutTracker {
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly date = signal('');
  readonly page = signal(0);
  readonly chequeStatus = signal<ChequesOutStatus[]>([]);
  readonly filters = computed(() => {
    const [fromDate, toDate] = this.date().split(',');
    return {
      status: this.chequeStatus(),
      fromDate,
      toDate,
    };
  });
  readonly chequesOutData = httpResource<ChequesOutRes>(() => {
    const params = {
      ...this.filters(),
      pageStart: this.pageNumber() - 1, // pageStart starts with 0 instead of 1
      pageSize: this.rows(),
    };

    return { url: `/api/dashboard/cheques/cheques-out/user`, params: handleParams(params) };
  });

  readonly lastUpdatedAt = computed(() => this.chequesOutData.value()?.lastUpdatedTimestamp);
  readonly status = apiStatus(this.chequesOutData.status);
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
  readonly totalRecords = computed(() => this.chequesOutData.value()?.totalRecords ?? 0);
  readonly totalPages = computed(() => this.chequesOutData.value()?.totalPages ?? 0);
  readonly cheques = computed(() => this.chequesOutData.value()?.cheques ?? []);

  onPageChange(e: PaginatorState) {
    this.first.set(e.first!);
    this.rows.set(e.rows!);
    this.pageNumber.set(e.page! + 1);
    this.chequesOutData.reload();
  }
}
