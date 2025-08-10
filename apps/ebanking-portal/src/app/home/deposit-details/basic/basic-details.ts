import { HttpResourceRef } from '@angular/common/http';
import { Component, computed, inject, input } from '@angular/core';
import { CardSkeletonComponent, DateView } from '@/core/components';
import { NumberCommaFormatPipe } from '@/core/pipes/format-number.pipe';
import { MaskedPipe } from '@/core/pipes/masked.pipe';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective } from '@jsverse/transloco';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { TimeDepositsDetailsResponse } from '../deposit-details.page';
import { TimeDepositsDetailsWidget } from '../widget/deposit-details.widget';

@Component({
  selector: 'time-deposits-basic-details',
  providers: [NumberCommaFormatPipe, MaskedPipe],
  templateUrl: './basic-details.html',
  imports: [
    TooltipModule,
    TimeDepositsDetailsWidget,
    CardSkeletonComponent,
    TranslocoDirective,
    ProgressBarModule,
    NumberCommaFormatPipe,
    DateView,
    MaskedPipe,
  ],
})
export class TimeDepositsBasicDetailsComponent {
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly masked = inject(MaskedPipe);
  readonly resource = input.required<HttpResourceRef<TimeDepositsDetailsResponse | undefined>>();
  readonly status = input.required<string>();
  readonly lang = computed(() => this.layoutFacade.language());
  readonly darkMode = computed(() => this.layoutFacade.isDarkTheme());
  readonly details = computed(() => this.resource()?.value());

  readonly maturityRemainingInDays = computed(() => {
    // BE returns maturityRemaining in months
    const maturityRemainingInMonths = this.details()?.maturityRemaining || 0;
    return maturityRemainingInMonths * 30;
  });

  readonly totalInDays = computed(() => {
    return this.details()?.tenorInDays || 1;
  });

  readonly progressValue = computed(
    () => ((this.totalInDays() - this.maturityRemainingInDays()) / this.totalInDays()) * 100,
  );
}

export type StatusOfResource = 'loading' | 'error' | 'default';
