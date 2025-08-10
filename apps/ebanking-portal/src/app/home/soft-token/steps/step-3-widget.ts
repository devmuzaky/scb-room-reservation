import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ToasterService } from '@/core/components';
import { RegistrationCodeFormatDirective } from '@/core/directives/registration-code-format.directive';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { Card } from '@scb/ui/card';
import { Error, FormField, ScbInput } from '@scb/ui/form-field';
import { Icon } from '@scb/ui/icon';
import { markControlsTouched } from '@scb/ui/input';
import { SoftTokenActivateResponse } from '../models';
import { StepperService } from '../stepper.service';

@Component({
  selector: 'soft-token-step-2-widget',
  imports: [
    CommonModule,
    Card,
    Icon,
    ScbInput,
    Error,
    Button,
    FormField,
    Button,
    TranslocoDirective,
    ReactiveFormsModule,
    RegistrationCodeFormatDirective,
  ],
  template: `
    <div
      *transloco="let t; prefix: 'softToken.stepThree'"
      class="px-4 pt-4 sm:pt-6 lg:px-6 lg:pt-4">
      <scb-card>
        <div class="gap-2xl flex flex-col items-center">
          <div class="gap-md flex flex-col items-center text-center">
            <h2 class="head-xs-s text-text-primary">
              {{ t('title') }}
            </h2>
            <p class="body-sm text-text-secondary">
              {{ t('description') }}
            </p>
          </div>

          <!-- Enter device id -->
          <div class="gap-4xl md:gap-6xl flex flex-col items-center text-center">
            <div class="flex w-full justify-center">
              <div
                class="gap-3xl flex w-full flex-col items-center rounded-4xl border border-gray-200 p-5 dark:border-gray-700">
                <div class="flex w-full flex-col items-center gap-2">
                  <div class="relative flex h-14 w-14 items-center justify-center">
                    <icon
                      [name]="'token-otp'"
                      class="text-3xl" />
                  </div>
                  <h3 class="head-lg-sm text-text-primary">{{ t('enterRegistrationCode') }}</h3>
                  <h5 class="body-lg text-text-secondary">{{ t('codeFromApp') }}</h5>
                </div>

                <div class="flex justify-center">
                  <!-- Registration code field -->
                  <scb-form-field class="w-full">
                    <input
                      scbInput
                      registrationCodeFormat
                      [formControl]="registrationCode"
                      class="head-md-s! ltr-force text-center" />
                    <p scbError="required">
                      {{ t('registrationCodeValidation.required') }}
                    </p>
                    <p scbError="minlength">
                      {{ t('registrationCodeValidation.invalid') }}
                    </p>
                  </scb-form-field>
                </div>
              </div>
            </div>

            <div class="gap-md flex w-full flex-col-reverse sm:flex-row">
              <button
                scbButton
                (click)="goBack()"
                size="xl"
                type="button"
                variant="secondary"
                class="w-full whitespace-nowrap">
                {{ t('backButton') }}
              </button>
              <button
                (click)="getActivationCode()"
                scbButton
                size="xl"
                type="button"
                class="w-full whitespace-nowrap"
                [loading]="loading()">
                {{ t('verifyButton') }}
              </button>
            </div>
          </div>
        </div>
      </scb-card>
    </div>
  `,
})
export class SoftTokenStepThreeWidget {
  private readonly stepperService = inject(StepperService);
  private readonly http = inject(HttpClient);
  private readonly toasterService = inject(ToasterService);
  private readonly translateService = inject(TranslocoService);

  readonly registrationCode = new FormControl<string>('', [Validators.required, Validators.minLength(13)]);
  readonly showError = signal(false);

  readonly loading = signal(false);

  goBack() {
    this.stepperService.previousStep();
  }

  getActivationCode() {
    if (this.registrationCode.invalid) {
      markControlsTouched(this.registrationCode, { dirty: true, touched: true });
      return;
    }
    const registrationCode = this.registrationCode.value?.replace(/[^a-zA-Z0-9]/g, '');
    this.loading.set(true);
    this.http
      .post<SoftTokenActivateResponse>('/api/soft-token/token/activate', { registrationCode })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: response => {
          if (response.activated) {
            this.stepperService.markCurrentStepCompleted();
            this.stepperService.nextStep();
          }
        },
        error: () => {
          this.toasterService.showError({
            severity: 'error',
            summary: this.translateService.translate('softToken.error.apiError'),
            detail: this.translateService.translate('softToken.error.apiErrorDetail'),
          });
        },
      });
  }
}
