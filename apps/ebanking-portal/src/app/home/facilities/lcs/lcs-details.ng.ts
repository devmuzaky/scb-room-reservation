import { DatePipe } from '@angular/common';
import { HttpClient, httpResource } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppBreadcrumbsComponent, CardSkeletonComponent, CurrencyView, DateView } from '@/core/components';
import { apiStatus } from '@/core/models/api';
import { NumberCommaFormatPipe } from '@/core/pipes/format-number.pipe';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { DashboardStore } from '@/store/dashboard.store';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { Card } from '@scb/ui/card';
import { Icon } from '@scb/ui/icon';
import { Base64ConverterService } from '@scb/util/base64-converter';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'lcs-details',
  providers: [DatePipe],
  imports: [
    TooltipModule,
    CardSkeletonComponent,
    TranslocoDirective,
    Icon,
    Card,
    AppBreadcrumbsComponent,
    Button,
    NumberCommaFormatPipe,
    CurrencyView,
    DateView,
  ],
  templateUrl: './lcs-details.ng.html',
  host: {
    class: `container-grid py-3xl px-3xl gap-2xl`,
  },
})
export class LCsDetails {
  private readonly http = inject(HttpClient);
  readonly base64Converter = inject(Base64ConverterService);
  readonly dashboardStore = inject(DashboardStore);
  private route = inject(ActivatedRoute);
  readonly loading = signal(false);
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly datePipe = inject(DatePipe);
  readonly translateService = inject(TranslocoService);
  readonly lang = computed(() => this.layoutFacade.language());
  readonly lcNumber = computed(() => this.route.snapshot.paramMap.get('lcNumber') || '');

  readonly lcsDetailsResource = httpResource<LcsDetails>(() => {
    return { url: `/api/dashboard/facilities-overview/lc/${this.lcNumber()}/details` };
  });

  readonly lcDetails = computed(() => this.lcsDetailsResource.value());
  readonly lastUpdatedAt = computed(() => this.lcDetails()?.lastUpdatedTimestamp);
  readonly status = apiStatus(this.lcsDetailsResource.status);
  readonly beneficiaryName = computed(() => {
    const name = this.lcDetails()?.beneficiaryName;
    return name === 'null' || !name ? '-' : name;
  });

  download(extension: string) {
    const filename = this.translateService.translate('titles.lcsDetails');
    this.loading.set(true);

    this.http
      .get<{
        file: string;
      }>(`/api/dashboard/files/export/certificates/user//format/${extension.toUpperCase()}`)
      .subscribe({
        next: ({ file }) => {
          this.loading.set(false);
          if (extension === 'pdf') {
            this.base64Converter.downloadPdf(file, filename);
          } else {
            this.base64Converter.base64ToFile(file, extension, filename);
          }
        },
      });
  }
}

export interface LcsDetails {
  lcSwiftNumber: string;
  goodDescription: string;
  lcAmount: number;
  currency: string;
  lcType: string;
  lcTypeDescription: string;
  beneficiaryName: string;
  expiryDate: string;
  dueDate: string | null;
  lcCountry: string;
  outstandingLimit: number;
  remainingLimit: number;
  cashCover: number;
  cashCoverCurrency: string;
  cashCoverPercentage: number;
  isDeferred: boolean;
  lastUpdatedTimestamp: string;
}
