import { Component, inject, input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { ChequeBookService } from '../chequebook.service';

@Component({
  selector: 'submit-chequebook-buttons-footer',
  imports: [Button, TranslocoPipe, RouterLink],
  template: `
    @if (chequeBook.step() === 'form') {
      <div class="col-span-4 col-start-1 max-sm:order-1 sm:col-span-2 sm:col-start-6 2xl:col-start-10">
        <button
          (click)="chequeBook.onContinueClick('form', form())"
          scbButton
          class="w-full"
          size="lg">
          {{ 'chequeBook.form.submit' | transloco }}
        </button>
      </div>
    }

    @if (chequeBook.step() === 'success') {
      <div class="col-span-4 col-start-1 sm:col-span-2 sm:col-start-2 2xl:col-start-5">
        <a
          scbButton
          size="lg"
          type="button"
          routerLink="/dashboard"
          class="w-full">
          {{ 'chequeBook.form.returnToDashboard' | transloco }}
        </a>
      </div>
      <div class="col-span-4 col-start-1 sm:col-span-2 sm:col-start-4 2xl:col-start-7">
        <button
          scbButton
          size="lg"
          routerLink="/chequebook"
          variant="secondary"
          type="button"
          class="w-full">
          {{ 'chequeBook.form.requestNewChequeBook' | transloco }}
        </button>
      </div>
    }
  `,
  host: {
    class: 'page-grid p-0 py-xl',
  },
})
export class SubmitChequeBookButtonsFooter {
  readonly chequeBook = inject(ChequeBookService);
  readonly form = input.required<FormGroup>();
}
