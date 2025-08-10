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
import { Error, FormField, Hint, Label, ScbInput } from '@scb/ui/form-field';
import { markControlsTouched } from '@scb/ui/input';
import { getPhoneDigits } from '../otp/otp.component';
import { Registration } from './registration';
import { RegistrationService } from './registration.service';

@Component({
  selector: 'app-registration-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RegistrationService],
  imports: [
    ReactiveFormsModule,
    Card,
    FormField,
    ScbInput,
    Label,
    Error,
    Button,
    Alert,
    Autofocus,
    TranslocoDirective,
    Hint,
  ],
  template: ` <scb-card
    class="px-xl py-3xl sm:p-4xl"
    *transloco="let t">
    <form
      [formGroup]="form"
      (ngSubmit)="submit()"
      class="gap-3xl sm:gap-4xl flex flex-col"
      data-testid="REG_FORM">
      <h4 class="head-lg-s text-center">{{ t('registration.registration-title') }}</h4>
      <div class="gap-2xl flex flex-col">
        <scb-form-field data-testid="REG_FIELD_PHONE_NUMBER">
          <label
            scbLabel
            data-testid="REG_LABEL_PHONE_NUMBER"
            >{{ t('registration.phoneNumber') }}</label
          >
          <input
            scbInput
            formControlName="mobileNumber"
            meeAutofocus
            data-testid="REG_INPUT_PHONE_NUMBER" />

          <p
            scbError="required"
            data-testid="REG_ERROR_PHONE_NUMBER">
            {{ t('registration.phoneRequired') }}
          </p>
        </scb-form-field>
        <scb-form-field data-testid="REG_FILED_COMPANY_ID">
          <label scbLabel>{{ t('registration.companyCIF') }}</label>
          <input
            scbInput
            formControlName="companyId"
            data-testid="REG_INPUT_COMPANY_ID" />
          @if (!form.touched) {
            <p
              scbHint
              data-testid="REG_INPUT_COMPANY_ID_HINT">
              {{ t('registration.companyCIFHint') }}
            </p>
          }
          <p
            scbError="required"
            data-testid="REG_ERROR_COMPANY_ID">
            {{ t('registration.companyCIFRequired') }}
          </p>
        </scb-form-field>
        @if (isInvalid()) {
          <scb-alert
            [title]="t('registration.incorrectCredentialsTitle')"
            [desc]="t('registration.incorrectCredentialsDesc')"
            hideClose
            data-testid="REG_FORM_ALERT_ERROR" />
        }
      </div>
      <button
        scbButton
        type="submit"
        class="w-full"
        [loading]="loading()"
        data-testid="REG_SUBMIT">
        {{ t('continue') }}
      </button>
    </form>
  </scb-card>`,
})
export class RegistrationFormComponent {
  private readonly reg = inject(Registration);
  private readonly regService = inject(RegistrationService);
  private transloco = inject(TranslocoService);
  readonly loading = signal(false);
  private readonly alert = alertPortal();

  readonly form = new FormGroup({
    mobileNumber: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    companyId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  readonly isInvalid = signal(false);

  submit(): void {
    if (this.form.invalid) return markControlsTouched(this.form);

    if (this.loading()) return;

    this.loading.set(true);
    this.isInvalid.set(false);
    const { companyId, mobileNumber } = this.form.getRawValue();
    this.reg.companyId.set(companyId);
    this.reg.mobileNumber.set(mobileNumber);
    this.regService.registerUser({ companyId, mobileNumber }).subscribe({
      next: ({ numberOfAttempts, otpToken, maskedMobile, maskedEmail }) => {
        this.loading.set(false);
        this.reg.otpToken = otpToken;
        this.reg.userDetails.set({ phone: getPhoneDigits(maskedMobile), email: maskedEmail });
        this.reg.attempts.set(numberOfAttempts);
        this.reg.next();
      },
      error: (error: ApiError) => {
        this.loading.set(false);
        if (error.error.code === ERR.BAD_CREDENTIALS || error.error.code === ERR.COMPANY_NOT_EXIST) {
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
