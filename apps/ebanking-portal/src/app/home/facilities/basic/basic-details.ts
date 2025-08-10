import { NgClass } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { CurrencyView, DateView, DownloadButton, DownloadOptions, LastUpdated } from '@/core/components';
import { FacilitiesOverviewRes } from '@/home/dashboard/widgets/facilities-overview/facilities.models';
import { TranslocoDirective } from '@jsverse/transloco';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'facilities-basic-details',
  templateUrl: 'basic-details.html',
  imports: [
    NgClass,
    TranslocoDirective,
    TooltipModule,
    TranslocoDirective,
    LastUpdated,
    DateView,
    CurrencyView,
    DownloadButton,
  ],
})
export class FacilitiesBasicDetailsComponent {
  readonly details = input<FacilitiesOverviewRes>();
  readonly reload = output();
  readonly isEmpty = computed(() => !this.details());

  readonly lastUpdatedAt = computed(() => this.details()?.lastUpdated);

  readonly downloadOptions: DownloadOptions = {
    filename: 'facilities.basicDetails.title',
    extension: ['pdf', 'excel'],
    url: ext => {
      return `/api/dashboard/files/export/facilities/user/format/${ext}`;
    },
  };
}
