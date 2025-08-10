import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '@/auth/api/auth.service';
import { AccountOverview } from './widgets/account-overview/accounts-overview';
import { ChequeIn } from './widgets/cheque-in/cheque-in';
import { ChequeOut } from './widgets/cheque-out/cheque-out';
import { ExchangeRate } from './widgets/exchange-rate/exchange-rate';
import { FacilitiesOverview } from './widgets/facilities-overview/facilities-overview';
import { PendingApprovals } from './widgets/pending-approvals/pending-approvals';
import { QuickAction } from './widgets/quick-actions/quick-action.ng';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AccountOverview,
    QuickAction,
    PendingApprovals,
    ChequeOut,
    ChequeIn,
    ExchangeRate,
    FacilitiesOverview,
    NgIf,
  ],
  template: `
    <!-- =============================================== -->
    <!-- SUPER_USER LAYOUT -->
    <!-- =============================================== -->
    <ng-container *ngIf="isSuperUser()">
      <app-account-overview
        class="col-span-4 max-h-[318px] sm:col-span-6 2xl:col-span-8 2xl:row-span-3 2xl:row-start-1" />

      <app-facilities-overview
        class="col-span-4 sm:col-span-6 2xl:col-span-8 2xl:col-start-1 2xl:row-span-1 2xl:row-start-4" />

      <app-quick-action
        class="col-span-4 sm:col-span-6 2xl:col-span-4 2xl:col-start-9 2xl:row-span-2 2xl:row-start-1" />

      <app-exchange-rate
        class="col-span-4 sm:col-span-6 2xl:col-span-4 2xl:col-start-9 2xl:row-span-2 2xl:row-start-3" />

      <app-cheque-in class="col-span-4 sm:col-span-6 2xl:col-span-6 2xl:col-start-1 2xl:row-span-1 2xl:row-start-5" />

      <app-cheque-out class="col-span-4 sm:col-span-6 2xl:col-span-6 2xl:col-start-7 2xl:row-span-1 2xl:row-start-5" />
    </ng-container>

    <!-- =============================================== -->
    <!-- CHECKER LAYOUT -->
    <!-- =============================================== -->
    <ng-container *ngIf="isChecker()">
      <app-account-overview
        class="col-span-4 max-h-[318px] sm:col-span-6 2xl:col-span-8 2xl:row-span-3 2xl:row-start-1" />

      <app-facilities-overview
        class="col-span-4 sm:col-span-6 2xl:col-span-8 2xl:col-start-1 2xl:row-span-1 2xl:row-start-4" />

      <app-pending-approvals
        class="col-span-4 sm:col-span-6 2xl:col-span-4 2xl:col-start-9 2xl:row-span-2 2xl:row-start-1" />

      <app-exchange-rate
        class="col-span-4 sm:col-span-6 2xl:col-span-4 2xl:col-start-9 2xl:row-span-2 2xl:row-start-3" />

      <app-cheque-in class="col-span-4 sm:col-span-6 2xl:col-span-6 2xl:col-start-1 2xl:row-span-1 2xl:row-start-5" />

      <app-cheque-out class="col-span-4 sm:col-span-6 2xl:col-span-6 2xl:col-start-7 2xl:row-span-1 2xl:row-start-5" />
    </ng-container>

    <!-- =============================================== -->
    <!-- MAKER LAYOUT -->
    <!-- =============================================== -->
    <ng-container *ngIf="isMaker()">
      <app-account-overview
        class="col-span-4 max-h-[318px] sm:col-span-6 2xl:col-span-8 2xl:row-span-3 2xl:row-start-1" />

      <app-facilities-overview
        class="col-span-4 sm:col-span-6 2xl:col-span-8 2xl:col-start-1 2xl:row-span-1 2xl:row-start-4" />

      <app-quick-action
        class="col-span-4 sm:col-span-6 2xl:col-span-4 2xl:col-start-9 2xl:row-span-1 2xl:row-start-1" />

      <div class="col-span-4 sm:col-span-6 2xl:col-span-4 2xl:col-start-9 2xl:row-span-3 2xl:row-start-2">
        <div class="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Request Approval</h3>
            <svg
              class="h-6 w-6 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="flex flex-grow flex-col justify-between">
            <p class="mb-4 text-sm text-gray-600">Submit your transactions and requests for approval by checkers.</p>
            <div class="space-y-3">
              <div class="rounded-lg bg-gray-50 p-4 text-center">
                <div class="text-2xl font-bold text-blue-600">12</div>
                <div class="text-sm text-gray-600">Pending Requests</div>
              </div>
              <button
                class="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
                View All Requests
              </button>
            </div>
          </div>
        </div>
      </div>

      <app-cheque-in class="col-span-4 sm:col-span-6 2xl:col-span-4 2xl:col-start-1 2xl:row-span-1 2xl:row-start-5" />

      <app-cheque-out class="col-span-4 sm:col-span-6 2xl:col-span-4 2xl:col-start-5 2xl:row-span-1 2xl:row-start-5" />

      <app-exchange-rate
        class="col-span-4 sm:col-span-6 2xl:col-span-4 2xl:col-start-9 2xl:row-span-1 2xl:row-start-5" />
    </ng-container>

    <!-- =============================================== -->
    <!-- VIEWER LAYOUT -->
    <!-- =============================================== -->
    <ng-container *ngIf="isViewer()">
      <app-account-overview
        class="col-span-4 max-h-[318px] sm:col-span-6 2xl:col-span-12 2xl:row-span-3 2xl:row-start-1" />

      <app-facilities-overview
        class="col-span-4 sm:col-span-6 2xl:col-span-12 2xl:col-start-1 2xl:row-span-1 2xl:row-start-4" />

      <app-cheque-in class="col-span-4 sm:col-span-6 2xl:col-span-4 2xl:col-start-1 2xl:row-span-1 2xl:row-start-5" />

      <app-cheque-out class="col-span-4 sm:col-span-6 2xl:col-span-4 2xl:col-start-5 2xl:row-span-1 2xl:row-start-5" />

      <app-exchange-rate
        class="col-span-4 sm:col-span-6 2xl:col-span-4 2xl:col-start-9 2xl:row-span-1 2xl:row-start-5" />
    </ng-container>
  `,
  host: {
    class: `container-grid py-3xl px-3xl`,
  },
})
export default class DashboardComponent {
  private readonly authService = inject(AuthService);

  protected isSuperUser(): boolean {
    const userRoles = this.authService.getRolesFromToken();
    return userRoles.includes('SUPER_USER');
  }

  protected isMaker(): boolean {
    const userRoles = this.authService.getRolesFromToken();
    return userRoles.includes('MAKER') && !userRoles.includes('SUPER_USER');
  }

  protected isChecker(): boolean {
    const userRoles = this.authService.getRolesFromToken();
    return userRoles.some(role => ['CHECKER_LEVEL_1', 'CHECKER_LEVEL_2', 'CHECKER_LEVEL_3'].includes(role));
  }

  protected isViewer(): boolean {
    const userRoles = this.authService.getRolesFromToken();
    return !userRoles.some(role =>
      ['SUPER_USER', 'MAKER', 'CHECKER_LEVEL_1', 'CHECKER_LEVEL_2', 'CHECKER_LEVEL_3'].includes(role),
    );
  }
}
