import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { Alert } from '@scb/ui/alert';
import { Button } from '@scb/ui/button';
import { Card } from '@scb/ui/card';
import { Error, FormField, Label, ScbInput } from '@scb/ui/form-field';
import { markControlsTouched } from '@scb/ui/input';
import { ActivateUser } from './activate-user';

@Component({
  selector: 'app-activate-user-one',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, Card, FormField, ScbInput, Label, Error, Button, Alert, TranslocoDirective],
  template: `
    <scb-card
      class="gap-md flex flex-col items-center"
      *transloco="let t">
      <form
        [formGroup]="form"
        (ngSubmit)="submit()"
        class="gap-3xl sm:gap-4xl flex flex-col"
        data-testid="AU_FORM">
        <h4
          class="head-md-s 2xl:head-lg-s text-center"
          data-testid="AU_TEXT_TITLE">
          {{ t('activateUser.title') }}
        </h4>
        <p
          class="text-text-secondary body-lg items-center text-center"
          data-testid="AU_TEXT_DESC">
          <ng-content select=".ac-desc" />
        </p>
        <div class="gap-2xl flex flex-col">
          <scb-form-field data-testid="AU_FIELD_USERNAME">
            <label
              scbLabel
              data-testid="AU_LABEL_USERNAME"
              >{{ t('username') }}</label
            >
            <input
              scbInput
              formControlName="username"
              class="test-username"
              data-testid="AU_INPUT_USERNAME" />
            <p
              scbError="required"
              data-testid="AU_ERROR_USERNAME">
              {{ t('usernameRequired') }}
            </p>
          </scb-form-field>
          @if (isInvalid()) {
            <scb-alert
              [title]="t('activateUser.invalidCredentials')"
              [desc]="t('activateUser.invalidUsername')"
              hideClose
              data-testid="AU_ALERT_INCORRECT_CREDENTIALS" />
          }
        </div>
        <button
          scbButton
          type="submit"
          class="w-full"
          [loading]="loading()"
          data-testid="AU_BTN_CONTINUE">
          {{ t('continue') }}
        </button>
      </form>
    </scb-card>
  `,
})
export class ActivateUserComponent {
  public readonly au = inject(ActivateUser);

  readonly loading = signal(false);

  readonly form = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  readonly isInvalid = signal(false);

  submit() {
    if (this.form.invalid) return markControlsTouched(this.form);

    if (this.loading()) return;

    this.loading.set(true);
    this.isInvalid.set(false);
    const { username } = this.form.getRawValue();
    this.au.username.set(username);
    this.loading.set(false);
    this.au.next();
  }
}
