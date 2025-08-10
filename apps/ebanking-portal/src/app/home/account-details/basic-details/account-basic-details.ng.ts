import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CardSkeletonComponent, LastUpdated } from '@/core/components';
import { apiStatus } from '@/core/models/api';
import { NumberCommaFormatPipe } from '@/core/pipes/format-number.pipe';
import { MaskedPipe } from '@/core/pipes/masked.pipe';
import { ShortNumberPipe } from '@/core/pipes/short-number.pipe';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { DashboardStore } from '@/store/dashboard.store';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { Base64ConverterService } from '@scb/util/base64-converter';
import { TooltipModule } from 'primeng/tooltip';
import { AccountDetails } from '../account-details.models';
import { AccountDetailsService } from '../account-details.service';
import { AccountBasicDetailWidget } from '../widget/account-details-widget';

@Component({
  selector: 'app-account-basic-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AccountDetailsService, DatePipe, ShortNumberPipe, MaskedPipe],
  imports: [
    TooltipModule,
    Button,
    AccountBasicDetailWidget,
    CardSkeletonComponent,
    TranslocoDirective,
    ShortNumberPipe,
    NumberCommaFormatPipe,
    LastUpdated,
    MaskedPipe,
  ],
  templateUrl: './account-basic-details.ng.html',
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
  `,
})
export class AccountDetailsComponent {
  readonly base64Converter = inject(Base64ConverterService);
  readonly dashboardStore = inject(DashboardStore);
  readonly translocoService = inject(TranslocoService);
  private route = inject(ActivatedRoute);
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly datePipe = inject(DatePipe);
  readonly service = inject(AccountDetailsService);
  readonly masked = inject(MaskedPipe);

  private fileName = `AccountsDetails-${Date.now()}.pdf`;
  readonly accountId = computed<string | null>(() => this.route.snapshot.paramMap.get('accountId'));
  readonly lang = computed(() => this.layoutFacade.language());
  readonly loading = signal(false);

  readonly accountBasicDetailsResource = httpResource<AccountDetails>(() => {
    return `/api/dashboard/accounts/${this.accountId()}/details`;
  });

  readonly accountDetails = computed<AccountDetails | null>(() => this.accountBasicDetailsResource.value() || null);
  readonly lastUpdatedAt = computed(() => this.accountDetails()?.lastUpdated);
  readonly status = apiStatus(this.accountBasicDetailsResource.status);

  generateAccountDetailPDF(): void {
    this.loading.set(true);
    this.service.generateAccountDetailPDF({ accountNumber: this.accountId() }).subscribe({
      next: ({ pdfBase64 }) => {
        this.loading.set(false);
        this.base64Converter.downloadPdf(pdfBase64, this.fileName);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
