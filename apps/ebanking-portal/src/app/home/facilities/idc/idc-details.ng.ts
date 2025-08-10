import { DatePipe } from '@angular/common';
import { HttpClient, httpResource } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppBreadcrumbsComponent, CardSkeletonComponent, CurrencyView, DateView, LastUpdated } from '@/core/components';
import { apiStatus } from '@/core/models/api';
import { ShortNumberPipe } from '@/core/pipes/short-number.pipe';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { DashboardStore } from '@/store/dashboard.store';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { Card } from '@scb/ui/card';
import { Icon } from '@scb/ui/icon';
import { Base64ConverterService } from '@scb/util/base64-converter';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'idc-details',
  providers: [DatePipe],
  imports: [
    TooltipModule,
    CardSkeletonComponent,
    TranslocoDirective,
    ShortNumberPipe,
    Icon,
    Card,
    AppBreadcrumbsComponent,
    Button,
    CurrencyView,
    DateView,
    LastUpdated,
  ],
  templateUrl: './idc-details.ng.html',
  host: {
    class: `container-grid py-3xl px-3xl gap-2xl`,
  },
})
export class IDCDetails {
  private readonly http = inject(HttpClient);
  readonly base64Converter = inject(Base64ConverterService);
  readonly dashboardStore = inject(DashboardStore);
  private route = inject(ActivatedRoute);
  readonly loading = signal(false);
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly datePipe = inject(DatePipe);
  readonly translateService = inject(TranslocoService);
  readonly lang = computed(() => this.layoutFacade.language());
  readonly idcNumber = computed(() => this.route.snapshot.paramMap.get('idcNumber') || '');

  readonly idcDetailsResource = httpResource<IdcDetails>(() => {
    return { url: `/api/dashboard/facilities-overview/idc/${this.idcNumber()}/details` };
  });

  readonly idcDetails = computed(() => this.idcDetailsResource.value());
  readonly lastUpdatedAt = computed(() => this.idcDetails()?.lastUpdatedTimestamp);
  readonly status = apiStatus(this.idcDetailsResource.status);
}

export interface IdcDetails {
  idcSwiftNumber: string;
  goodDescription: string | null;
  idcAmount: number;
  currency: string;
  idcType: string;
  idcTypeDescription: string;
  exporterName: string;
  idcCountry: string | null;
  dueDate: string | null;
  cashCover: number;
  cashCoverCurrency: string;
  cashCoverPercentage: number;
  isDeferred: boolean;
  lastUpdatedTimestamp: string;
}
