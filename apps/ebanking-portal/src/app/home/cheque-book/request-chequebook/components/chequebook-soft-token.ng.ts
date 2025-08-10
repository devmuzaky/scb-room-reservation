import { ChangeDetectionStrategy, Component, computed, inject, model, Signal, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OtpStatus } from '@/auth/otp/otp.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { Icon } from '@scb/ui/icon';
import { InputOtp } from '@scb/ui/otp';
import { DialogRef } from '@scb/ui/portal';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, Button, TranslocoDirective, Icon, InputOtp],
  template: `
    <div
      class="gap-lg relative flex flex-col items-center text-center"
      *transloco="let t; prefix: 'transfer.otp'">
      <div class="gap-md flex w-full items-center justify-end">
        <icon
          name="close"
          class="text-primary h-4xl w-4xl cursor-pointer"
          (click)="diaRef.close()" />
      </div>

      <form
        (ngSubmit)="verifyOtp()"
        class="gap-3xl flex w-full flex-col">
        <div class="gap-md flex flex-col items-center">
          <icon
            class="text-brand w-14"
            name="otp"
            data-testid="OTP_ICON_LOCK" />
          <h4
            class="head-md-s 2xl:head-lg-s"
            data-testid="OTP_TEXT_TITLE">
            {{ t('otpTitle') }}
          </h4>
        </div>
        <scb-input-otp
          [size]="[1, 1, 1, 1, 1, 1, 1, 1]"
          [(ngModel)]="value"
          name="otp"
          masked
          [invalid]="invalid()"
          [soft]="status() === 'attempts'"
          data-testid="OTP_TEXT_INPUT">
          @if (otpStatus() === 'required') {
            {{ t('otpRequired') }}
          } @else if (otpStatus() === 'incomplete') {
            {{ t('incompleteOtp') }}
          } @else if (otpStatus() === 'invalid' || otpStatus() === 'expired') {
            {{ t('invalidToken') }}
          }
        </scb-input-otp>
        <div class="gap-lg flex w-full flex-col">
          <button
            scbButton
            type="submit"
            [loading]="data.loading()"
            data-testid="OTP_BTN_VERIFY">
            {{ t('verify') }}
          </button>
        </div>
      </form>
    </div>
  `,
})
export class ChequeBookSoftTokenAlert {
  readonly diaRef = inject<DialogRef<{ loading: Signal<boolean>; save: (token: string) => void }>>(DialogRef);
  readonly data = this.diaRef.options.data!;
  readonly otpValue = signal('');
  readonly otpStatus = signal<OtpStatus>('valid');

  readonly value = model<string>('');

  readonly status = model<OtpStatus>('valid');
  readonly invalid = computed(() => {
    return (['maxAttempts', 'invalid', 'expired', 'required', 'incomplete'] as OtpStatus[]).includes(this.status());
  });

  verifyOtp() {
    if (!this.value() || this.value().length !== 8) {
      this.otpStatus.set('incomplete');
      return;
    }

    this.otpStatus.set('valid');
    this.data.save(this.value());
  }
}
