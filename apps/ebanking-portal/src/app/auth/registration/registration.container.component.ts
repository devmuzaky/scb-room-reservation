import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderAuthComponent } from '@/layout/components';
import { ApiError } from '@/models/api';
import { ERR } from '@/models/error';
import { lockedUserTitleDesc } from '@/utils/utils';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { Card } from '@scb/ui/card';
import { Icon } from '@scb/ui/icon';
import { OtpComponent, OtpStatus } from '../otp/otp.component';
import { Registration } from './registration';
import { RegistrationFeatureComponent } from './registration-feature.component';
import { RegistrationFormComponent } from './registration-form.component';
import { RegistrationService } from './registration.service';
import { RegistrationStepsComponent } from './registration.steps.component';

@Component({
  selector: 'app-branch-message',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [],
  imports: [Card, Icon, Button, TranslocoDirective],
  template: `
    <div class="flex flex-1 items-center justify-center">
      <scb-card
        class="gap-md px-xl py-3xl sm:p-4xl flex flex-col items-center text-center"
        *transloco="let t">
        <div class="gap-md flex flex-col items-center">
          <icon
            class="w-[52px] 2xl:w-14"
            name="message" />
          <h4 class="head-md-s 2xl:head-lg-s">{{ t('registration.branchMessageTitle') }}</h4>
          <p class="text-text-secondary body-lg">
            {{ t('registration.branchMessageDesc') }}
          </p>
        </div>
        <h4 class="text-text-primary flex items-center">
          <a
            scbButton
            variant="ghost"
            size="xs sm:sm"
            class="gap-xs">
            {{ t('registration.nearestBranch') }}
          </a>
        </h4>
      </scb-card>
    </div>

    <div
      class="text-md flex items-center justify-center gap-1"
      *transloco="let t; prefix: 'registration'">
      <p>{{ t('newToCorporate') }}</p>
      <a
        scbButton
        variant="link"
        size="sm sm:md"
        routerLink="/registration">
        {{ t('register') }}
      </a>
    </div>
  `,
  host: {
    class: 'flex flex-col',
  },
})
export class BranchMessageComponent {}
@Component({
  selector: 'app-registration-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [Registration, RegistrationService],
  imports: [
    HeaderAuthComponent,
    RegistrationFeatureComponent,
    RegistrationFormComponent,
    BranchMessageComponent,
    OtpComponent,
    RegistrationStepsComponent,
    TranslocoDirective,
  ],
  template: `
    <header-auth />

    @switch (reg.step()) {
      @case (1) {
        <div class="page-grid">
          <div class="pt-8xl pb-4xl 2xl:pt-2xl col-span-4 sm:col-start-2 2xl:col-span-6 2xl:col-start-4">
            <app-registration-feature />
          </div>
        </div>
      }
      @case (2) {
        <div class="page-grid">
          <div class="pt-8xl pb-4xl 2xl:pt-2xl col-span-4 sm:col-start-2 2xl:col-span-4 2xl:col-start-5">
            <app-registration-form />
          </div>
        </div>
      }
      @case (3) {
        <div class="page-grid">
          <div
            class="pt-8xl pb-4xl 2xl:pt-2xl col-span-4 sm:col-start-2 2xl:col-span-4 2xl:col-start-5"
            *transloco="let t">
            <app-otp
              #otp
              (verify)="verifyOtp()"
              (resend)="resendOtp()"
              [(value)]="otpValue"
              [(status)]="otpStatus"
              [attempts]="reg.attempts()">
              <span class="otp-title">{{ t('registration.otpTitle') }}</span>
              <span class="otp-desc">{{ t('otp.desc', reg.userDetails()) }}</span>
              @if (otpStatus() === 'required') {
                {{ t('otpRequired') }}
              } @else if (otpStatus() === 'incomplete') {
                {{ t('otp.incompleteOtp') }}
              } @else if (otpStatus() === 'attempts') {
                {{ t('otp.attempts', { attempts: reg.attempts() }) }}
              } @else if (otpStatus() === 'maxAttempts') {
                {{ t('otp.maxAttempts') }}
              } @else if (otpStatus() === 'invalid') {
                {{ t('otp.invalidOtp') }}
              } @else if (otpStatus() === 'expired') {
                {{ t('otp.expiredOtp') }}
              }
            </app-otp>
          </div>
        </div>
      }
      @case (4) {
        <div class="page-grid">
          <div class="pt-8xl pb-4xl 2xl:pt-2xl col-span-4 sm:col-start-2 2xl:col-span-4 2xl:col-start-5">
            <app-registration-steps />
          </div>
        </div>
      }
      @case (5) {
        <div class="page-grid">
          <div class="pt-8xl pb-4xl 2xl:pt-2xl col-span-4 sm:col-start-2 2xl:col-span-4 2xl:col-start-5">
            <app-branch-message />
          </div>
        </div>
      }
    }
  `,
  host: {
    class: 'flex flex-col min-h-screen',
  },
})
export default class RegistrationContainerComponent {
  readonly reg = inject(Registration);
  readonly regService = inject(RegistrationService);
  readonly otpValue = signal('');
  readonly otpComponent = viewChild<OtpComponent>('otp');
  readonly router = inject(Router);
  readonly translocoService = inject(TranslocoService);
  readonly otpStatus = signal<OtpStatus>('valid');
  readonly USER_LOCKED_TIME = 24;

  verifyOtp() {
    this.otpStatus.set('valid');
    const otpComponent = this.otpComponent()!;
    otpComponent.loading.set(true);
    this.reg.otp.set(this.otpValue());
    this.regService.validateOtp({ otp: this.otpValue(), token: this.reg.otpToken }).subscribe({
      next: ({ token }) => {
        this.reg.resetToken = token;
        this.reg.next();
      },
      error: (error: ApiError<{ details?: { numberOfAttempts: number } }>) => {
        otpComponent.loading.set(false);
        this.reg.attempts.set(error.error.details?.numberOfAttempts ?? 0);
        if (error.error.code === ERR.INVALID_OTP) {
          this.otpStatus.set('invalid');
        } else if (error.error.code === ERR.EXPIRED_OTP) {
          this.otpStatus.set('expired');
        } else if (error.error.code === ERR.LOCKED_TEMPORARILY) {
          this.otpStatus.set('valid');
          this.showLockPopup(error.error.details!.hoursRemaining!);
        } else if (error.error.code === ERR.MAX_ATTEMPTS) {
          this.otpStatus.set('maxAttempts');
          return;
        } else if (error.error.code === ERR.EXPIRED_TOKEN) {
          this.showLockPopup(error.error.details!.hoursRemaining!);
        } else if (error.error.code === ERR.LOCKED) {
          // No action is required
        }
        this.otpValue.set('');
      },
    });
  }

  resendOtp() {
    const otpComponent = this.otpComponent()!;
    otpComponent.resendLoading.set(true);
    this.regService.resendOtp(this.reg.username(), this.reg.otpToken).subscribe({
      next: ({ numberOfAttempts }) => {
        otpComponent.restartTimer();
        this.otpStatus.set('valid');
        this.reg.attempts.set(numberOfAttempts);
      },
      error: (error: ApiError) => {
        otpComponent.restartTimer(error.error.code === ERR.LOCKED_TEMPORARILY);
        if (error.error.code === ERR.LOCKED) {
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
