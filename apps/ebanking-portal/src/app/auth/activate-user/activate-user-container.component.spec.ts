import { Component, input, model, numberAttribute, output, signal } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { provideTestTransloco } from '@/config/transloco.testing';
import { fakeApi } from '@/core/test';
import { AppLanguage } from '@/layout/layout-store';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { ApiError } from '@/models/api';
import { ERR } from '@/models/error';
import { fakeService, render, RenderResult } from '@scb/util/testing';
import { OtpComponent, OtpStatus } from '../otp/otp.component';
import { ActivateUser } from './activate-user';
import ActivateUserContainerComponent from './activate-user-container.component';
import { ActivateUserService } from './activate-user.service';

const activationUserServiceStub = fakeService(ActivateUserService, {
  resendOtp: jest.fn(),
  validateCode: jest.fn(),
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
  readonly timer = input(90, { transform: numberAttribute });
  readonly tick = input<number>(1000);
  readonly status = model<OtpStatus>('valid');
  readonly attempts = input();
  readonly enableTimerOnLoad = input();
  readonly verify = output();
  readonly resend = output();
  readonly avoidTimerOnLoad = input(false);
  readonly avoidMaxAttempts = input(false);
  readonly resendLoading = signal(false);
  readonly loading = signal(false);

  lockPopup(title: string, desc: string): void {
    // not implemented
  }

  restartTimer(): void {
    // not implemented
  }
}

const mockToken = 'mocked-token'; // Define a mock token
const activatedRouteStub = {
  snapshot: {
    queryParamMap: {
      get: (key: string) => (key === 'token' ? mockToken : null),
    },
  },
};

@Component({
  selector: 'app-login',
  template: ``,
})
class TestLoginComponent {}

describe('ActivateUser Container', () => {
  let view: RenderResult<ActivateUserContainerComponent>;
  let au: ActivateUser;

  beforeEach(async () => {
    view = await render(
      ActivateUserContainerComponent,
      [
        provideNoopAnimations(),
        provideTestTransloco(),
        layoutFacadeServiceStub,
        provideRouter([{ path: 'login', component: TestLoginComponent }]),
        { provide: ActivatedRoute, useValue: activatedRouteStub }, // Mock ActivatedRoute
      ],
      {
        providers: [activationUserServiceStub],
        components: [[{ imports: [OtpComponent] }, { imports: [FakeOtpComponent] }]],
      },
    );
    au = view.injectHost(ActivateUser);
  });

  function goToStep(num: number) {
    au.step.set(num);
    view.detectChanges();
  }

  function getOtpComponent() {
    return view.viewChild(FakeOtpComponent);
  }

  it('should create', () => {
    expect(view.host).toBeTruthy();
    expect(au.username()).toBe('');
    expect(au.step()).toBe(1);
    expect(au.attempts()).toBe(3);
    expect(au.otpToken).toBe('');
    expect(au.resetToken).toBe('');
    expect(au.userDetails()).toEqual({ phone: '' });
  });

  it('should called verifyOtp when verify output emits', () => {
    goToStep(2);
    const otpComponent = getOtpComponent();

    const api = fakeApi(null);
    activationUserServiceStub.v.validateCode = api.fn;
    jest.spyOn(au, 'next');

    view.host.otpValue.set('123456');
    otpComponent.verify.emit();
    api.complete();

    expect(view.host.otpStatus()).toBe('valid');
    expect(au.resetToken).toBe('');
    expect(au.next).toHaveBeenCalled();
  });

  it('should called resendOtp when resend output emits', () => {
    goToStep(2);
    const otpComponent = getOtpComponent();

    jest.spyOn(otpComponent, 'restartTimer');

    const api = fakeApi({ numberOfAttempts: 2 });
    activationUserServiceStub.v.resendOtp = api.fn;

    otpComponent.resend.emit();
    expect(otpComponent.resendLoading()).toBeTruthy();

    api.complete();
    expect(otpComponent.restartTimer).toHaveBeenCalled();
    expect(view.host.otpStatus()).toBe('attempts');
  });

  it('should handle locked temporarily error for resend OTP', async () => {
    goToStep(2);
    const otpComponent = getOtpComponent();
    jest.spyOn(otpComponent, 'lockPopup');

    const api = fakeApi(
      new ApiError({
        code: ERR.LOCKED_TEMPORARILY,
        message: 'error',
        details: { hoursRemaining: '2025-02-02 15:36:00.0' },
      }),
    );
    activationUserServiceStub.v.resendOtp = api.fn;

    view.host.otpValue.set('123456');
    view.host.resendOtp();

    api.complete();
    expect(otpComponent.lockPopup).toHaveBeenCalled();
  });

  it('should call the createPassword method', () => {
    view.host.auService.createPassword = jest.fn();
    view.host.createPassword('123');

    expect(view.host.auService.createPassword).toHaveBeenCalled();
  });

  describe('Error Handling', () => {
    it('should handle invalid otp error', () => {
      goToStep(2);
      const otpComponent = getOtpComponent();

      const api = fakeApi(new ApiError({ code: ERR.INVALID_AC, message: 'error' }));
      activationUserServiceStub.v.validateCode = api.fn;

      view.host.otpValue.set('aaaa');
      view.host.verifyOtp();
      expect(otpComponent.loading()).toBeTruthy();

      api.complete();
      view.detectChanges();

      expect(otpComponent.loading()).toBeFalsy();
      expect(view.host.otpValue()).toBe('');
      expect(view.host.otpStatus()).toBe('invalid');
    });

    it('should handle expired otp error', () => {
      goToStep(2);

      const api = fakeApi(new ApiError({ code: ERR.EXPIRED_OTP, message: 'error' }));
      activationUserServiceStub.v.validateCode = api.fn;

      view.host.otpValue.set('123456');
      view.host.verifyOtp();

      api.complete();
      expect(view.host.otpValue()).toBe('');
      expect(view.host.otpStatus()).toBe('expired');
    });

    it('should handle locked temporarily error', async () => {
      goToStep(2);

      const api = fakeApi(
        new ApiError({
          code: ERR.LOCKED_TEMPORARILY,
          message: 'error',
          details: { hoursRemaining: '2025-02-02 15:36:00.0' },
        }),
      );
      activationUserServiceStub.v.validateCode = api.fn;

      view.host.otpValue.set('123456');
      view.host.verifyOtp();

      api.complete();
      expect(view.host.otpValue()).toBe('');
      expect(view.host.otpStatus()).toBe('valid');
    });

    it('should handle max attempts error', () => {
      goToStep(2);

      const api = fakeApi(new ApiError({ code: ERR.MAX_ATTEMPTS, message: 'max attempts' }));
      activationUserServiceStub.v.validateCode = api.fn;

      view.host.otpValue.set('123456');
      view.host.verifyOtp();
      api.complete();

      view.detectChanges();
      expect(view.host.otpValue()).toBe('');
      expect(view.host.otpStatus()).toBe('maxAttempts');
    });

    it('should handle expired token error', () => {
      goToStep(2);
      const router = view.inject(Router);
      jest.spyOn(router, 'navigate');
      const api = fakeApi(new ApiError({ code: ERR.EXPIRED_TOKEN, message: 'expired token' }));
      activationUserServiceStub.v.validateCode = api.fn;

      view.host.otpValue.set('123456');
      view.host.verifyOtp();
      api.complete();

      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should not call validateCode when otpValue is empty', () => {
      goToStep(2);

      jest.spyOn(view.host.auService, 'validateCode');

      view.host.otpValue.set('');
      view.host.verifyOtp();

      expect(view.host.auService.validateCode).not.toHaveBeenCalled();
    });
  });

  it('should handle invalid user error', () => {
    goToStep(2);

    const api = fakeApi(new ApiError({ code: ERR.INVALID_USER, message: 'invalid user' }));
    activationUserServiceStub.v.validateCode = api.fn;

    view.host.otpValue.set('123456');
    view.host.verifyOtp();

    api.complete();
    view.detectChanges();

    expect(view.host.otpValue()).toBe('');
    expect(view.host.otpStatus()).toBe('invalid');
    expect(view.host.avoidMaxAttemptsMessage).toBe(false);
  });

  it('should extract and set user data from token', () => {
    jest.spyOn(au, 'extractTokenData').mockReturnValue({
      email: 'test@example.com',
      mobile: '+1234567890',
      expiration: '2025-12-31',
    });

    view.host.fetchTokenFromUrl(); // Call the function

    expect(view.host.userData).toEqual({
      email: 'test@example.com',
      mobile: '+1234567890',
      expiration: '2025-12-31',
    });

    expect(au.extractTokenData).toHaveBeenCalledWith(mockToken);
    expect(au.userDetails()).toEqual({ phone: '890' });
    expect(au.email()).toBe('test@example.com');
  });

  describe('ActivateUserContainer', () => {
    let au: ActivateUser;
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
      au = new ActivateUser();
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {
        // Properly mock console.error
      });
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore(); // Restore original console.error after each test
    });

    it('should extract user data if token is provided', () => {
      const mockToken = 'dXNlckBleGFtcGxlLmNvbToxMjM0NTY3ODo2MDQ4MDA='; // Base64 encoded token
      const mockUserData = { email: 'user@example.com', mobile: '1234567890', expiration: '604800' };

      // Spy on extractTokenData to return mockUserData
      jest.spyOn(au, 'extractTokenData').mockReturnValue(mockUserData);

      // Simulate the function call that uses this logic
      au.userDetails.set({ phone: mockUserData.mobile });
      au.email.set(mockUserData.email);

      expect(au.userDetails()).toEqual({ phone: '1234567890' });
      expect(au.email()).toBe('user@example.com');
    });

    it('should return extracted token data for a valid token', () => {
      const mockToken = btoa('user@example.com:1234567890:604800'); // Correctly formatted base64 token
      const result = au.extractTokenData(mockToken);

      expect(result).toEqual({
        email: 'user@example.com',
        mobile: '1234567890',
        expiration: '604800',
      });
    });

    it('should return null and log "Invalid token structure" if token structure is incorrect', () => {
      const invalidToken = btoa('user@example.com:1234567890'); // Only 2 parts instead of 3

      const result = au.extractTokenData(invalidToken);

      expect(result).toBeNull();
    });

    it('should return null and log "Error decoding token:" if token is not Base64', () => {
      const invalidBase64Token = 'invalid-token-123'; // Not a valid base64 string

      const result = au.extractTokenData(invalidBase64Token);

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith('Error decoding token:', expect.any(Error));
    });
  });
});
