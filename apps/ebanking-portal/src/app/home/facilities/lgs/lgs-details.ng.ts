import { httpResource } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppBreadcrumbsComponent, CardSkeletonComponent, CurrencyView, DateView } from '@/core/components';
import { apiStatus } from '@/core/models/api';
import { TranslocoDirective } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { Card } from '@scb/ui/card';
import { Icon } from '@scb/ui/icon';

@Component({
  selector: 'lgs-details',
  imports: [
    CardSkeletonComponent,
    TranslocoDirective,
    Icon,
    Card,
    AppBreadcrumbsComponent,
    Button,
    CurrencyView,
    DateView,
  ],
  templateUrl: './lgs-details.ng.html',
  host: {
    class: `container-grid py-3xl px-3xl gap-2xl`,
  },
})
export class LGsDetails {
  private route = inject(ActivatedRoute);

  readonly lgNumber = this.route.snapshot.paramMap.get('lgNumber') || '';

  readonly lgsDetailsResource = httpResource<LgsDetails>(() => {
    return { url: `/api/dashboard/facilities-overview/lg/${this.lgNumber}` };
  });

  readonly lgDetails = computed(() => this.lgsDetailsResource.value());
  readonly lastUpdatedAt = computed(() => this.lgDetails()?.lastUpdatedTimestamp);
  readonly status = apiStatus(this.lgsDetailsResource.status);
  readonly beneficiaryName = computed(() => {
    const name = this.lgDetails()?.beneficiaryName;
    return !name || name === 'null' ? '-' : name;
  });
}

export interface LgsDetails {
  beneficiaryName: string;
  cashCoverAmount?: number;
  cashCoverAmountCurrency?: string;
  cashCoverPercentage: number;
  commissionsDebitedAccount: string;
  expiryDate: string;
  issuanceDate: string;
  lastUpdatedTimestamp: string;
  lgAmount: number;
  lgNumber: string;
  lgType: string;
  linkedCashCoverAccount?: string;
  numberOfExtensions: number;
  oldNumber: string;
  secure: boolean;
  purpose: string;
  lgCurrency: string;
}
