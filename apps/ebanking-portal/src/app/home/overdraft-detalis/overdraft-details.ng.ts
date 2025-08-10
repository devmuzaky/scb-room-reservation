import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, ResourceStatus, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppBreadcrumbsComponent, CardSkeletonComponent } from '@/core/components';
import { TranslocoDirective } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { Card } from '@scb/ui/card';
import { Icon } from '@scb/ui/icon';
import { Tab, TabChangeEvent, TabHeader, Tabs } from '@scb/ui/tabs';
import { OverdraftBasicDetailsComponent } from './basic/basic-details';
import TransactionsTableComponent from './transactions/transactions.ng';
import UpcomingTableComponent from './upcoming-dues/upcoming.ng';

@Component({
  selector: 'overdraft-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe, CurrencyPipe, DecimalPipe],
  imports: [
    OverdraftBasicDetailsComponent,
    TranslocoDirective,
    Card,
    Icon,
    CardSkeletonComponent,
    AppBreadcrumbsComponent,
    UpcomingTableComponent,
    TransactionsTableComponent,
    Tabs,
    Tab,
    TabHeader,
    Button,
  ],
  templateUrl: './overdraft-details.html',
  host: {
    class: `container-grid py-3xl px-3xl gap-2xl`,
  },
})
export default class OverdraftDetails {
  private route = inject(ActivatedRoute);

  readonly accountNumber = computed(() => this.route.snapshot.paramMap.get('overdraftId') || '');
  readonly selectedTab = signal<number>(0);

  readonly overdraftDetailsResource = httpResource<OverdraftDetailsResponse>(() => {
    return {
      url: `/api/dashboard/facilities-overview/overdraft-summary`,
      params: { accountNumber: this.accountNumber() },
    };
  });

  readonly overdraftDetails = computed(() => this.overdraftDetailsResource.value());

  readonly status = computed<OverdraftDetailsStatus>(() => {
    switch (this.overdraftDetailsResource.status()) {
      case ResourceStatus.Loading:
      case ResourceStatus.Reloading:
        return 'loading';
      case ResourceStatus.Error:
        return 'error';
      default:
        return 'default';
    }
  });

  onTabChange(tabId: TabChangeEvent): void {
    this.selectedTab.set(tabId.index);
  }
}

export interface OverdraftDetailsResponse {
  isSecured: boolean;
  accountNumber: string;
  accountType: string;
  iban: string;
  accountName: string;
  linkedAccount: string;
  utilizedAmount: number;
  pledgedAmount: number;
  availableToUse: number;
  interestRate: number;
  currency: string;
  maturityDate: string; // ISO date format
  lastUpdatedTimestamp: string; // ISO timestamp format
}

export type OverdraftDetailsStatus = 'empty' | 'loading' | 'error' | 'default';
