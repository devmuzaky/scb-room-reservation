import { NgClass, NgComponentOutlet } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { Card } from '@scb/ui/card';
import { Icon } from '@scb/ui/icon';
import { StepperModule } from 'primeng/stepper';
import { StepperService } from './stepper.service';
import { SoftTokenStepOneWidget } from './steps/step-1-widget';
import { SoftTokenStepTwoWidget } from './steps/step-2-widget';
import { SoftTokenStepThreeWidget } from './steps/step-3-widget';
import { SoftTokenStepFourWidget } from './steps/step-4-widget';

@Component({
  selector: 'soft-token-form',
  imports: [StepperModule, TranslocoDirective, Card, Icon, NgComponentOutlet, NgClass],
  template: `
    <div
      *transloco="let t; prefix: 'softToken.stepper'"
      class="hidden px-4 pt-6 sm:block sm:pt-8 lg:px-6 lg:pt-6">
      <p-stepper
        class="w-full"
        [value]="stepperService.currentStep()">
        <p-step-list>
          @for (step of stepperService.allStepsState(); track step.id) {
            <p-step
              [value]="step.id"
              [ngClass]="{ 'valid-step': step.isCompleted || step.isActive }"
              >{{ t(step.titleKey) }}
            </p-step>
          }
        </p-step-list>
      </p-stepper>
    </div>

    @if (currentWidget()) {
      <ng-container *ngComponentOutlet="currentWidget()" />
    }

    <div
      *transloco="let t; prefix: 'softToken.viewDemo'"
      class="mb-2 px-4 pt-4 sm:pt-8 lg:px-6 lg:pt-4">
      <scb-card>
        <div class="gap-lg flex w-full items-center">
          <div class="bg-icon-container-blue h-12 w-12 rounded-full">
            <icon
              class="m-3"
              name="video-play" />
          </div>

          <div class="gap-sm flex flex-col">
            <h3 class="head-xs-s text-text-primary">{{ t('demoTitle') }}</h3>
            <a
              class="text-primary body-md-s underline"
              href="https://www.youtube.com"
              target="_blank">
              {{ t('demoLink') }}
            </a>
          </div>
        </div>
      </scb-card>
    </div>
  `,
})
export class SoftTokenFormComponent {
  readonly stepperService = inject(StepperService);

  // Component mapping based on step number
  private readonly stepComponents = [
    SoftTokenStepOneWidget, // Step 1
    SoftTokenStepTwoWidget, // Step 3
    SoftTokenStepThreeWidget, // Step 2
    SoftTokenStepFourWidget, // Step 4
  ];

  // Current widget - clean and readable
  currentWidget = computed(() => {
    const currentStep = this.stepperService.currentStep();
    return this.stepComponents[currentStep - 1];
  });
}
