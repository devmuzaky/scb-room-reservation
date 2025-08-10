import { HttpResourceRef } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, input, ResourceStatus } from '@angular/core';
import { CardSkeletonComponent, DateView } from '@/core/components';
import { NumberCommaFormatPipe } from '@/core/pipes/format-number.pipe';
import { MaskedPipe } from '@/core/pipes/masked.pipe';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective } from '@jsverse/transloco';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { CertificateDetailsResponse } from '../certificates-detail-container.ng';
import { CertificateDetailsWidget } from '../widget/certificate-details-widget';

@Component({
  selector: 'app-certificate-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MaskedPipe, NumberCommaFormatPipe],
  imports: [
    TooltipModule,
    CertificateDetailsWidget,
    CardSkeletonComponent,
    TranslocoDirective,
    ProgressBarModule,
    DateView,
    NumberCommaFormatPipe,
    MaskedPipe,
  ],
  templateUrl: './certificate-details.ng.html',
})
export class CertificateDetailsComponent {
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly masked = inject(MaskedPipe);
  readonly darkMode = computed(() => this.layoutFacade.isDarkTheme());
  readonly certificateDetailsData = input<HttpResourceRef<CertificateDetailsResponse | undefined>>();
  readonly certificateDetails = computed(() => this.certificateDetailsData()?.value());
  readonly progressValue = computed(() => {
    const totalTenorMonths = this.certificateDetails()?.tenorInMonths || 1;
    const maturityLeftMonths = this.certificateDetails()?.maturityRemaining || 0;
    return ((totalTenorMonths - maturityLeftMonths) / totalTenorMonths) * 100;
  });

  readonly lang = computed(() => this.layoutFacade.language());

  readonly status = computed(() => {
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
