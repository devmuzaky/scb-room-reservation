import { DatePipe } from '@angular/common';
import { HttpClient, HttpResourceRef } from '@angular/common/http';
import { Component, computed, inject, input, ResourceStatus, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CurrencyView, LastUpdated } from '@/core/components';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { Base64ConverterService } from '@scb/util/base64-converter';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';
import { OverdraftDetailsResponse } from '../overdraft-details.ng';

@Component({
  selector: 'overdraft-basic-details',
  templateUrl: 'basic-details.html',
  providers: [DatePipe],
  imports: [TranslocoDirective, TooltipModule, Button, MenuModule, CurrencyView, LastUpdated],
})
export class OverdraftBasicDetailsComponent {
  private readonly http = inject(HttpClient);
  private readonly base64Converter = inject(Base64ConverterService);
  readonly translateService = inject(TranslocoService);
  private route = inject(ActivatedRoute);
  readonly datePipe = inject(DatePipe);
  readonly layoutFacade = inject(LayoutFacadeService);

  readonly resource = input.required<HttpResourceRef<OverdraftDetailsResponse | undefined>>();

  readonly darkMode = computed(() => this.layoutFacade.isDarkTheme());
  readonly accountNumber = computed(() => this.route.snapshot.paramMap.get('overdraftId') || '');

  readonly overdraftDetails = computed(() => this.resource().value());

  readonly lang = computed(() => this.layoutFacade.language());
  readonly status = computed(() => {
    switch (this.resource().status()) {
      case ResourceStatus.Loading:
      case ResourceStatus.Reloading:
        return 'loading';
      case ResourceStatus.Error:
        return 'error';
      default:
        return 'default';
    }
  });
  readonly lastUpdatedAt = computed(() => this.overdraftDetails()?.lastUpdatedTimestamp);

  readonly loading = signal(false);
  private fileName = this.translateService.translate('overdraftDetailsPage.basicDetails.overdraftSummary');

  shareAccountDetail(): void {
    if (this.loading()) return;
    this.loading.set(true);
    this.http
      .post<{
        pdfBase64: string;
      }>('/api/dashboard/accounts/account-details/pdf', { accountNumber: this.accountNumber() })
      .subscribe({
        next: ({ pdfBase64 }) => {
          this.base64Converter.downloadPdf(pdfBase64, this.fileName);
        },
      });
  }
}
