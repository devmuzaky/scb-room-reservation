import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ToasterService } from '@/core/components';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { Card } from '@scb/ui/card';
import { Icon } from '@scb/ui/icon';
import { SoftTokenStore } from '../soft-token.store';
import { StepperService } from '../stepper.service';

@Component({
  selector: 'soft-token-step-3-widget',
  imports: [CommonModule, Card, Icon, Button, TranslocoDirective],
  template: `
    <div
      *transloco="let t; prefix: 'softToken.stepTwo'"
      class="px-4 pt-4 sm:pt-6 lg:px-6 lg:pt-4">
      <scb-card>
        <div class="gap-2xl flex flex-col items-center">
          <div class="gap-md flex flex-col items-center text-center">
            <h2 class="head-xs-s text-text-primary">{{ t('title') }}</h2>
            <p class="body-sm text-text-secondary">
              {{ t('description') }}
            </p>
          </div>

          <!-- Activation code -->
          <div class="gap-4xl md:gap-6xl flex flex-col items-center text-center">
            <div class="gap-2xl flex flex-col rounded-4xl border border-gray-200 p-5 dark:border-gray-700">
              <!-- serial number -->
              <div
                class="gap-md flex flex-row justify-between rounded-lg bg-gray-100 px-4 py-2 text-center dark:bg-black">
                <div>
                  <span class="text-text-secondary body-md flex-none">
                    {{ t('serialNumber') }}
                  </span>
                  <span class="text-text-secondary body-md-s ltr-force overflow-x-auto overflow-y-hidden">
                    {{ softTokenStore.serialNumber() }}
                  </span>
                </div>
                <icon
                  name="copy"
                  (click)="copyActivationCode(softTokenStore.serialNumber())"
                  class="text-text-brand h-5 w-5 flex-none cursor-pointer hover:opacity-80" />
              </div>

              <div
                class="gap-md flex flex-row justify-between rounded-lg bg-gray-100 px-4 py-2 text-center dark:bg-black">
                <div>
                  <span class="text-text-secondary body-md flex-none">
                    {{ t('activationCode') }}
                  </span>
                  <span class="text-text-secondary body-md-s ltr-force overflow-x-auto overflow-y-hidden">
                    {{ softTokenStore.activationCode() }}
                  </span>
                </div>
                <icon
                  name="copy"
                  (click)="copyActivationCode(softTokenStore.activationCode())"
                  class="text-text-brand h-5 w-5 flex-none cursor-pointer hover:opacity-80" />
              </div>
            </div>

            <div class="gap-md flex w-full flex-col-reverse sm:flex-row">
              <button
                scbButton
                (click)="goBack()"
                size="xl"
                type="button"
                variant="secondary"
                class="w-full">
                {{ t('backButton') }}
              </button>
              <button
                scbButton
                (click)="continue()"
                size="xl"
                type="button"
                class="w-full">
                {{ t('continueButton') }}
              </button>
            </div>
          </div>
        </div>
      </scb-card>
    </div>
  `,
})
export class SoftTokenStepTwoWidget {
  readonly stepperService = inject(StepperService);
  readonly softTokenStore = inject(SoftTokenStore);
  readonly toaster = inject(ToasterService);
  readonly transloco = inject(TranslocoService);

  goBack() {
    this.stepperService.previousStep();
  }

  continue() {
    this.stepperService.markCurrentStepCompleted();
    this.stepperService.nextStep();
  }

  copyActivationCode(code: string) {
    const activationCode = code;
    if (activationCode) {
      navigator.clipboard
        .writeText(activationCode)
        .then(() => {
          this.toaster.showSuccess({
            summary: this.transloco.translate('softToken.stepTwo.copySuccess'),
            severity: 'info',
          });
        })
        .catch(err => {
          console.error('Failed to copy activation code:', err);
        });
    }
  }
}
