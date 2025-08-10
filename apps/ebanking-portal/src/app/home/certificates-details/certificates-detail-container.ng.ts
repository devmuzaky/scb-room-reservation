import { NgIf } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, ResourceStatus } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '@/auth/api/auth.service';
import { AppBreadcrumbsComponent } from '@/core/components';
import { TranslocoDirective } from '@jsverse/transloco';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ExchangeRate } from '../dashboard/widgets/exchange-rate/exchange-rate';
import { QuickAction } from '../dashboard/widgets/quick-actions/quick-action.ng';
import { CertificateDetailsComponent } from './basic-details/certificate-details.ng';
import { CertificateBasicDetailsComponent } from './certificate-basic-details/certificate-basic-details.ng';
import { CertificateDetailsWidgetStatus } from './widget/certificate-details-widget';

@Component({
  selector: 'app-certificates-detail-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CertificateDetailsComponent,
    CertificateBasicDetailsComponent,
    QuickAction,
    ExchangeRate,
    RouterModule,
    BreadcrumbModule,
    AppBreadcrumbsComponent,
    TranslocoDirective,
    NgIf,
  ],
  template: `
    @if (showBreadcrumb) {
      <section class="px-3xl pt-3xl col-span-12 max-sm:hidden">
        <app-breadcrumbs
          *transloco="let t; prefix: 'breadcrumbs'"
          [routes]="[
            { label: t('home'), path: '/dashboard' },
            { label: t('certificateOverview'), path: '/dashboard/certificates' },
            { label: t('certificateDetail') },
          ]">
        </app-breadcrumbs>
      </section>
    }

    <section class="container-grid px-3xl pt-3xl">
      <ng-container *ngIf="canShowQuickActions()">
        <app-quick-action
          class="col-span-4 sm:col-span-6 2xl:col-span-4 2xl:col-start-9 2xl:row-span-1 2xl:row-start-1" />

        <app-certificate-details
          class="col-span-4 sm:col-span-6 2xl:col-span-8 2xl:col-start-1 2xl:row-span-2 2xl:row-start-1"
          [certificateDetailsData]="certificateDetailsResource" />

        <app-certificate-basic-details
          class="col-span-4 sm:col-span-6 2xl:col-span-8 2xl:col-start-1 2xl:row-span-2 2xl:row-start-3"
          [certificateDetailsData]="certificateDetailsResource" />

        <app-exchange-rate
          class="col-span-4 sm:col-span-6 2xl:col-span-4 2xl:col-start-9 2xl:row-span-3 2xl:row-start-2" />
      </ng-container>

      <ng-container *ngIf="!canShowQuickActions()">
        <app-certificate-details
          class="col-span-4 sm:col-span-6 2xl:col-span-8 2xl:col-start-1 2xl:row-span-2 2xl:row-start-1"
          [certificateDetailsData]="certificateDetailsResource" />

        <app-certificate-basic-details
          class="col-span-4 sm:col-span-6 2xl:col-span-8 2xl:col-start-1 2xl:row-span-2 2xl:row-start-3"
          [certificateDetailsData]="certificateDetailsResource" />

        <app-exchange-rate
          class="col-span-4 sm:col-span-6 2xl:col-span-4 2xl:col-start-9 2xl:row-span-4 2xl:row-start-1" />
      </ng-container>
    </section>
  `,
})
export default class CertificatesDetailContainerComponent {
  private route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);

  readonly showBreadcrumb = !this.route.snapshot.data['hideBreadcrumb'];

  readonly certificateId = computed(() => this.route.snapshot.paramMap.get('certificateId') || '');

  readonly certificateDetailsResource = httpResource<CertificateDetailsResponse>(() => {
    return { url: `/api/dashboard/account/certificates/${this.certificateId()}` };
  });

  readonly certificateDetails = computed(() => this.certificateDetailsResource.value());

  readonly status = computed<CertificateDetailsWidgetStatus>(() => {
    switch (this.certificateDetailsResource.status()) {
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

export interface CertificateDetailsResponse {
  cdNumber: string;
  cdType: string;
  cdName: string;
  displayName: string;
  issuanceDate: string;
  maturityDate: string;
  tenorInMonths: number;
  maturityRemaining: number;
  interestRate: number;
  interestAmount: number;
  interestCreditDate: string;
  interestFrequency: string;
  balance: number;
  currency: string;
  equivalentBalanceInEGP: number;
  actionAtMaturity: string;
  matured: boolean;
  linkedAccounts: {
    debitedAccount: string;
    redeemAccount: string;
    interestAccount: string;
  };
}
