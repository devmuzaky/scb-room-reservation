import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppBreadcrumbsComponent, DateView, LastUpdated, TableSkeletonComponent } from '@/core/components';
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
import { ChequeInResponse, ChequesInTypes, ChequesTypes } from '../dashboard/widgets/cheque-in/model';
import { ChequesInData } from './cheques-in';
import { ChequesInFilter } from './cheques-in-filter.ng';

@Component({
  selector: 'app-cheques-in',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe, ChequesInData],
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
    ChequesInFilter,
    DropdownModule,
    SelectModule,
    FormsModule,
    AppBreadcrumbsComponent,
    TableSkeletonComponent,
    LastUpdated,
    DateView,
  ],
  templateUrl: 'cheques-in.ng.html',
  host: {
    class: `container-grid py-3xl px-3xl`,
  },
})
export default class ChequesInTracker {
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly lang = computed(() => this.layoutFacade.language());
  readonly date = signal('');
  readonly page = signal(0);
  readonly chequeStatus = signal<ChequesInTypes[]>([]);
  readonly draweeBank = signal<string[]>([]);
  readonly filters = computed(() => {
    const [fromDate, toDate] = this.date().split(',');
    return {
      status: this.chequeStatus(),
      draweeBank: this.draweeBank(),
      fromDate,
      toDate,
    };
  });
  readonly params = computed(() => {
    return {
      ...this.filters(),
      pageStart: this.pageNumber() - 1, // pageStart starts with 0 instead of 1
      pageSize: this.rows(),
    };
  });
  readonly chequesInData = httpResource<ChequeInResponse>(() => {
    return { url: `/api/dashboard/cheques/overview/cheques-In`, params: handleParams(this.params()) };
  });

  readonly lastUpdatedAt = computed(() => this.chequesInData.value()?.lastUpdatedTimestamp);
  readonly status = apiStatus(this.chequesInData.status);

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
  readonly totalRecords = computed(() => this.chequesInData.value()?.pagination.totalSize ?? 100);
  readonly totalPages = computed(() => this.chequesInData.value()?.pagination.totalPages ?? 0);
  readonly cheques = computed(() => {
    const data = [
      ...(this.chequesInData.value()?.collected?.map(x => (x.status = ChequesTypes.COLLECTED) && x) || []),
      ...(this.chequesInData.value()?.returned?.map(x => (x.status = ChequesTypes.RETURNED) && x) || []),
      ...(this.chequesInData.value()?.postDated?.map(x => (x.status = ChequesTypes.POSTDATED) && x) || []),
      ...(this.chequesInData.value()?.unknown?.map(x => (x.status = ChequesTypes.OTHERS) && x) || []),
    ];
    return data.sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
  });

  onPageChange(e: PaginatorState) {
    this.first.set(e.first!);
    this.rows.set(e.rows!);
    this.pageNumber.set(e.page! + 1);
    this.chequesInData.reload();
  }
}
