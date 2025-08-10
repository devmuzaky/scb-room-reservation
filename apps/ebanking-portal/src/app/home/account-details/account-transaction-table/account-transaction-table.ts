import { NgClass } from '@angular/common';
import { HttpParams, httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DateView, TableSkeletonComponent } from '@/core/components';
import { apiStatus } from '@/core/models/api';
import { NumberCommaFormatPipe } from '@/core/pipes/format-number.pipe';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective } from '@jsverse/transloco';
import { Breadcrumbs } from '@scb/ui/breadcrumb';
import { Button } from '@scb/ui/button';
import { FormField } from '@scb/ui/form-field';
import { Icon } from '@scb/ui/icon';
import { Option, Select, SelectTrigger } from '@scb/ui/select';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { AccountsListService } from '../../accounts-list/accounts-list.service';
import { AccountTransactionResponse, STATUS_OPTIONS, TRANSACTION_TYPE_OPTIONS } from '../account-details.models';
import { AccountBasicDetailWidget } from '../widget/account-details-widget';

@Component({
  selector: 'app-account-details-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AccountsListService, Breadcrumbs, TranslocoDirective],
  imports: [
    BreadcrumbModule,
    NgClass,
    TableModule,
    Select,
    SelectTrigger,
    Option,
    FormField,
    TranslocoDirective,
    Button,
    AccountBasicDetailWidget,
    TableSkeletonComponent,
    Icon,
    PaginatorModule,
    DropdownModule,
    FormsModule,
    SelectModule,
    NumberCommaFormatPipe,
    DateView,
  ],
  templateUrl: './account-transaction-table.html',
  styles: `
    .page-info-container .p-paginator-current {
      color: var(--color-text-secondary);
    }
  `,
})
export default class AccountTransactionsDetailTableComponent {
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly route = inject(ActivatedRoute);

  readonly darkMode = computed(() => this.layoutFacade.isDarkTheme());
  readonly transactionFilterOptions = computed(() => TRANSACTION_TYPE_OPTIONS);
  readonly statusFilterOptions = computed(() => STATUS_OPTIONS);
  readonly transactionTypeValue = signal<(typeof TRANSACTION_TYPE_OPTIONS)[number][]>([]);
  readonly statusTypeValue = signal<(typeof STATUS_OPTIONS)[number]>('');
  readonly accountId = computed(() => this.route.snapshot.paramMap.get('accountId'));
  readonly lang = computed(() => this.layoutFacade.language());
  readonly pageNumber = linkedSignal({ source: this.lang, computation: () => 0 });
  readonly totalPage = linkedSignal({ source: this.lang, computation: () => 1 });

  readonly first = signal(0);
  readonly rows = signal(10);
  readonly currentPage = linkedSignal({ source: this.lang, computation: () => 1 });
  readonly isAccountListEmpty = computed(
    () => !this.accountDetailList() || this.accountDetailList().transactions.length === 0,
  );
  readonly transactionSelect = viewChild<Select<string>>('transactionSelect');
  readonly selectedPage = signal(10);
  readonly paginationSizeOptions = signal([
    { label: '10', value: 10 },
    { label: '20', value: 20 },
    { label: '50', value: 50 },
    { label: '100', value: 100 },
  ]);

  readonly params = signal(this.getParams());
  readonly accountTransactionsList = httpResource<AccountTransactionResponse>(() => {
    return {
      url: `/api/dashboard/accounts/${this.accountId()}/transactions`,
      params: this.params(),
    };
  });

  readonly status = apiStatus(this.accountTransactionsList.status);

  readonly accountDetailList = computed(() => {
    const data = this.accountTransactionsList.value();
    return {
      totalPages: data?.pagination.totalPages || 0,
      totalSize: data?.pagination.totalSize || 0,
      transactions: data?.transactions || [],
    };
  });

  readonly totalPages = computed(() => this.accountTransactionsList.value()?.pagination.totalPages || 0);
  readonly totalSize = computed(() => this.accountTransactionsList.value()?.pagination.totalSize || 0);

  getParams() {
    let httpParams = new HttpParams()
      .set('pageNo', this.pageNumber().toString())
      .set('pageSize', this.rows().toString());

    const status = this.statusTypeValue();
    const transactionTypes = this.transactionTypeValue();
    if (status) {
      httpParams = httpParams.append('status', status);
    }

    if (transactionTypes.length > 0) {
      httpParams = httpParams.append('transactionTypes', transactionTypes.join(','));
    }

    return httpParams;
  }

  onPageChange(e: PaginatorState) {
    this.first.set(e.first as number);
    this.pageNumber.set(e.page as number);
    this.currentPage.set((e.page as number) + 1);
    this.rows.set(e.rows as number);
    this.reload();
  }

  applyFilter() {
    this.transactionSelect()?.close();
    this.first.set(0);
    this.rows.set(10);
    this.reload();
  }

  resetFilter() {
    this.first.set(0);
    this.rows.set(10);
    this.transactionTypeValue.set([]);
    this.transactionSelect()?.close();
    this.reload();
  }

  onPageSizeChange(e: DropdownChangeEvent) {
    this.rows.set(e.value as number);
    this.reload();
  }

  reload() {
    this.params.set(this.getParams());
  }
}
