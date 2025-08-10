import { HttpClient, httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
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
import { RolePermissionDirective } from '@/core/directives/role-permission.directive';
import { apiStatus, handleParams } from '@/core/models/api';
import { TranslocoDirective } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { Icon } from '@scb/ui/icon';
import { TableModule } from 'primeng/table';
import { CreditCardRes } from './model';

@Component({
  selector: 'app-credit-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TableModule,
    Button,
    TranslocoDirective,
    TablePagination,
    TableSkeletonComponent,
    Icon,
    CurrencyView,
    DateView,
    DownloadButton,
    RolePermissionDirective,
  ],
  templateUrl: 'credit-card.ng.html',
  host: {
    class: 'block rounded-4xl bg-foreground px-xl sm:px-3xl 2xl:px-xl py-3xl',
  },
})
export class CreditCard {
  readonly http = inject(HttpClient);
  readonly router = inject(Router);

  readonly ccData = httpResource<CreditCardRes>(() => {
    const params = {
      pageStart: this.page.reqPageNumber(),
      pageSize: this.page.rows(),
    };
    return { url: '/api/dashboard/facilities-overview/CcList', params: handleParams(params) };
  });
  readonly status = apiStatus(this.ccData.status);

  readonly downloadOptions: DownloadOptions = {
    filename: 'facilities.facilitiesCreditCard.title',
    url: ext => `/api/dashboard/files/export/cc/user/format/${ext}`,
  };
  readonly ccList = computed(() => this.ccData.value()?.ccList || []);
  readonly page = new PaginationData();
  readonly totalRecords = computed(() => this.ccData.value()?.pagination.totalSize ?? 0);
  readonly totalPages = computed(() => this.ccData.value()?.pagination.totalPages ?? 0);

  readonly isEmpty = computed(() => this.ccList().length === 0);

  navigateToDetails(creditCardNumber: string) {
    this.router.navigate(['/dashboard/credit-card-details', creditCardNumber]);
  }
}
