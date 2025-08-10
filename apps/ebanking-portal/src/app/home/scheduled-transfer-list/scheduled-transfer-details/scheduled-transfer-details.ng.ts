import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AppBreadcrumbsComponent, CurrencyView, DateView, Skeleton } from '@/core/components';
import { RolePermissionDirective } from '@/core/directives/role-permission.directive';
import { apiStatus } from '@/core/models/api';
import { AccountSelectedView } from '@/home/transfer/components/account-selected/account-selected-view.ng';
import { BeneficiarySelectedView } from '@/home/transfer/components/beneficiary-selected/beneficiary-selected-view.ng';
import { TranslocoDirective } from '@jsverse/transloco';
import { Alert } from '@scb/ui/alert';
import { Button } from '@scb/ui/button';
import { Card } from '@scb/ui/card';
import { Icon } from '@scb/ui/icon';
import { Separator } from '@scb/ui/separator';
import { TransferProgress } from '../transfer-progress.ng';
import { UpcomingTransferDetails } from '../upcoming-transfer/upcoming-transfer-details.ng';
import { ScheduledTransferDetailsRes } from './model';
import { ScheduledTransferDetailsService } from './schduled-transfer-details.service';

@Component({
  selector: 'app-scheduled-transfer-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ScheduledTransferDetailsService],
  imports: [
    Card,
    Button,
    CurrencyView,
    DateView,
    AccountSelectedView,
    BeneficiarySelectedView,
    AppBreadcrumbsComponent,
    TranslocoDirective,
    Separator,
    Icon,
    TransferProgress,
    UpcomingTransferDetails,
    Skeleton,
    Alert,
    RouterLink,
    RolePermissionDirective,
  ],
  templateUrl: './scheduled-transfer-details.ng.html',
  host: {
    class: 'container-grid py-3xl px-3xl',
  },
})
export default class ScheduledTransferDetails {
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly stService = inject(ScheduledTransferDetailsService);

  readonly scheduleId = this.route.snapshot.params['scheduledId'];
  readonly scheduledTransfer = httpResource<ScheduledTransferDetailsRes>(
    () => {
      const _ = this.refreshIt();
      return `/api/transfer/transfers/recurring/details/${this.scheduleId}`;
    },
    { defaultValue: {} as ScheduledTransferDetailsRes },
  );
  readonly data = computed(() => this.scheduledTransfer.value());
  readonly status = apiStatus(this.scheduledTransfer.status);
  readonly isRecurring = computed(() => {
    const ft = this.data()?.scheduleDto?.frequencyType;
    return ft && ft !== 'ONCE' ? true : false;
  });
  readonly refreshIt = signal(0);

  goBack = () => {
    this.router.navigate(['..'], { relativeTo: this.route });
  };

  cancel(id: string) {
    if (this.isRecurring()) {
      this.stService.cancelAll(id, this.goBack);
    } else {
      this.stService.cancelTransfer(id, this.goBack);
    }
  }

  reload(type: 'back' | 'reload') {
    if (type === 'back') {
      this.goBack();
    } else {
      this.refreshIt.update(x => x + 1);
    }
  }
}
