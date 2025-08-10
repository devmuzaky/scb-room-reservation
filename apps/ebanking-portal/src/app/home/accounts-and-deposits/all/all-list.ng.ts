import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CurrencyView, LastUpdated, TablePagination, TableSkeletonComponent } from '@/core/components';
import { apiStatus } from '@/core/models/api';
import { NumberCommaFormatPipe } from '@/core/pipes/format-number.pipe';
import { AccountDetailsService } from '@/home/account-details/account-details.service';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { Card } from '@scb/ui/card';
import { Icon } from '@scb/ui/icon';
import { Base64ConverterService } from '@scb/util/base64-converter';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { AccountsAndDepositsState } from '../accounts-and-deposits-state';
import { AllList, AllListResponse } from './all-list.models';

@Component({
  selector: 'app-all-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CurrencyPipe, DatePipe, DecimalPipe, AccountDetailsService],
  imports: [
    RouterLink,
    TooltipModule,
    Card,
    TableModule,
    Button,
    TableSkeletonComponent,
    Icon,
    TranslocoDirective,
    TablePagination,
    CurrencyView,
    LastUpdated,
    NumberCommaFormatPipe,
  ],
  templateUrl: './all-list.ng.html',
})
export class AllListPage implements OnDestroy {
  private readonly adState = inject(AccountsAndDepositsState);
  private readonly translateService = inject(TranslocoService);
  readonly router = inject(Router);
  readonly base64Converter = inject(Base64ConverterService);
  readonly accountDetailsService = inject(AccountDetailsService);
  readonly layoutFacade = inject(LayoutFacadeService);

  // --- State Signals ---
  readonly loading = signal(false);
  readonly page = this.adState.page;

  // --- Time Deposits Data ---
  readonly allListResource = httpResource<AllListResponse>(() => {
    const params = { page: this.page.reqPageNumber(), size: this.page.rows() };
    return { url: `/api/dashboard/accounts/all`, params };
  });

  readonly timeDepositsList = computed<AllList[]>(() => this.allListResource.value()?.accounts || []);
  readonly totalAmount = computed(() => this.allListResource.value()?.equivalentBalanceEGP || 0);
  readonly totalPages = computed(() => this.allListResource.value()?.pagination.totalPages || 0);
  readonly totalSize = computed(() => this.allListResource.value()?.pagination.totalSize || 0);

  readonly lastUpdatedAt = computed(() => this.allListResource.value()?.lastUpdatedTimestamp);
  readonly status = apiStatus(this.allListResource.status);
  // readonly allStatus = computed(() => {
  //   switch (this.allListResource.status()) {
  //     case ResourceStatus.Loading:
  //     case ResourceStatus.Reloading:
  //       return 'loading';
  //     case ResourceStatus.Error:
  //       return 'error';
  //     default:
  //       return 'default';
  //   }
  // });

  // --- Event Handlers for Time Deposits ---
  refreshAll() {
    this.allListResource.reload();
  }

  showAccountDetailPDF(row: AllList): void {
    const filename = this.translateService.translate('titles.accountsAndDetails');
    this.loading.set(true);
    this.accountDetailsService.generateAccountDetailPDF({ accountNumber: row.accountNumber }).subscribe({
      next: ({ pdfBase64 }) => {
        this.loading.set(false);
        this.base64Converter.downloadPdf(pdfBase64, filename);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  ngOnDestroy(): void {
    this.adState.page.resetPagination();
  }
}
