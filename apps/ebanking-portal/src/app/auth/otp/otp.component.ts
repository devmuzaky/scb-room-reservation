import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  linkedSignal,
  model,
  numberAttribute,
  output,
  signal,
  untracked,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { alertPortal } from '@scb/ui/alert-dialog';
import { Button } from '@scb/ui/button';
import { Card } from '@scb/ui/card';
import { Icon } from '@scb/ui/icon';
import { InputOtp } from '@scb/ui/otp';

export type OtpStatus = 'valid' | 'incomplete' | 'required' | 'invalid' | 'attempts' | 'maxAttempts' | 'expired';

@Component({
  selector: 'app-timer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ``,
  host: {
    class: 'inline-flex text-text-secondary body-lg-s',
  },
})
export class Timer {
  readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly translate = inject(TranslocoService);
  readonly time = input.required({ transform: numberAttribute });
  readonly tick = input(1000);

  readonly timeout = output();

  constructor() {
    afterRenderEffect(cleanup => {
      let time = this.time();
      const tick = this.tick();
      this.update(time);
      const id = setInterval(() => {
        time = time - tick;
        if (time >= 0) {
          this.update(time);
        } else {
          clearInterval(id);
          this.timeout.emit();
        }
      }, tick);
      cleanup(() => clearInterval(id));
    });
  }

  update(time: number) {
    this.el.nativeElement.textContent = `${time / this.tick()} ${this.translate.translate('seconds')}`;
  }
}

@Component({
  selector: 'app-otp',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, Card, InputOtp, Button, Icon, Timer, TranslocoDirective, RouterLink],
  template: `
    <scb-card
      class="gap-md px-xl py-3xl sm:p-4xl flex w-full flex-col items-center text-center"
      *transloco="let t">
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
            <ng-content select=".otp-title" />
          </h4>
          <p
            class="text-text-secondary body-lg"
            data-testid="OTP_TEXT_DESC">
            <ng-content select=".otp-desc" />
          </p>
        </div>
        <scb-input-otp
          [size]="[1, 1, 1, 1, 1, 1]"
          [(ngModel)]="value"
          name="otp"
          masked
          [invalid]="invalid()"
          [soft]="status() === 'attempts'"
          data-testid="OTP_TEXT_INPUT">
          <ng-content />
        </scb-input-otp>
        <div class="gap-lg flex w-full flex-col">
          <button
            scbButton
            type="submit"
            [loading]="loading()"
            data-testid="OTP_BTN_VERIFY">
            {{ t('verify') }}
          </button>
          <button
            scbButton
            type="button"
            variant="ghost"
            (click)="resend.emit()"
            [disabled]="!enableResend() || resendDisabled()"
            [loading]="resendLoading()"
            data-testid="OTP_BTN_RESEND_CODE">
            {{ t('otp.resendCode') }}
            @if (!enableResend()) {
              <app-timer
                [time]="timer() * 1000"
                [tick]="tick()"
                (timeout)="enableResend.set(true)"
                class="text-primary"
                data-testid="OTP_TEXT_TIMER" />
            }
          </button>
        </div>
      </form>
      <h4
        class="gap-sm body-md text-text-tertiary flex w-full items-center justify-center"
        data-testid="OTP_TEXT_DATA">
        {{ t('otp.notYourDate') }}
        <a
          scbButton
          variant="link"
          size="lg"
          routerLink="/locate-us"
          data-testid="OTP_LINK_NEAREST_BRANCH">
          {{ t('otp.nearestBranch') }}
        </a>
      </h4>
    </scb-card>
  `,
  host: {
    class: 'flex flex-col',
  },
})
export class OtpComponent {
  private readonly alert = alertPortal();
  private transloco = inject(TranslocoService);

  readonly value = model<string>('');
  readonly timer = input(90, { transform: numberAttribute });
  readonly tick = input<number>(1000);
  readonly status = model<OtpStatus>('valid');
  readonly attempts = input();
  readonly avoidTimerOnLoad = input(false);
  readonly avoidMaxAttempts = input(false);
  readonly loading = signal(false);
  readonly verify = output();
  readonly resend = output();

  readonly invalid = computed(() => {
    return (['maxAttempts', 'invalid', 'expired', 'required', 'incomplete'] as OtpStatus[]).includes(this.status());
  });
  readonly resendLoading = signal(false);
  readonly enableResend = linkedSignal(this.avoidTimerOnLoad);
  readonly resendDisabled = signal(false);
  private verifyCalled = false;

  constructor() {
    effect(() => {
      // if the error state is maxAttempts then we need to avoid resetting the status on interaction
      // we only have to listen the value changes and untrack other signals
      if (
        this.value() &&
        untracked(() => !this.avoidMaxAttempts() && this.status() !== 'maxAttempts' && !this.loading())
      ) {
        this.status.set(this.verifyCalled ? 'attempts' : 'valid');
      }
    });
  }

  verifyOtp() {
    if (!this.value()) {
      this.status.set('required');
      return;
    } else if (this.value().length < 6) {
      this.status.set('incomplete');
      return;
    }
    this.verifyCalled = true;
    this.verify.emit();
  }

  lockPopup(title: string, description: string) {
    this.alert.open({
      title,
      description,
      actions: [{ text: this.transloco.translate('cancel'), type: 'primary', handler: close => close() }],
    });
  }

  restartTimer(disabled = false, isResend = false) {
    this.resendLoading.set(false);
    if (disabled) {
      this.resendDisabled.set(true);
      this.enableResend.set(true);
    } else {
      this.resendDisabled.set(false);
      if (isResend) this.enableResend.set(false);
    }
  }
}

export function getPhoneDigits(phone: string) {
  return phone.substring(phone.length - 3, phone.length);
}
