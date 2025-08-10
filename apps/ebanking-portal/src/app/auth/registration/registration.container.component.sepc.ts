import { Component, input, model, numberAttribute, output, signal } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';
import { provideTestTransloco } from '@/config/transloco.testing';
import { fakeApi } from '@/core/test';
import { AppLanguage } from '@/layout/layout-store';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { ApiError } from '@/models/api';
import { ERR } from '@/models/error';
import { fakeService, render, RenderResult } from '@scb/util/testing';
import { OtpComponent, OtpStatus } from '../otp/otp.component';
import { Registration } from './registration';
import RegistrationContainerComponent from './registration.container.component';
import { RegistrationService } from './registration.service';

const registrationServiceStub = fakeService(RegistrationService, {
  resendOtp: jest.fn(),
  validateOtp: jest.fn(),
});

const layoutFacadeServiceStub = fakeService(LayoutFacadeService, {
  isDarkTheme: signal(false),
  language: signal('en' as AppLanguage),
});

@Component({
  selector: 'app-otp',
  template: ``,
})
export class FakeOtpComponent implements Partial<OtpComponent> {
  readonly value = model<string>('');
  readonly phone = input.required<string>();
  readonly email = input.required<string>();
  readonly timer = input(90, { transform: numberAttribute });
  readonly tick = input<number>(1000);
  readonly status = model<OtpStatus>('valid');
  readonly attempts = input();
  readonly verify = output();
  readonly resend = output();

  readonly resendLoading = signal(false);
  readonly loading = signal(false);
}

@Component({
  selector: 'app-login',
  template: ``,
})
class TestLoginComponent {}

describe('Registration Container', () => {
  let view: RenderResult<RegistrationContainerComponent>;
  let fp: Registration;
  let regService: RegistrationService;

  beforeEach(async () => {
    view = await render(
      RegistrationContainerComponent,
      [
        provideNoopAnimations(),
        provideTestTransloco(),
        layoutFacadeServiceStub,
        provideRouter([{ path: 'auth', component: TestLoginComponent }]),
      ],
      {
        providers: [registrationServiceStub],
        components: [[{ imports: [OtpComponent] }, { imports: [FakeOtpComponent] }]],
      },
    );
    fp = view.injectHost(Registration);
    regService = view.injectHost(RegistrationService);
  });

  function goToStep(num: number) {
    fp.step.set(num);
    view.detectChanges();
  }

  function getOtpComponent() {
    return view.viewChild(FakeOtpComponent);
  }

  it('should create', () => {
    expect(view.host).toBeTruthy();
    expect(fp.username()).toBe('');
    expect(fp.step()).toBe(1);
    expect(fp.attempts()).toBe(3);
    expect(fp.otpToken).toBe('');
    expect(fp.resetToken).toBe('');
  });

  it('should called verifyOtp when verify output emits', () => {
    goToStep(2);
    const otpComponent = getOtpComponent();

    const api = fakeApi({ token: '123' });
    regService.validateOtp = api.fn;
    jest.spyOn(fp, 'next');

    view.host.otpValue.set('123456');
    otpComponent.verify.emit();
    api.complete();

    expect(view.host.otpStatus()).toBe('valid');
    expect(fp.resetToken).toBe('123');
    expect(fp.next).toHaveBeenCalled();
  });

  it('should called resendOtp when resend output emits', () => {
    goToStep(2);
    const otpComponent = getOtpComponent();

    const api = fakeApi({ numberOfAttempts: 2 });
    regService.resendOtp = api.fn;

    otpComponent.resend.emit();
    expect(otpComponent.resendLoading()).toBeTruthy();

    api.complete();
    expect(otpComponent.resendLoading()).toBeFalsy();
    expect(view.host.otpStatus()).toBe('attempts');
  });

  describe('Error Handling', () => {
    it('should handle invalid otp error', () => {
      goToStep(2);
      const otpComponent = getOtpComponent();

      const api = fakeApi(new ApiError({ code: ERR.INVALID_OTP, message: 'error' }));
      regService.validateOtp = api.fn;

      view.host.otpValue.set('123456');
      view.host.verifyOtp();
      expect(otpComponent.loading()).toBeTruthy();

      api.complete();
      expect(otpComponent.loading()).toBeFalsy();
      expect(view.host.otpValue()).toBe('');
      expect(view.host.otpStatus()).toBe('invalid');
    });

    it('should handle expired otp error', () => {
      goToStep(2);

      const api = fakeApi(new ApiError({ code: ERR.EXPIRED_OTP, message: 'error' }));
      regService.validateOtp = api.fn;

      view.host.otpValue.set('123456');
      view.host.verifyOtp();

      api.complete();
      expect(view.host.otpValue()).toBe('');
      expect(view.host.otpStatus()).toBe('expired');
    });

    it('should handle locked temporarily error', async () => {
      goToStep(2);

      const api = fakeApi(new ApiError({ code: ERR.LOCKED_TEMPORARILY, message: 'error' }));
      regService.validateOtp = api.fn;

      view.host.otpValue.set('123456');
      view.host.verifyOtp();

      api.complete();
      expect(view.host.otpValue()).toBe('');
      expect(view.host.otpStatus()).toBe('valid');
    });

    it('should handle max attempts error', () => {
      goToStep(2);
      const router = view.inject(Router);
      jest.spyOn(router, 'navigate');

      const api = fakeApi(new ApiError({ code: ERR.MAX_ATTEMPTS, message: 'max attempts' }));
      regService.validateOtp = api.fn;

      view.host.otpValue.set('123456');
      view.host.verifyOtp();
      api.complete();

      view.detectChanges();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should handle expired token error', () => {
      goToStep(2);
      const router = view.inject(Router);
      jest.spyOn(router, 'navigate');
      const api = fakeApi(new ApiError({ code: ERR.EXPIRED_TOKEN, message: 'expired token' }));
      regService.validateOtp = api.fn;

      view.host.otpValue.set('123456');
      view.host.verifyOtp();
      api.complete();

      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should handle otp locked error', () => {
      goToStep(2);
      const otpComponent = getOtpComponent();

      const api = fakeApi(new ApiError({ code: ERR.LOCKED, message: 'otp locked' }));
      regService.resendOtp = api.fn;

      otpComponent.resend.emit();
      view.detectChanges();
      expect(otpComponent.resendLoading()).toBeTruthy();

      api.complete();
      expect(otpComponent.resendLoading()).toBeFalsy();
    });
  });
});
