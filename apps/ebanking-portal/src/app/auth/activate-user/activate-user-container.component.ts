import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderAuthComponent } from '@/layout/components';
import { ApiError } from '@/models/api';
import { ERR } from '@/models/error';
import { lockedActivateUserTitleDesc } from '@/utils/utils';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Alert } from '@scb/ui/alert';
import { getPhoneDigits, OtpComponent, OtpStatus } from '../../auth/otp/otp.component';
import { ResetPasswordComponent } from '../../auth/reset-password/reset-password.component';
import { ActivateUser } from './activate-user';
import { ActivateUserComponent } from './activate-user.component';
import { ActivateUserService } from './activate-user.service';

@Component({
  selector: 'app-activate-user-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ActivateUser, ActivateUserService],
  imports: [
    HeaderAuthComponent,
    ResetPasswordComponent,
    OtpComponent,
    TranslocoDirective,
    ActivateUserComponent,
    Alert,
  ],
  template: `
    <header-auth />
    <div class="page-grid">
      <div
        class="col-span-4 sm:col-start-2 2xl:col-start-5"
        *transloco="let t">
        @switch (au.step()) {
          @case (1) {
            <scb-alert
              [title]="t('activateUser.title')"
              [desc]="t('activateUser.activateInfo')"
              [hideClose]="true"
              type="info"
              class="mb-4" />
            <app-activate-user-one>
              <span class="ac-desc">{{ t('activateUser.auDesc', { email: au.email() }) }}</span>
            </app-activate-user-one>
          }
          @case (2) {
            <scb-alert
              [title]="t('activateUser.title')"
              [desc]="t('activateUser.activateInfo')"
              [hideClose]="true"
              type="info"
              class="mt-4 mb-4" />
            <app-otp
              #otp
              (verify)="verifyOtp()"
              (resend)="resendOtp()"
              [(value)]="otpValue"
              [(status)]="otpStatus"
              [attempts]="au.attempts()"
              [avoidTimerOnLoad]="true"
              [avoidMaxAttempts]="avoidMaxAttemptsMessage">
              <span class="otp-title">{{ t('activateUser.otpTitle') }}</span>
              <span class="otp-desc">{{ t('activateUser.otpDesc', au.userDetails()) }}</span>
              @if (otpStatus() === 'required') {
                {{ t('activateUser.codeRequired') }}
              } @else if (otpStatus() === 'incomplete') {
                {{ t('activateUser.incompleteCode') }}
              } @else if (otpStatus() === 'attempts') {
                {{ t('otp.attempts', { attempts: au.attempts() }) }}
              } @else if (otpStatus() === 'invalid') {
                {{ t('activateUser.invalidCode') }}
              } @else if (otpStatus() === 'expired') {
                {{ t('activateUser.expiredCode') }}
              } @else if (otpStatus() === 'maxAttempts') {
                {{ t('activateUser.maxAttempts') }}
              }
            </app-otp>
          }
          @case (3) {
            <app-reset-password
              [username]="au.username()"
              [api]="this.createPassword">
              <span class="password-title">{{ t('activateUser.createPassword') }}</span>
              <span class="success-title">{{ t('activateUser.successTitle') }}</span>
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
export default class ActivateUserContainerComponent {
  readonly au = inject(ActivateUser);
  readonly route = inject(ActivatedRoute);
  readonly auService = inject(ActivateUserService);
  readonly otpComponent = viewChild<OtpComponent>('otp');
  readonly router = inject(Router);
  readonly translocoService = inject(TranslocoService);

  readonly otpValue = signal('');
  readonly otpStatus = signal<OtpStatus>('valid');
  avoidMaxAttemptsMessage = true;
  userData: { email: string; mobile: string; expiration: string } | null = null;

  constructor() {
    this.fetchTokenFromUrl();
  }

  fetchTokenFromUrl(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (token) {
      this.userData = this.au.extractTokenData(token);
      this.au.userDetails.set({ phone: getPhoneDigits(this.userData?.mobile ?? '') });
      this.au.email.set(this.userData?.email ?? '');
    }
  }

  verifyOtp() {
    if (!this.otpValue()) return;

    this.otpStatus.set('valid');
    const otpComponent = this.otpComponent()!;
    otpComponent.loading.set(true);
    this.auService.validateCode({ username: this.au.username(), activationcode: this.otpValue() }).subscribe({
      next: () => {
        this.au.next();
      },
      error: (error: ApiError<{ details?: { numberOfAttempts: number } }>) => {
        otpComponent.loading.set(false);
        this.au.attempts.set(error.error.details?.numberOfAttempts ?? 0);
        if (error.error.code === ERR.INVALID_AC || error.error.code === ERR.INVALID_INPUT) {
          this.otpStatus.set('invalid');
        } else if (error.error.code === ERR.INVALID_USER) {
          this.otpStatus.set('invalid');
          this.avoidMaxAttemptsMessage = false;
        } else if (error.error.code === ERR.EXPIRED_OTP || error.error.code === ERR.EXPIRED_AC) {
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
  createPassword = (password: string) => {
    return this.auService.createPassword({ username: this.au.username(), password });
  };

  resendOtp() {
    const otpComponent = this.otpComponent()!;
    otpComponent.resendLoading.set(true);
    this.auService.resendOtp(this.au.username()).subscribe({
      next: ({ numberOfAttempts }) => {
        otpComponent.restartTimer();
        this.otpStatus.set('attempts');
        this.au.attempts.set(numberOfAttempts);
      },
      error: (error: ApiError) => {
        otpComponent.restartTimer();
        if (error.error.code === ERR.LOCKED_TEMPORARILY) {
          this.showLockPopup(error.error.details!.hoursRemaining!);
        }
      },
    });
  }

  private showLockPopup(date: string) {
    const otpComponent = this.otpComponent()!;
    const time = lockedActivateUserTitleDesc(date, this.translocoService);
    otpComponent.lockPopup(time.title, time.description);
  }
}
