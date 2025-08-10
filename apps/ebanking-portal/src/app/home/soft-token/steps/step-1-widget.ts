import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { ToasterService } from '@/core/components';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { Card } from '@scb/ui/card';
import { Icon } from '@scb/ui/icon';
import { QRCodeComponent } from 'angularx-qrcode';
import { SoftTokenInitiateResponse } from '../models';
import { SoftTokenStore } from '../soft-token.store';
import { StepperService } from '../stepper.service';

@Component({
  selector: 'soft-token-step-1-widget',
  imports: [CommonModule, Card, Icon, Button, TranslocoDirective, QRCodeComponent],
  template: `
    <div
      *transloco="let t; prefix: 'softToken.stepOne'"
      class="px-4 pt-4 sm:pt-8 lg:px-6 lg:pt-4">
      <scb-card>
        <div class="gap-2xl flex flex-col items-center">
          <!-- Title and description -->
          <div class="gap-md flex flex-col items-center text-center">
            <h2 class="head-xs-s text-text-primary">
              {{ t('title') }}
            </h2>
            <p class="body-sm text-text-secondary">
              {{ t('description') }}
            </p>
          </div>

          <!-- Download buttons -->
          <div class="gap-2xl flex w-full flex-col items-center justify-center md:w-auto md:flex-row md:gap-16">
            @for (option of downloadOptions; track option.icon) {
              <div
                class="gap-2xl p-2xl flex w-full flex-col items-center rounded-4xl border border-gray-200 dark:border-gray-700">
                <div class="flex items-center gap-2">
                  <icon [name]="option.icon" />
                  <span class="text-text-primary head-2xs-s">{{ t(option.title) }}</span>
                </div>

                <qrcode
                  [qrdata]="option.qrCodeLink"
                  [ariaLabel]="'QR Code image with the following content...'"
                  [elementType]="'img'"
                  [cssClass]="'h-[200px] w-[200px] rounded-md border border-gray-200 bg-white p-md'"
                  [scale]="1"
                  [width]="200"></qrcode>

                <p class="body-sm-s text-text-tertiary">{{ t(option.description) }}</p>
                <a
                  scbButton
                  variant="secondary"
                  icon="download"
                  size="sm"
                  [href]="option.qrCodeLink"
                  target="_blank"
                  type="button">
                  {{ t(option.button) }}
                </a>
              </div>
            }
          </div>

          <!-- Continue button -->
          <div class="flex flex-col items-center justify-center">
            <button
              scbButton
              (click)="continue()"
              size="xl"
              [loading]="loading()"
              type="button">
              {{ t('continueButton') }}
            </button>
          </div>
        </div>
      </scb-card>
    </div>
  `,
})
export class SoftTokenStepOneWidget {
  private readonly stepperService = inject(StepperService);
  private readonly http = inject(HttpClient);
  private readonly softTokenStore = inject(SoftTokenStore);
  private readonly toasterService = inject(ToasterService);
  private readonly translateService = inject(TranslocoService);
  readonly loading = signal(false);

  readonly downloadOptions = [
    {
      icon: 'apple',
      title: 'forIphone',
      description: 'cannotScan',
      button: 'downloadIOS',
      qrCodeLink: 'https://apps.apple.com/eg/app/scb-token/id6450172901',
    },
    {
      icon: 'google-play',
      title: 'forAndroid',
      description: 'cannotScan',
      button: 'downloadAndroid',
      qrCodeLink: 'https://play.google.com/store/search?q=scb+token&c=apps&hl=en',
    },
  ];

  continue() {
    this.loading.set(true);
    this.http
      .post<SoftTokenInitiateResponse>('/api/soft-token/token/initiate', {})
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: res => {
          this.softTokenStore.setActivationCode(res.activationCode);
          this.softTokenStore.setQrCode(res.qrCode);
          this.softTokenStore.setQrCodeLink(res.qrCodeLink);
          this.softTokenStore.setSerialNumber(res.serialNumber);

          this.stepperService.markCurrentStepCompleted();
          this.stepperService.nextStep();
        },
        error: err => {
          this.toasterService.showError({
            severity: 'error',
            summary: this.translateService.translate('softToken.error.apiError'),
            detail: this.translateService.translate('softToken.error.apiErrorDetail'),
          });
        },
      });
  }
}
