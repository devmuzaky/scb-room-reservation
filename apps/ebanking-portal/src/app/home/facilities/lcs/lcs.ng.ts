import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
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
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { Icon } from '@scb/ui/icon';
import { TableModule } from 'primeng/table';
import { LcsFilter } from './lcs-filter.ng';
import { LcsRes, LcsType, LcTypeRes } from './model';

@Component({
  selector: 'app-lcs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TableModule,
    Button,
    TranslocoDirective,
    LcsFilter,
    TablePagination,
    TableSkeletonComponent,
    Icon,
    DownloadButton,
    CurrencyView,
    DateView,
  ],
  templateUrl: 'lcs.ng.html',
  host: {
    class: 'block rounded-4xl bg-foreground px-xl sm:px-3xl 2xl:px-xl py-3xl',
  },
})
export class Lcs {
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly router = inject(Router);

  readonly lang = this.layoutFacade.language;
  readonly lcTypeData = httpResource<LcTypeRes>(() => {
    const _ = this.lang();
    return `/api/dashboard/lookup/static-data?listId=1`;
  });
  readonly lcsData = httpResource<LcsRes>(() => {
    const params = {
      lcType: this.lcType(),
      pageStart: this.page.reqPageNumber(),
      pageSize: this.page.rows(),
    };
    return { url: '/api/dashboard/facilities-overview/lc', params: handleParams(params) };
  });
  readonly status = apiStatus(this.lcsData.status);

  readonly lcTypeList = computed(() => this.lcTypeData.value()?.lcTypes || []);
  readonly lcType = signal<LcsType[]>([]);
  readonly lcsList = computed(() => this.lcsData.value()?.data || []);
  readonly page = new PaginationData(this.lcType);
  readonly totalRecords = computed(() => this.lcsData.value()?.pagination.totalSize ?? 0);
  readonly totalPages = computed(() => this.lcsData.value()?.pagination.totalPages ?? 0);

  readonly isEmpty = computed(() => this.lcsList().length === 0);
  readonly downloadOptions: DownloadOptions = {
    filename: 'facilities.facilitiesLcs.title',
    url: ext => {
      const queryString = queryParamsString({
        pageStart: this.page.reqPageNumber().toString(),
        pageSize: this.page.rows().toString(),
      });
      return `/api/dashboard/files/export/lc/user/format/${ext}?${queryString}`;
    },
  };

  navigateToDetails(lcNumber: string) {
    this.router.navigate(['/dashboard/lcs-details', lcNumber]);
  }
}
