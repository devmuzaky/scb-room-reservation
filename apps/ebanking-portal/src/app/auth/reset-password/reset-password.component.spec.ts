import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { provideTestTransloco } from '@/config/transloco.testing';
import { fakeApi } from '@/core/test';
import { ApiError } from '@/models/api';
import { ERR } from '@/models/error';
import { ElementHelper, fakeService, render, RenderResult } from '@scb/util/testing';
import { ResetPasswordComponent } from './reset-password.component';

const httpClientStub = fakeService(HttpClient, {
  post: jest.fn(),
});

@Component({
  selector: 'scb-auth',
  template: '',
})
class AuthComponent {}

describe('ResetPassword Component', () => {
  let view: RenderResult<ResetPasswordComponent>;
  let newPasswordInput: ElementHelper<HTMLInputElement>;
  let confirmPasswordInput: ElementHelper<HTMLInputElement>;

  beforeEach(async () => {
    view = await render(ResetPasswordComponent, [
      provideNoopAnimations(),
      provideTestTransloco(),
      provideRouter([{ path: 'login', component: AuthComponent }]),
      httpClientStub,
    ]);
    view.setInput('username', 'scb');
    view.setInput(
      'api',
      jest.fn(() => of()),
    );

    view.detectChanges();
    newPasswordInput = view.$('.test-new-password');
    confirmPasswordInput = view.$('.test-confirm-password');
  });

  it('should create', () => {
    expect(view.host).toBeTruthy();
  });

  it('should validate the new password rules', () => {
    const scenarios = [
      ['Suez@12', 'Suez@1245'],
      ['suez@1245', 'Suez@1245'],
      ['SUEZ@1245', 'Suez@1245'],
      ['suez@frg', 'Suez@1245'],
      ['suez1245', 'Suez@1245'],
      ['scb@1245', 'Suez@1245'],
      ['111aaa@1245', 'Suez@1245'],
      ['abc123@1245', 'Suez@1245'],
    ];

    const success = ['failure', 'success'];
    for (let i = 0; i < scenarios.length; i++) {
      const data = scenarios[i];

      for (let j = 0; j < data.length; j++) {
        newPasswordInput.input(data[j]);

        const result = view.host.validatorTxt()[i].status;
        expect(result).toEqual(success[j]);
      }
    }
  });

  it('should handle the form validation', () => {
    newPasswordInput.input('123456');
    expect(view.host.form.invalid).toBeTruthy();

    newPasswordInput.input('Suez@1245');
    expect(view.host.form.invalid).toBeTruthy();

    confirmPasswordInput.input('123456');
    expect(view.host.form.invalid).toBeTruthy();

    confirmPasswordInput.input('Suez@1245');
    expect(view.host.form.valid).toBeTruthy();
  });

  it('should password mismatch error', () => {
    newPasswordInput.input('Suez@1245');
    expect(view.host.misMatch()).toBeFalsy();

    confirmPasswordInput.input('Sue');
    expect(view.host.misMatch()).toBeFalsy();

    confirmPasswordInput.input('');
    expect(view.host.misMatch()).toBeFalsy();
  });

  describe('Error Handling', () => {
    it('should not call api if it is invalid', () => {
      newPasswordInput.input('1234');

      view.host.submit();
      expect(view.host.api()).not.toHaveBeenCalled();
    });

    it('should call api if it is valid', () => {
      newPasswordInput.input('Suez@1245');
      confirmPasswordInput.input('Suez@1245');

      const api = fakeApi(null);
      view.setInput('api', api.fn);
      view.detectChanges();

      view.host.submit();
      api.complete();

      expect(view.host.success()).toBeTruthy();
    });

    it('should handle Last 5 password error from api', () => {
      newPasswordInput.input('Suez@1245');
      confirmPasswordInput.input('Suez@1245');

      const api = fakeApi(new ApiError({ code: ERR.REPEATED_PASSWORD, message: 'Security Issues' }));
      view.setInput('api', api.fn);
      view.detectChanges();

      view.host.submit();
      api.complete();

      expect(view.host.success()).toBeFalsy();
      expect(view.host.loading()).toBeFalsy();
      expect(view.host.error()).toBeTruthy();
      expect(view.host.form.value).toEqual({ password: '', confirmPassword: '' });
      view.detectChanges();

      expect(view.$('scb-alert')).toBeTruthy();
    });

    it('should handle expired token error', () => {
      newPasswordInput.input('Suez@1245');
      confirmPasswordInput.input('Suez@1245');

      const router = view.inject(Router);
      jest.spyOn(router, 'navigate');
      const api = fakeApi(new ApiError({ code: ERR.EXPIRED_TOKEN, message: 'expired token' }));
      view.setInput('api', api.fn);
      view.detectChanges();

      view.host.submit();
      api.complete();

      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});
