import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderAuthComponent } from '@/layout/components';
import { ApiError } from '@/models/api';
import { ERR } from '@/models/error';
import { lockedUserTitleDesc } from '@/utils/utils';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { OtpComponent, OtpStatus } from '../otp/otp.component';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { ForgetPassword } from './forget-password';
import { ForgetPasswordComponent } from './forget-password.component';
import { ForgetPasswordService } from './forget-password.service';

@Component({
  selector: 'app-forget-password-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ForgetPassword, ForgetPasswordService],
  imports: [HeaderAuthComponent, ResetPasswordComponent, ForgetPasswordComponent, OtpComponent, TranslocoDirective],
  template: `
    <header-auth />
    <div class="page-grid">
      <div
        class="col-span-4 sm:col-start-2 2xl:col-start-5"
        *transloco="let t">
        @switch (fp.step()) {
          @case (1) {
            <app-forget-password-one />
          }
          @case (2) {
            <app-otp
              #otp
              (verify)="verifyOtp()"
              (resend)="resendOtp()"
              [(value)]="otpValue"
              [(status)]="otpStatus"
              [attempts]="fp.attempts()">
              <span class="otp-title">{{ t('otp.title') }}</span>
              <span class="otp-desc">{{ t('otp.desc', fp.userDetails()) }}</span>
              @if (otpStatus() === 'required') {
                {{ t('otpRequired') }}
              } @else if (otpStatus() === 'incomplete') {
                {{ t('otp.incompleteOtp') }}
              } @else if (otpStatus() === 'attempts') {
                {{ t('otp.attempts', { attempts: fp.attempts() }) }}
              } @else if (otpStatus() === 'maxAttempts') {
                {{ t('otp.maxAttempts') }}
              } @else if (otpStatus() === 'invalid') {
                {{ t('otp.invalidOtp') }}
              } @else if (otpStatus() === 'expired') {
                {{ t('otp.expiredOtp') }}
              }
            </app-otp>
          }
          @case (3) {
            <app-reset-password
              [username]="fp.username()"
              [api]="this.forgetPassword">
              <span class="password-title">{{ t('fp.resetPassword') }}</span>
              <span class="success-title">{{ t('fp.successTitle') }}</span>
            </app-reset-password>
          }
        }
      </div>
    </div>
  `,
  host: {
    class: 'flex flex-col min-h-screen',
  },
})
export default class ForgetPasswordContainerComponent {
  readonly fp = inject(ForgetPassword);
  readonly fpService = inject(ForgetPasswordService);
  readonly otpComponent = viewChild<OtpComponent>('otp');
  readonly router = inject(Router);
  readonly translocoService = inject(TranslocoService);

  readonly otpValue = signal('');
  readonly otpStatus = signal<OtpStatus>('valid');

  verifyOtp() {
    if (!this.otpValue()) return;

    this.otpStatus.set('valid');
    const otpComponent = this.otpComponent()!;
    otpComponent.loading.set(true);
    this.fpService
      .validateOtp({ username: this.fp.username(), otp: this.otpValue(), token: this.fp.otpToken })
      .subscribe({
        next: ({ token }) => {
          this.fp.resetToken = token;
          this.fp.next();
        },
        error: (error: ApiError<{ details?: { hoursRemaining: number; numberOfAttempts: number } }>) => {
          otpComponent.loading.set(false);
          this.fp.attempts.set(error.error.details?.numberOfAttempts ?? 0);
          otpComponent.restartTimer(error.error.code === ERR.LOCKED_TEMPORARILY);
          if (error.error.code === ERR.INVALID_OTP) {
            this.otpStatus.set('invalid');
          } else if (error.error.code === ERR.EXPIRED_OTP) {
            this.otpStatus.set('expired');
          } else if (error.error.code === ERR.LOCKED_TEMPORARILY) {
            this.otpStatus.set('valid');
            this.showLockPopup(error.error.details!.hoursRemaining!);
          } else if (error.error.code === ERR.MAX_ATTEMPTS) {
            this.otpStatus.set('maxAttempts');
          } else if (error.error.code === ERR.EXPIRED_TOKEN) {
            this.router.navigate(['/login']);
            return;
          }
          this.otpValue.set('');
        },
      });
  }

  // This function is an arrow because we have to pass it as an input
  forgetPassword = (password: string) => {
    return this.fpService.forgetPassword({ username: this.fp.username(), password, token: this.fp.resetToken });
  };

  resendOtp() {
    const otpComponent = this.otpComponent()!;
    otpComponent.resendLoading.set(true);
    this.fpService.resendOtp(this.fp.username(), this.fp.otpToken).subscribe({
      next: ({ numberOfAttempts }) => {
        otpComponent.restartTimer(false, true);
        this.otpStatus.set('attempts');
        this.fp.attempts.set(numberOfAttempts);
      },
      error: (error: ApiError) => {
        otpComponent.restartTimer(error.error.code === ERR.LOCKED_TEMPORARILY, true);
        if (error.error.code === ERR.LOCKED_TEMPORARILY) {
          this.showLockPopup(error.error.details!.hoursRemaining!);
        } else if (error.error.code === ERR.LOCKED) {
          // No action is required
        }
      },
    });
  }

  private showLockPopup(date: string) {
    const otpComponent = this.otpComponent()!;
    const time = lockedUserTitleDesc(date, this.translocoService);
    otpComponent.lockPopup(time.title, time.description);
  }
}
