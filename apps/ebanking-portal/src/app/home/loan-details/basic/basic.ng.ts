import { DatePipe } from '@angular/common';
import { HttpResourceRef } from '@angular/common/http';
import { Component, computed, inject, input } from '@angular/core';
import { DateView } from '@/core/components';
import { RolePermissionDirective } from '@/core/directives/role-permission.directive';
import { NumberCommaFormatPipe } from '@/core/pipes/format-number.pipe';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { MenuModule } from 'primeng/menu';
import { ProgressBar } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { LoanDetailsResponse } from '../models';

@Component({
  selector: 'loan-basic-details',
  templateUrl: 'basic.ng.html',
  imports: [
    ProgressBar,
    TranslocoDirective,
    TooltipModule,
    Button,
    MenuModule,
    NumberCommaFormatPipe,
    DateView,
    RolePermissionDirective,
  ],
})
export class LoanBasicDetailsComponent {
  readonly detailsResource = input<HttpResourceRef<LoanDetailsResponse | undefined>>();
  readonly status = input<'loading' | 'error' | 'default'>('loading');
  readonly datePipe = inject(DatePipe);
  readonly translateService = inject(TranslocoService);
  readonly layoutFacade = inject(LayoutFacadeService);

  readonly darkMode = computed(() => this.layoutFacade.isDarkTheme());
  readonly details = computed(() => this.detailsResource()?.value());
  readonly lang = computed(() => this.layoutFacade.language());

  readonly progressValue = computed(() => {
    const paidAmount = this.details()?.paidAmount || 1;
    const totalAmount = this.details()?.totalLoanAmount || 0;
    return (paidAmount / totalAmount) * 100;
  });
}
