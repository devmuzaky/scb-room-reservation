import { HttpResourceRef } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CardSkeletonComponent, DateView } from '@/core/components';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective } from '@jsverse/transloco';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { TimeDepositsDetailsResponse } from '../deposit-details.page';
import { TimeDepositsDetailsWidget } from '../widget/deposit-details.widget';

@Component({
  selector: 'time-deposits-extra-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TooltipModule,
    TimeDepositsDetailsWidget,
    CardSkeletonComponent,
    TranslocoDirective,
    ProgressBarModule,
    DateView,
  ],
  templateUrl: './extra-details.html',
})
export class TimeDepositsExtraDetailsComponent {
  readonly resource = input.required<HttpResourceRef<TimeDepositsDetailsResponse | undefined>>();
  readonly status = input.required<string>();
  readonly depositDetails = computed(() => this.resource()?.value());
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly lang = computed(() => this.layoutFacade.language());
}
