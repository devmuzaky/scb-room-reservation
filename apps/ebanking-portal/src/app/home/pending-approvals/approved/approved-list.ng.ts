import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  CurrencyView,
  DateView,
  PaginationData,
  SelectValue,
  TablePagination,
  TableSkeletonComponent,
} from '@/core/components';
import { apiStatus, handleParams } from '@/core/models/api';
import { AccountDetailsService } from '@/home/account-details/account-details.service';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { Card } from '@scb/ui/card';
import { Icon } from '@scb/ui/icon';
import { Option, Select } from '@scb/ui/select';
import { Base64ConverterService } from '@scb/util/base64-converter';
import { PaginatorModule } from 'primeng/paginator';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { AllDelegationList, AllListResponse } from '../all/all-list.models';
import { ApprovalProgress } from '../approval-progress.ng';
import { PendingApprovalFilter } from '../pending-transactions-filter.ng';

@Component({
  selector: 'approved-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CurrencyPipe, DatePipe, DecimalPipe, AccountDetailsService],
  imports: [
    TooltipModule,
    Card,
    TableModule,
    Button,
    TableSkeletonComponent,
    Icon,
    TranslocoDirective,
    TablePagination,
    CurrencyView,
    Button,
    PaginatorModule,
    Select,
    SelectModule,
    CurrencyView,
    SelectValue,
    Option,
    DateView,
    CurrencyView,
    TablePagination,
    PendingApprovalFilter,
    Button,
    ApprovalProgress,
  ],
  templateUrl: './approved-list.ng.html',
})
export class ApprovedList {
  private readonly translateService = inject(TranslocoService);
  readonly router = inject(Router);
  readonly base64Converter = inject(Base64ConverterService);
  readonly accountDetailsService = inject(AccountDetailsService);
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly transferType = signal<any[]>([]);
  readonly loading = signal(false);
  readonly page = new PaginationData();
  readonly refresh = signal(1);

  readonly allListResource = httpResource<AllListResponse>(() => {
    const params = {
      pageStart: this.page.reqPageNumber(),
      pageSize: this.page.rows(),
    };
    return { url: '/api/delegation/list', params: handleParams(params) };
  });

  readonly allDelegationsList = computed<AllDelegationList[]>(() => this.allListResource.value()?.list || []);
  readonly totalAmount = computed(() => this.allListResource.value()?.equivalentBalanceEGP || 0);
  readonly totalPages = computed(() => this.allListResource.value()?.pagination.totalPages || 0);
  readonly totalSize = computed(() => this.allListResource.value()?.pagination.totalSize || 0);
  readonly totalRecords = computed(() => this.allListResource.value()?.pagination.totalSize || 0);

  readonly lastUpdatedAt = computed(() => this.allListResource.value()?.lastUpdatedTimestamp);
  readonly status = apiStatus(this.allListResource.status);
  readonly isEmpty = computed(() => this.allDelegationsList().length === 0);

  // --- Event Handlers for Time Deposits ---
  refreshAll() {
    this.allListResource.reload();
  }
}
