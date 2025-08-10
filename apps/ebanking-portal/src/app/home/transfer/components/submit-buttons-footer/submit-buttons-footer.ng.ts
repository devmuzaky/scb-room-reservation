import { Component, inject, input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { TransferService } from '../../transfer.service';

@Component({
  selector: 'submit-buttons-footer',
  imports: [Button, TranslocoPipe, RouterLink],
  template: `
    @if (transfer.step() === 'form') {
      <div class="col-span-4 col-start-1 sm:col-start-6 2xl:col-span-1 2xl:col-start-11">
        <button
          (click)="transfer.onContinueClick('summary', form())"
          scbButton
          size="lg"
          class="w-full"
          [disabled]="transfer.exchangeApiFailed()">
          {{ 'transfer.form.continue' | transloco }}
        </button>
      </div>
    }

    @if (transfer.step() === 'summary' || transfer.step() === 'otp') {
      <div class="col-span-4 col-start-1 max-sm:order-2 sm:col-span-1 sm:col-start-5 2xl:col-start-10">
        <button
          (click)="transfer.onBackClick()"
          scbButton
          variant="secondary"
          class="w-full"
          size="lg">
          {{ 'transfer.form.back' | transloco }}
        </button>
      </div>

      <div class="col-span-4 col-start-1 max-sm:order-1 sm:col-span-1 sm:col-start-6 2xl:col-start-11">
        <button
          (click)="transfer.onContinueClick('otp', form())"
          scbButton
          class="w-full"
          size="lg">
          {{ 'transfer.form.continue' | transloco }}
        </button>
      </div>
    }

    @if (transfer.step() === 'success') {
      <div class="col-span-4 col-start-1 sm:col-span-2 sm:col-start-2 2xl:col-start-5">
        <a
          scbButton
          size="lg"
          type="button"
          routerLink="/dashboard"
          class="w-full whitespace-nowrap">
          {{ 'transfer.summary.returnToDashboard' | transloco }}
        </a>
      </div>
      <div class="col-span-4 col-start-1 sm:col-span-2 sm:col-start-4 2xl:col-start-7">
        <button
          scbButton
          size="lg"
          routerLink="/transfer"
          variant="secondary"
          type="button"
          class="w-full">
          {{ 'transfer.summary.makeAnotherTransfer' | transloco }}
        </button>
      </div>
    }
  `,
  host: {
    class: 'page-grid p-0 py-xl',
  },
})
export class SubmitButtonsFooter {
  readonly transfer = inject(TransferService);
  readonly form = input.required<FormGroup>();
}
