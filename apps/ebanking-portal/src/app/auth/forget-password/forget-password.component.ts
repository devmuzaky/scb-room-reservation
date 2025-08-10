import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiError } from '@/models/api';
import { ERR } from '@/models/error';
import { lockedUserTitleDesc } from '@/utils/utils';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Autofocus } from '@scb/ui/a11y';
import { Alert } from '@scb/ui/alert';
import { alertPortal } from '@scb/ui/alert-dialog';
import { Button } from '@scb/ui/button';
import { Card } from '@scb/ui/card';
import { Error, FormField, Label, ScbInput } from '@scb/ui/form-field';
import { markControlsTouched } from '@scb/ui/input';
import { getPhoneDigits } from '../otp/otp.component';
import { ForgetPassword } from './forget-password';
import { ForgetPasswordService } from './forget-password.service';

@Component({
  selector: 'app-forget-password-one',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, Card, FormField, ScbInput, Label, Error, Button, Alert, Autofocus, TranslocoDirective],
  template: `
    <scb-card
      class="px-xl py-3xl sm:p-4xl"
      *transloco="let t">
      <form
        [formGroup]="form"
        (ngSubmit)="submit()"
        class="gap-3xl sm:gap-4xl flex flex-col"
        data-testid="FP_FORM">
        <h4
          class="head-md-s text-center"
          data-testid="FP_TEXT_TITLE">
          {{ t('fp.forgetPassword') }}
        </h4>
        <div class="gap-2xl flex flex-col">
          <scb-form-field data-testid="FP_FIELD_COMPANY_ID">
            <label
              scbLabel
              data-testid="FP_LABEL_COMPANY_ID"
              >{{ t('companyID') }}</label
            >
            <input
              scbInput
              formControlName="companyId"
              meeAutofocus
              class="test-company-id"
              data-testid="FP_INPUT_COMPANY_ID" />
            <p
              scbError="required"
              data-testid="FP_COMPANY_ID_ERROR">
              {{ t('fp.companyIdRequired') }}
            </p>
          </scb-form-field>
          <scb-form-field data-testid="FP_FIELD_USERNAME">
            <label
              scbLabel
              data-testid="FP_LABEL_USERNAME"
              >{{ t('username') }}</label
            >
            <input
              scbInput
              formControlName="username"
              class="test-username"
              data-testid="FP_INPUT_USERNAME" />
            <p
              scbError="required"
              data-testid="FP_ERROR_USERNAME">
              {{ t('usernameRequired') }}
            </p>
          </scb-form-field>
          @if (isInvalid()) {
            <scb-alert
              [title]="t('incorrectCredentials.title')"
              [desc]="t('incorrectCredentials.desc')"
              hideClose
              data-testid="FP_ALERT_INCORRECT_CREDENTIALS" />
          }
        </div>
        <button
          scbButton
          type="submit"
          class="w-full"
          [loading]="loading()"
          data-testid="FP_BTN_CONTINUE">
          {{ t('continue') }}
        </button>
      </form>
    </scb-card>
  `,
})
export class ForgetPasswordComponent {
  private readonly fp = inject(ForgetPassword);
  private readonly fpService = inject(ForgetPasswordService);
  private readonly alert = alertPortal();
  private transloco = inject(TranslocoService);

  readonly loading = signal(false);

  readonly form = new FormGroup({
    companyId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  readonly isInvalid = signal(false);

  submit() {
    if (this.form.invalid) return markControlsTouched(this.form);

    if (this.loading()) return;

    this.loading.set(true);
    this.isInvalid.set(false);
    const { companyId, username } = this.form.getRawValue();
    this.fpService.validateUser({ username, companyId }).subscribe({
      next: ({ numberOfAttempts, token, maskedMobileNumber, maskedEmail }) => {
        this.fp.username.set(username);
        this.loading.set(false);
        this.fp.otpToken = token;
        this.fp.userDetails.set({ phone: getPhoneDigits(maskedMobileNumber), email: maskedEmail });
        this.fp.attempts.set(numberOfAttempts);
        this.fp.next();
      },
      error: (error: ApiError) => {
        this.loading.set(false);
        if (error.error.code === ERR.INVALID_COMPANY_ID) {
          this.isInvalid.set(true);
        } else if (error.error.code === ERR.LOCKED_TEMPORARILY) {
          const time = lockedUserTitleDesc(error.error.details!.hoursRemaining!, this.transloco);
          this.openDialog(time.title, time.description);
        }
      },
    });
  }

  openDialog(title: string, description: string): void {
    this.alert.open({
      title,
      description,
      actions: [{ text: this.transloco.translate('cancel'), type: 'primary', handler: close => close() }],
    });
  }
}
