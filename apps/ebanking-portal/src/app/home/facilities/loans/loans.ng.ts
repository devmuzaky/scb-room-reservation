import { HttpParams, httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyView, DateView, DownloadButton, DownloadOptions, TableSkeletonComponent } from '@/core/components';
import { RolePermissionDirective } from '@/core/directives/role-permission.directive';
import { apiStatus, Pagination } from '@/core/models/api';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { Icon } from '@scb/ui/icon';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'loans-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TableModule,
    Button,
    Icon,
    TranslocoDirective,
    PaginatorModule,
    DropdownModule,
    FormsModule,
    SelectModule,
    TableSkeletonComponent,
    DateView,
    CurrencyView,
    DownloadButton,
    RolePermissionDirective,
  ],
  templateUrl: 'loans.ng.html',
  host: {
    class: 'block rounded-4xl bg-foreground px-xl sm:px-3xl 2xl:px-xl py-3xl',
  },
})
export class LoansTabComponent {
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);

  readonly darkMode = computed(() => this.layoutFacade.isDarkTheme());
  readonly lang = computed(() => this.layoutFacade.language());

  readonly refresh = signal(1);
  readonly LoansResource = httpResource<LoansListResponse>(() => {
    const _ = this.refresh();
    const params = new HttpParams()
      .set('pageStart', this.pageNumber().toString())
      .set('pageSize', this.rows().toString());
    return { url: `/api/dashboard/loans/user`, params };
  });

  readonly loansList = computed(() => this.LoansResource.value()?.loansList || []);

  readonly rows = signal(10);
  readonly first = signal(0);
  readonly pageNumber = linkedSignal({ source: this.lang, computation: () => 0 });
  readonly totalPages = computed(() => this.LoansResource.value()?.pagination.totalPages);
  readonly totalRecords = computed<number>(() => this.LoansResource.value()?.pagination.totalSize || 0);
  readonly isEmpty = computed(() => this.loansList().length === 0);

  readonly paginationSizeOptions = signal([
    { label: '10', value: 10 },
    { label: '20', value: 20 },
    { label: '50', value: 50 },
    { label: '100', value: 100 },
  ]);

  readonly downloadOptions: DownloadOptions = {
    filename: 'facilities.facilitiesLoans.title',
    url: ext => {
      const queryParams = new URLSearchParams({
        page: this.pageNumber().toString(),
        size: this.rows().toString(),
      });
      return `/api/dashboard/files/export/loans/user/format/${ext}?${queryParams.toString()}`;
    },
  };

  readonly status = apiStatus(this.LoansResource.status);

  navigateToDetails(loanId: string) {
    this.router.navigate(['/dashboard/loan-details', loanId]);
  }

  onPageChange(e: PaginatorState) {
    this.first.set(e.first as number);
    this.pageNumber.set(e.page as number);
    this.rows.set(e.rows as number);
    this.LoansResource.reload();
  }

  onPageSizeChange(e: DropdownChangeEvent) {
    this.rows.set(e.value as number);
    this.LoansResource.reload();
  }
}

export interface LoansListResponse {
  pagination: Pagination;
  loansList: Loan[];
}

export interface Loan {
  accountNumber: string;
  accountName: string;
  loanBalance: number;
  loanId: string;
  installmentAmount: number;
  installmentDate: number;
}
