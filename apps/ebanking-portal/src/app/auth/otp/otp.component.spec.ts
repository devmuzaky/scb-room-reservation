import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideTestTransloco } from '@/config/transloco.testing';
import { render, RenderResult } from '@scb/util/testing';
import { getPhoneDigits, OtpComponent } from './otp.component';

describe('OtpComponent', () => {
  let view: RenderResult<OtpComponent>;

  beforeEach(async () => {
    view = await render(OtpComponent, [provideNoopAnimations(), provideTestTransloco(), provideRouter([])], {
      inputs: [['timer', 90]],
    });
  });

  it('should create', () => {
    expect(view.host).toBeTruthy();
  });

  it('should handle the error message', () => {
    view.host.verifyOtp();
    expect(view.host.status()).toBe('required');

    view.setInput('value', '12');
    view.detectChanges();

    view.host.verifyOtp();
    expect(view.host.status()).toBe('incomplete');
  });

  it('should call verifyOtp is the otp value is valid', () => {
    view.setInput('value', '123456');
    view.host.verifyOtp();
    view.detectChanges();

    expect(view.host['verifyCalled']).toBeTruthy();
  });

  it('should enable resend button on timer complete', async () => {
    // jest.spyOn(view.host.resend, 'emit');
    view.setInput('timer', 0.001);
    view.setInput('tick', 1);
    view.detectChanges();
    await view.sleep(30);
    view.detectChanges();

    expect(view.host.enableResend()).toBeTruthy();
  });

  it('should reset the status on value changes', () => {
    const checkStatus = (status: any) => {
      view.detectChanges();
      expect(view.host.status()).toBe(status);
    };
    view.host.value.set('12');
    checkStatus('valid');

    view.host.verifyOtp();
    checkStatus('incomplete');

    view.host.value.set('123');
    checkStatus('valid');

    view.host.status.set('maxAttempts');
    view.host.value.set('1234');
    checkStatus('maxAttempts');
  });

  it('should open lock popup', async () => {
    view.host.lockPopup('locked', '10 hours');
    view.detectChanges();

    const btn = view.queryRoot('scb-alert .test-alert-btn');
    expect(btn).toBeTruthy();

    btn.click();
    await view.whenStable();
    expect(view.queryRoot('scb-alert')).toBeFalsy();
  });

  it('should handle the otp restartTimer', () => {
    view.host.resendLoading.set(true);
    view.host.enableResend.set(true);

    view.host.restartTimer();
    expect(view.host.resendLoading()).toBeFalsy();
    expect(view.host.enableResend()).toBeTruthy();
    expect(view.host.resendDisabled()).toBeFalsy();

    view.host.restartTimer(true);
    expect(view.host.resendLoading()).toBeFalsy();
    expect(view.host.enableResend()).toBeTruthy();
    expect(view.host.resendDisabled()).toBeTruthy();

    view.host.restartTimer(false, true);
    expect(view.host.resendLoading()).toBeFalsy();
    expect(view.host.enableResend()).toBeFalsy();
    expect(view.host.resendDisabled()).toBeFalsy();
  });

  it('should handle last 3 digits of the number', () => {
    expect(getPhoneDigits('*****789')).toBe('789');
    expect(getPhoneDigits('************191')).toBe('191');
  });
});
