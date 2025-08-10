import { CommonModule } from '@angular/common';
import { HttpClient, httpResource } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppBreadcrumbsComponent, Skeleton } from '@/core/components';
import { RolePermissionDirective } from '@/core/directives/role-permission.directive';
import { apiStatus } from '@/core/models/api';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { Card } from '@scb/ui/card';
import { Icon } from '@scb/ui/icon';
import { ProgressBarModule } from 'primeng/progressbar';
import { TransferDetailsDTO } from './Model/transfer-details.model';
import { TransferRepeatService } from './transferRepeat.service';
import { ApprovalTimelineWidget } from './widget/approval-timeline-widget';
import { RecurringDetailsWidget } from './widget/recurring-details-widget';
import { TransferAdditionalDetailWidget } from './widget/transfer-additional-detail.widget';
import { TransferSummaryWidget } from './widget/transfer-summary-widget';

@Component({
  selector: 'app-transfer-details',
  imports: [
    CommonModule,
    Card,
    AppBreadcrumbsComponent,
    TranslocoDirective,
    Button,
    Icon,
    ProgressBarModule,
    TransferSummaryWidget,
    TransferAdditionalDetailWidget,
    ApprovalTimelineWidget,
    RecurringDetailsWidget,
    Skeleton,
    RolePermissionDirective,
  ],
  templateUrl: './transfer-details.component.html',
})
export class TransferDetailsComponent {
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly http = inject(HttpClient);
  readonly errorMessage = signal<string>('');
  readonly translateService = inject(TranslocoService);
  readonly transferRepeatService = inject(TransferRepeatService);

  readonly transferId = signal<string>('');

  readonly resource = httpResource<TransferDetailsDTO>(() => ({
    url: `/api/transfer/transfers/details/${this.transferId()}`,
  }));

  readonly status = apiStatus(this.resource.status);

  readonly transferDetails = computed(() => this.resource.value() ?? null);

  constructor() {
    //get trasnferid from url
    this.route.params.subscribe(params => {
      this.transferId.set(params['transferid']);
    });
  }

  //reload when api did not get data
  refreshAll() {
    this.resource.reload();
  }

  repeatTransfer() {
    const details = this.transferDetails();
    const transferType = this.transferDetails()?.transferType;
    if (!transferType || !details) return;
    this.transferRepeatService.set(details);
    this.router.navigate(['/transfer/form', transferType]);
  }
}
