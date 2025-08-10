import { NgIf } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, inject, ResourceStatus } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '@/auth/api/auth.service';
import { AppBreadcrumbsComponent } from '@/core/components';
import { TranslocoDirective } from '@jsverse/transloco';
import { ExchangeRate } from '../dashboard/widgets/exchange-rate/exchange-rate';
import { QuickAction } from '../dashboard/widgets/quick-actions/quick-action.ng';
import { TimeDepositsBasicDetailsComponent } from './basic/basic-details';
import { TimeDepositsExtraDetailsComponent } from './extra/extra-details';

@Component({
  selector: 'time-deposits-details',
  imports: [
    RouterModule,
    TranslocoDirective,
    ExchangeRate,
    QuickAction,
    TimeDepositsBasicDetailsComponent,
    TimeDepositsExtraDetailsComponent,
    AppBreadcrumbsComponent,
    NgIf,
  ],
  template: `
    @if (showBreadcrumb) {
      <section class="px-3xl pt-3xl col-span-12 max-sm:hidden">
        <app-breadcrumbs
          *transloco="let t; prefix: 'breadcrumbs'"
          [routes]="[
            { label: t('home'), path: '/dashboard' },
            { label: t('timeDepositOverview'), path: '/dashboard/deposits' },
            { label: t('timeDepositDetails') },
          ]"></app-breadcrumbs>
      </section>
    }

    <section class="container-grid px-3xl pt-3xl">
      <ng-container *ngIf="canShowQuickActions()">
        <app-quick-action
          class="col-span-4 sm:col-span-6 2xl:col-span-4 2xl:col-start-9 2xl:row-span-1 2xl:row-start-1" />

        <time-deposits-basic-details
          [resource]="detailsResource"
          [status]="status()"
          class="col-span-4 sm:col-span-6 2xl:col-span-8 2xl:col-start-1 2xl:row-span-2 2xl:row-start-1" />

        <time-deposits-extra-details
          [resource]="detailsResource"
          [status]="status()"
          class="col-span-4 sm:col-span-6 2xl:col-span-8 2xl:col-start-1 2xl:row-span-2 2xl:row-start-3" />

        <app-exchange-rate
          class="col-span-4 sm:col-span-6 2xl:col-span-4 2xl:col-start-9 2xl:row-span-3 2xl:row-start-2" />
      </ng-container>

      <ng-container *ngIf="!canShowQuickActions()">
        <time-deposits-basic-details
          [resource]="detailsResource"
          [status]="status()"
          class="col-span-4 sm:col-span-6 2xl:col-span-8 2xl:col-start-1 2xl:row-span-2 2xl:row-start-1" />

        <time-deposits-extra-details
          [resource]="detailsResource"
          [status]="status()"
          class="col-span-4 sm:col-span-6 2xl:col-span-8 2xl:col-start-1 2xl:row-span-2 2xl:row-start-3" />

        <app-exchange-rate
          class="col-span-4 sm:col-span-6 2xl:col-span-4 2xl:col-start-9 2xl:row-span-4 2xl:row-start-1" />
      </ng-container>
    </section>
  `,
})
export class DepositDetailsPageComponent {
  private route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);

  readonly showBreadcrumb = !this.route.snapshot.data['hideBreadcrumb'];
  private tdNumber = computed(() => this.route.snapshot.paramMap.get('tdNumber') || '');

  readonly detailsResource = httpResource<TimeDepositsDetailsResponse>(() => {
    return `/api/dashboard/account/certificates/${this.tdNumber()}`;
  });

  readonly status = computed(() => {
    switch (this.detailsResource.status()) {
      case ResourceStatus.Loading:
      case ResourceStatus.Reloading:
        return 'loading';
      case ResourceStatus.Error:
        return 'error';
      default:
        return 'default';
    }
  });

  protected canShowQuickActions(): boolean {
    const userRoles = this.authService.getRolesFromToken();
    return userRoles.some(role => ['MAKER', 'SUPER_USER'].includes(role));
  }
}

export interface TimeDepositsDetailsResponse {
  tdNumber: string;
  tdType: string;
  tdName: string;
  displayName: string;
  issuanceDate: string;
  maturityDate: string;
  tenor: string;
  maturityLeft: number;
  interestRate: number;
  interestAmount: number;
  maturityRemaining: number;
  interestCreditDate: string;
  balance: number;
  currency: string;
  equivalentBalanceInEGP: number;
  actionAtMaturity: string;
  tenorInMonths: number;
  tenorInDays?: number;
  matured: boolean;
  linkedAccounts: {
    debitedAccount: string;
    redeemAccount: string;
    interestAccount: string;
  };
}
