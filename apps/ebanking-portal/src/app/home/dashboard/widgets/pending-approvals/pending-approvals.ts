import { NgClass } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Skeleton } from '@/core/components';
import { apiStatus } from '@/core/models/api';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { Selectable, SelectableItem } from '@scb/ui/selectable';
import { DashboardWidget } from '../../dashboard-widget/dashboard-widget.ng';
import { PendingApprovalsCard } from '../../ui/pending-approvals-card/pending-approvals-card.ng';
import {
  ApproverTypes,
  PendingApprovalTypes,
  Tabs,
  TransactionGroup,
  TransactionResponse,
} from './pending-approvals.model';

@Component({
  selector: 'app-pending-approvals',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DashboardWidget,
    Skeleton,
    Selectable,
    SelectableItem,
    Button,
    ReactiveFormsModule,
    TranslocoDirective,
    PendingApprovalsCard,
    NgClass,
  ],
  templateUrl: './pending-approvals.html',
})
export class PendingApprovals {
  readonly translocoService = inject(TranslocoService);
  readonly ApprovalTypesEnum = ApproverTypes;
  readonly PendingApprovalTypesEnum = PendingApprovalTypes;
  readonly activeTab = signal<ApproverTypes.MAKER | ApproverTypes.CHECKER>(ApproverTypes.MAKER);
  readonly tabs = Tabs;

  readonly myApprovalsResource = httpResource<TransactionResponse>(`/api/dashboard/approvals/pending-my-approval`);
  readonly otherApprovalsResource = httpResource<TransactionResponse>(
    `/api/dashboard/approvals/pending-others-approval`,
  );

  readonly myApprovals = computed<TransactionResponse | undefined>(() => this.myApprovalsResource.value());
  readonly otherApprovals = computed<TransactionResponse | undefined>(() => this.otherApprovalsResource.value());

  readonly myApprovalsStatus = apiStatus(this.myApprovalsResource.status);
  readonly otherApprovalsStatus = apiStatus(this.otherApprovalsResource.status);

  approvalsDetail = computed(() => {
    const translationMap: { [key: string]: string } = {
      TRANSFERS: 'dashboard.pendingApprovals.transfers',
      PAYMENTS: 'dashboard.pendingApprovals.payments',
      REQUESTS: 'dashboard.pendingApprovals.requests',
      INVESTMENTS: 'dashboard.pendingApprovals.investments',
    };

    const translationDescMap: { [key: string]: string } = {
      TRANSFERS: 'dashboard.pendingApprovals.transferDetail',
      PAYMENTS: 'dashboard.pendingApprovals.paymentDetail',
      REQUESTS: 'dashboard.pendingApprovals.requestDetail',
      INVESTMENTS: 'dashboard.pendingApprovals.investmentDetail',
    };

    const iconMap: { [key: string]: string } = {
      TRANSFERS: 'bank-transfer',
      PAYMENTS: 'moneys',
      REQUESTS: 'card-coin',
      INVESTMENTS: 'trend-up',
    };

    const approvals =
      this.activeTab() === this.ApprovalTypesEnum.MAKER
        ? this.myApprovals()?.groups || []
        : this.otherApprovals()?.groups || [];

    return approvals.map((group: TransactionGroup) => {
      const key = group.groupId.toUpperCase() as keyof typeof translationMap;
      return {
        ...group,
        heading: this.translocoService.translate(translationMap[key]),
        description: this.translocoService.translate(translationDescMap[key]),
        icon: iconMap[key],
        totalTransactions: group.transactions.length,
      };
    });
  });
}
