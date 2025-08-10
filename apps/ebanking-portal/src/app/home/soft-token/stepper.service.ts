// stepper.store.ts
import { computed, Injectable, signal } from '@angular/core';

export interface StepState {
  id: number;
  titleKey: string;
  isCompleted: boolean;
  isActive: boolean;
  canNavigate: boolean;
}

@Injectable({ providedIn: 'root' })
export class StepperService {
  private readonly _currentStep = signal(1);
  private readonly _totalSteps = signal(4);
  private readonly _completedSteps = signal<Set<number>>(new Set());
  private readonly _stepKeys = signal<string[]>(['step1Title', 'step2Title', 'step3Title', 'step4Title']);

  // Public computed signals
  readonly currentStep = computed(() => this._currentStep());
  readonly totalSteps = computed(() => this._totalSteps());
  readonly completedSteps = computed(() => this._completedSteps());
  readonly stepKeys = computed(() => this._stepKeys());

  // Step state computed signals
  readonly currentStepState = computed(() => ({
    id: this._currentStep(),
    titleKey: this._stepKeys()[this._currentStep() - 1],
    isCompleted: this._completedSteps().has(this._currentStep()),
    isActive: true,
    canNavigate: this.canNavigateToStep(this._currentStep()),
  }));

  readonly allStepsState = computed(() =>
    this._stepKeys().map((titleKey, index) => {
      const stepId = index + 1;
      return {
        id: stepId,
        titleKey,
        isCompleted: this._completedSteps().has(stepId),
        isActive: stepId === this._currentStep(),
        canNavigate: this.canNavigateToStep(stepId),
      };
    }),
  );

  // Derive step guide from stepper service for consistency
  readonly activationsStepsGuide = computed(() => {
    const stepKeys = this.stepKeys();
    return stepKeys.map((stepKey, index) => ({
      title: `steps.step${index + 1}Title`,
      description: `steps.step${index + 1}Description`,
    }));
  });

  // Navigation computed signals
  readonly canGoNext = computed(
    () => this._currentStep() < this._totalSteps() && this.canNavigateToStep(this._currentStep()),
  );

  readonly canGoPrevious = computed(() => this._currentStep() > 1);

  // Navigation methods
  nextStep(): boolean {
    if (!this.canGoNext()) {
      return false;
    }

    const currentStep = this._currentStep();
    this._currentStep.set(currentStep + 1);
    return true;
  }

  previousStep(): boolean {
    if (!this.canGoPrevious()) {
      return false;
    }

    const currentStep = this._currentStep();
    const newStep = currentStep - 1;
    this._currentStep.set(newStep);

    // Clear completed steps that come after the current step
    this._completedSteps.update(completed => {
      const newCompleted = new Set(completed);
      // Remove any steps that come after the current step
      for (let i = newStep + 1; i <= this._totalSteps(); i++) {
        newCompleted.delete(i);
      }
      return newCompleted;
    });

    return true;
  }

  markCurrentStepCompleted(): void {
    this.markStepCompleted();
  }

  // Step completion methods
  private markStepCompleted(stepNumber?: number): void {
    const stepToMark = stepNumber ?? this._currentStep();

    if (this.isValidStepNumber(stepToMark)) {
      this._completedSteps.update(completed => {
        const newCompleted = new Set(completed);
        newCompleted.add(stepToMark);
        return newCompleted;
      });
    }
  }

  // Reset and initialization methods
  reset(): void {
    this._currentStep.set(1);
    this._completedSteps.set(new Set());
  }

  // Utility methods
  private isValidStepNumber(stepNumber: number): boolean {
    return stepNumber >= 1 && stepNumber <= this._totalSteps();
  }

  private canNavigateToStep(stepNumber: number): boolean {
    // Can navigate to current step or any completed step
    if (stepNumber === this._currentStep()) {
      return true;
    }

    // Can navigate to any previous step
    if (stepNumber < this._currentStep()) {
      return true;
    }

    // Can navigate to next step only if current step is completed
    if (stepNumber === this._currentStep() + 1) {
      return this._completedSteps().has(this._currentStep());
    }

    return false;
  }

  // Legacy compatibility
  get step() {
    return this.currentStep;
  }
}
