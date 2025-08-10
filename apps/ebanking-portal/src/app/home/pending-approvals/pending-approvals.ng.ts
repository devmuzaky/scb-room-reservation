import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RolePermissionDirective } from '@/core/directives/role-permission.directive';
import { Tab, TabLazy, Tabs } from '@scb/ui/tabs';
import { AllList } from './all/all-list.ng';
import { ApprovedList } from './approved/approved-list.ng';
import { PendingRequestsApprovalsService } from './pending-approvals.service';
import PendingTransactions from './pending-transactions.ng';
import { PendingList } from './pending/pending-list.ng';
import { RejectedList } from './rejected/rejected-list.ng';
import { WaitingList } from './waiting/waiting-list.ng';

@Component({
  selector: 'app-pending-approvals',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PendingRequestsApprovalsService],
  imports: [
    Tabs,
    Tab,
    TabLazy,
    PendingTransactions,
    ApprovedList,
    WaitingList,
    RejectedList,
    RolePermissionDirective,
    PendingList,
    AllList,
  ],
  template: `<div class="gap-2xl col-span-12 row-span-8">
    <scb-tabs
      [(selectedIndex)]="activeIndex"
      class="!bg-transparent">
      <scb-tab
        label="All"
        *rolePermission="['SUPER_USER', 'MAKER', 'CHECKER']">
        <all-list *scbTabLazy />
      </scb-tab>
      <scb-tab
        label="Pending"
        *rolePermission="['SUPER_USER', 'MAKER', 'CHECKER']">
        <pending-list *scbTabLazy />
      </scb-tab>
      <scb-tab
        label="Waiting Others Approvals"
        *rolePermission="['SUPER_USER', 'MAKER', 'CHECKER']">
        <waiting-list *scbTabLazy />
      </scb-tab>
      <scb-tab
        label="Approved"
        *rolePermission="['SUPER_USER', 'MAKER', 'CHECKER']">
        <approved-list *scbTabLazy />
      </scb-tab>
      <scb-tab
        label="Rejected"
        *rolePermission="['SUPER_USER', 'MAKER', 'CHECKER']">
        <rejected-list *scbTabLazy />
      </scb-tab>
    </scb-tabs>
  </div> `,
  host: {
    class: 'container-grid py-3xl px-3xl',
  },
})
export default class PendingApprovals {
  readonly activeIndex = signal(0);
}
