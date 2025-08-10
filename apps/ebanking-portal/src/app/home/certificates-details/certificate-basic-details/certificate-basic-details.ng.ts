import { HttpResourceRef } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, input, ResourceStatus } from '@angular/core';
import { CardSkeletonComponent, DateView } from '@/core/components';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective } from '@jsverse/transloco';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { CertificateDetailsResponse } from '../certificates-detail-container.ng';
import { CertificateDetailsWidget, CertificateDetailsWidgetStatus } from '../widget/certificate-details-widget';

@Component({
  selector: 'app-certificate-basic-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TooltipModule,
    CertificateDetailsWidget,
    CardSkeletonComponent,
    TranslocoDirective,
    ProgressBarModule,
    DateView,
  ],
  templateUrl: './certificate-basic-details.ng.html',
})
export class CertificateBasicDetailsComponent {
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly lang = computed(() => this.layoutFacade.language());

  readonly certificateDetailsData = input<HttpResourceRef<CertificateDetailsResponse | undefined>>();
  readonly certificateDetails = computed(() => this.certificateDetailsData()?.value());
  readonly status = computed<CertificateDetailsWidgetStatus>(() => {
    switch (this.certificateDetailsData()?.status()) {
      case ResourceStatus.Loading:
      case ResourceStatus.Reloading:
        return 'loading';
      case ResourceStatus.Error:
        return 'error';
      default:
        return 'default';
    }
  });
}
