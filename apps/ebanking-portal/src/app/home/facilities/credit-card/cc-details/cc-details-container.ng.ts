import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AppBreadcrumbsComponent, LastUpdated } from '@/core/components';
import { TranslocoDirective } from '@jsverse/transloco';
import { CreditCardList } from './cc-details-list.ng';
import { CcDetails } from './cc-details.ng';
import { CcDetailsService } from './cc-details.service';

@Component({
  selector: 'app-cc-details-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CcDetailsService],
  imports: [AppBreadcrumbsComponent, TranslocoDirective, CcDetails, CreditCardList, LastUpdated],
  template: ` <section class="col-span-12 flex items-center justify-between max-sm:hidden 2xl:row-span-1">
      <app-breadcrumbs
        *transloco="let t; prefix: 'breadcrumbs'"
        [routes]="[
          { label: t('home'), path: '/dashboard' },
          { label: t('facilities'), path: '/dashboard/facilities' },
          { label: t('creditCardDetails') },
        ]"></app-breadcrumbs>
      @if (!ccDetails.hideRefresh()) {
        <app-last-updated
          [date]="ccDetails.date()"
          (refresh)="ccDetails.reload()" />
      }
    </section>

    <!-- Basic Details -->
    <section class="gap-2xl col-span-12 flex flex-col">
      <app-cc-details />
      <app-cc-details-list />
    </section>`,
  host: {
    class: `container-grid px-xl py-2xl sm:py-3xl sm:px-3xl gap-2xl`,
  },
})
export default class CcDetailsContainer {
  readonly ccDetails = inject(CcDetailsService);
}
