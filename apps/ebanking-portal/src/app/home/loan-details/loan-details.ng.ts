import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, ResourceStatus } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppBreadcrumbsComponent, CardSkeletonComponent } from '@/core/components';
import { TranslocoDirective } from '@jsverse/transloco';
import { Card } from '@scb/ui/card';
import { Icon } from '@scb/ui/icon';
import { LoanBasicDetailsComponent } from './basic/basic.ng';
import { LoanDetailsResponse } from './models';
import RepaymentTableComponent from './repayment/repayment-ng';

@Component({
  selector: 'loan-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CurrencyPipe, DecimalPipe, DatePipe],
  imports: [
    LoanBasicDetailsComponent,
    TranslocoDirective,
    Card,
    Icon,
    CardSkeletonComponent,
    AppBreadcrumbsComponent,
    RepaymentTableComponent,
  ],
  templateUrl: './loan-details.ng.html',
  host: {
    class: `container-grid py-3xl px-3xl gap-2xl`,
  },
})
export default class OverdraftDetails {
  private route = inject(ActivatedRoute);

  readonly loanId = computed(() => this.route.snapshot.paramMap.get('loanId') || '');

  readonly loanDetailsResource = httpResource<LoanDetailsResponse>(() => {
    const params = { loanId: this.loanId() };
    return { url: `/api/dashboard/loans/details`, params };
  });
  readonly overdraftDetails = computed(() => this.loanDetailsResource.value());
  readonly status = computed(() => {
    switch (this.loanDetailsResource.status()) {
      case ResourceStatus.Loading:
      case ResourceStatus.Reloading:
        return 'loading';
      case ResourceStatus.Error:
        return 'error';
      default:
        return 'default';
    }
  });
}
