import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { Card } from '@scb/ui/card';
import { StepperService } from '../stepper.service';

@Component({
  selector: 'soft-token-step-4-widget',
  imports: [CommonModule, Card, Button, TranslocoDirective],
  template: `
    <div
      *transloco="let t; prefix: 'softToken.stepFour'"
      class="px-4 pt-6 sm:px-6 sm:pt-4 lg:px-6">
      <scb-card>
        <div class="bg-color-background-container gap-6xl flex flex-col items-center rounded-2xl">
          <div class="gap-2xl flex flex-col items-center text-center">
            <div class="gap-md flex flex-col">
              <h2 class="head-xs-s text-text-primary">{{ t('completeActivation') }}</h2>
              <p class="body-md text-text-secondary">{{ t('description') }}</p>
            </div>

            <div class="flex w-full justify-center">
              <div class="flex w-full flex-col items-center gap-6 sm:flex-row">
                @for (guide of completeGuide; track guide.title) {
                  <div class="gap-3xl flex flex-col flex-wrap items-center justify-center">
                    <div class="flex flex-col items-center">
                      <img
                        [src]="guide.image"
                        width="200"
                        [alt]="guide.imageAlt" />
                    </div>

                    <p class="body-sm-s text-text-primary">{{ t(guide.title) }}</p>
                  </div>
                }
              </div>
            </div>
          </div>

          <div class="flex justify-center">
            <button
              scbButton
              (click)="finish()"
              size="xl"
              type="button">
              {{ t('doneButton') }}
            </button>
          </div>
        </div>
      </scb-card>
    </div>
  `,
})
export class SoftTokenStepFourWidget {
  private readonly stepperService = inject(StepperService);
  private readonly router = inject(Router);

  readonly completeGuide = [
    {
      title: 'completeActivation1',
      image: 'complete-activation-1.png',
      imageAlt: 'complete-activation-1',
    },
    {
      title: 'completeActivation2',
      image: 'complete-activation-2.png',
      imageAlt: 'complete-activation-2',
    },
  ];

  finish() {
    this.stepperService.markCurrentStepCompleted();
    this.stepperService.reset();
    this.router.navigate(['/soft-token']);
  }
}
