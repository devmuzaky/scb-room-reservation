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
  selector: 'overdraft-tab',
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
  templateUrl: 'overdraft.ng.html',
  host: {
    class: 'block rounded-4xl bg-foreground px-xl sm:px-3xl 2xl:px-xl py-3xl',
  },
})
export class OverdraftTabComponent {
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly route = inject(ActivatedRoute);
  readonly activatedRoute = inject(ActivatedRoute);
  readonly router = inject(Router);

  readonly overdraftId = computed(() => this.activatedRoute.snapshot.paramMap.get('overdraftId') || '');
  readonly darkMode = computed(() => this.layoutFacade.isDarkTheme());
  readonly lang = computed(() => this.layoutFacade.language());

  readonly refresh = signal(1);
  readonly overDraftResource = httpResource<OverdraftResponse>(() => {
    const _ = this.refresh();
    const params = new HttpParams()
      .set('pageStart', this.pageNumber().toString())
      .set('pageSize', this.rows().toString());
    return { url: `/api/dashboard/overdrafts/user`, params };
  });

  readonly loansList = computed(() => this.overDraftResource.value()?.overdraftsList || []);
  readonly rows = signal(10);
  readonly first = signal(0);
  readonly pageNumber = linkedSignal({ source: this.lang, computation: () => 0 });
  readonly totalSize = computed<number>(() => this.overDraftResource.value()?.pagination.totalSize || 0);
  readonly totalPages = computed<number>(() => this.overDraftResource.value()?.pagination.totalPages || 0);
  readonly isEmpty = computed(() => this.loansList().length === 0);

  readonly paginationSizeOptions = signal([
    { label: '10', value: 10 },
    { label: '20', value: 20 },
    { label: '50', value: 50 },
    { label: '100', value: 100 },
  ]);

  readonly downloadOptions: DownloadOptions = {
    filename: 'facilities.facilitiesOverdraft.title',
    url: ext => {
      const queryParams = new URLSearchParams({
        pageStart: this.pageNumber().toString(),
        pageSize: this.rows().toString(),
      });
      return `/api/dashboard/files/export/overdrafts/user/format/${ext}?${queryParams.toString()}`;
    },
  };

  readonly status = apiStatus(this.overDraftResource.status);

  navigateToDetails(accountNumber: string) {
    this.router.navigate(['/dashboard/overdraft-details', accountNumber]);
  }

  onPageChange(e: PaginatorState) {
    this.first.set(e.first as number);
    this.pageNumber.set(e.page as number);
    this.rows.set(e.rows as number);
    this.overDraftResource.reload();
  }

  onPageSizeChange(e: DropdownChangeEvent) {
    this.rows.set(e.value as number);
    this.overDraftResource.reload();
  }

  payNow(e: Event) {
    e.stopPropagation();
    e.preventDefault();
  }
}

export interface OverdraftResponse {
  pagination: Pagination;
  overdraftsList: Overdraft[];
}

export interface Overdraft {
  accountNumber: string;
  accountName: string;
  currency: string;
  utilizedBalance: number;
  dueAmount: number;
  dueDate: string;
}
