import { DatePipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Button } from '@scb/ui/button';
import { Icon } from '@scb/ui/icon';
import { TooltipModule } from 'primeng/tooltip';
import { PendingApprovalTypes, TransactionDetail } from '../../widgets/pending-approvals/pending-approvals.model';

@Component({
  selector: 'app-pending-approvals-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Button, ReactiveFormsModule, NgClass, TooltipModule],
  providers: [DatePipe],
  template: `
    @if (approvalsDetail()) {
      <div
        class="gap-lg py-md flex"
        data-testid="DASH_PENDING_APPROVALS_CARD">
        <div
          class="p-md h-5xl w-5xl flex-none rounded-full"
          [ngClass]="{
            'bg-icon-container-blue': approvalType() === pendingApprovalTypesEnum.TRANSFER,
            'bg-icon-container-purple': approvalType() === pendingApprovalTypesEnum.PAYMENTS,
            'bg-icon-container': approvalType() === pendingApprovalTypesEnum.REQUEST,
          }">
          <icon
            [name]="approvalsDetail()?.icon || ''"
            data-testid="DASH_PENDING_APPROVALS_ICON"
            [ngClass]="{
              'text-icon-blue':
                approvalType() === pendingApprovalTypesEnum.TRANSFER || pendingApprovalTypesEnum.REQUEST,
              'text-icon-purple': approvalType() === pendingApprovalTypesEnum.PAYMENTS,
            }" />
        </div>
        <div class="gap-sm flex flex-col">
          <h4
            class="mf-md flex flex-col font-medium"
            data-testid="DASH_PENDING_APPROVALS_CARD_H4_TEXT">
            {{ approvalsDetail()?.heading }}
          </h4>
          <p
            class="mf-sm text-text-tertiary line-clamp-1 overflow-hidden text-ellipsis"
            data-testid="DASH_PENDING_APPROVALS_CARD_P_TEXT"
            pInputText
            [pTooltip]="approvalsDetail()?.description"
            [tooltipStyleClass]="getTooltipClass()"
            tooltipPosition="bottom"
            placeholder="bottom">
            {{ approvalsDetail()?.description }}
          </p>
        </div>
        <div class="mf-sm justify-content flex flex-none items-center gap-2 font-semibold ltr:ml-auto rtl:mr-auto">
          {{ approvalsDetail()?.totalTransactions }}
          <button
            scbButton
            variant="link"
            suffixIcon="arrow-right"
            data-testid="DASH_PENDING_APPROVALS_CARD_TOTAL_BUTTON"
            size="sm"
            class="text-icon-tertiary"></button>
        </div>
      </div>
    }
  `,
  styles: `
    .p-tooltip {
      text-align: center;
    }
    .p-tooltip-text {
      font-size: 13px;
      font-weight: 500;
      background: #161d27 !important;
      line-height: 16px !important;
    }
    .dark .p-tooltip-text {
      background: #f3f4f6 !important;
      color: #1f2937;
    }
    .p-tooltip-arrow {
      border-top-color: #161d27 !important;
      border-bottom-color: #161d27 !important;
    }
    .dark .p-tooltip-arrow {
      border-top-color: #f3f4f6 !important;
      border-bottom-color: #f3f4f6 !important;
    }
    .requests,
    .transfer {
      min-width: 225px;
    }
  `,
})
export class PendingApprovalsCard {
  readonly pendingApprovalTypesEnum = PendingApprovalTypes;
  readonly approvalsDetail = input<TransactionDetail>();
  readonly approvalType = input<string>();

  getTooltipClass(): string {
    return this.approvalsDetail()?.heading?.toLowerCase() || '';
  }
}
