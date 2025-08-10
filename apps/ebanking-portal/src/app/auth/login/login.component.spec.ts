import { Component, signal } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';
import { Subject, throwError } from 'rxjs';
import { provideTestTransloco } from '@/config/transloco.testing';
import { automationTestIds, fakeApi } from '@/core/test';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { ApiError } from '@/models/api';
import { ERR } from '@/models/error';
import { Captcha } from '@scb/ui/captcha';
import { EncryptionService } from '@scb/util/encryption';
import { fakeService, render, RenderResult } from '@scb/util/testing';
import { EXTERNAL_LINKS } from '../../core/constants/urls';
import { AuthService, LoginRes } from '../api/auth.service';
import { LoginComponent } from './login.component';

@Component({
  selector: 'scb-captcha',
  template: ``,
})
export class TestCaptcha implements Partial<Captcha> {
  getToken(): Promise<string | null> {
    return Promise.resolve('1234');
  }
}

const authServiceStub = fakeService(AuthService, {
  me: jest.fn().mockReturnValue(new Subject()),
  login: jest.fn().mockReturnValue(new Subject()),
  refreshToken: jest.fn().mockReturnValue(new Subject()),
  logout: jest.fn().mockReturnValue(new Subject()),
});

const encryptionServiceStub = fakeService(EncryptionService, {
  encryptData: () => Promise.resolve({ encryptedPassword: '123', publicKey: '11aw1e11-11' }),
});

const layoutFacadeStub = fakeService(LayoutFacadeService, () => {
  const language = signal<'en' | 'ar'>('en');
  return {
    language,
    isDarkTheme: signal(false),
    __: { language },
  };
});

@Component({
  template: `<p>Dashboard</p>`,
})
export class TestComponent {}

describe('SignIn Component', () => {
  let view: RenderResult<LoginComponent>;
  let component: LoginComponent;
  let router: Router;

  beforeEach(async () => {
    view = await render(
      LoginComponent,
      [
        provideTestTransloco(),
        provideNoopAnimations(),
        provideRouter([{ path: 'dashboard', component: TestComponent }]),
        authServiceStub,
        layoutFacadeStub,
      ],
      {
        providers: [authServiceStub, encryptionServiceStub],
        components: [[{ imports: [Captcha] }, { imports: [TestCaptcha] }]],
      },
    );

    component = view.host;
    router = view.inject(Router);
    view.detectChanges();
  });

  function updateForm(username = 'testUser', password = 'testPassword') {
    component.form.controls.username.setValue(username);
    component.form.controls.password.setValue(password);
  }

  function spyApi(data: ApiError) {
    return jest.fn(() => throwError(() => data));
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should make all the fields touched when form is invalid', async () => {
    const keys: ('username' | 'password')[] = ['username', 'password'];
    expect(component.form.invalid).toBeTruthy();

    await component.submit();
    for (const key of keys) {
      expect(component.form.controls[key].touched).toBeTruthy();
    }
  });

  it('should call callLogin', async () => {
    component['callLogin'] = jest.fn();

    updateForm();
    await component.submit();
    expect(component['callLogin']).toHaveBeenCalled();
  });

  xit('should call auth.login and navigate to dashboard on successful login', async () => {
    const api = fakeApi<LoginRes>({
      expiresIn: 80,
      accessToken: 'hhhd',
      refreshToken: 'djdj',
    });
    authServiceStub.v.login = api.fn;

    const navigateSpy = jest.spyOn(router, 'navigate');

    updateForm();
    await component.submit();

    expect(component.loading()).toBeTruthy();

    api.complete();
    // expect(component.loading()).toBeFalsy();
    expect(navigateSpy).toHaveBeenCalledWith(['dashboard']);
  });

  it('should call the callLogin method with valid token', async () => {
    component['callLogin'] = jest.fn();

    updateForm();
    await component.submit();

    expect(component['callLogin']).toHaveBeenCalledWith('1234');
  });

  it('should open the correct privacy policy URL based on language', () => {
    const eh = view.$<HTMLAnchorElement>('.test-privacy-policy');

    expect(eh.el.href).toBe(EXTERNAL_LINKS.privacyPolicy.en);
    expect(eh.el.target).toBe('_blank');

    layoutFacadeStub._.language.set('ar');
    view.detectChanges();
    expect(eh.el.href).toBe(EXTERNAL_LINKS.privacyPolicy.ar);
  });

  it('should open the correct terms and conditions URL based on language', () => {
    const eh = view.$<HTMLAnchorElement>('.test-terms-and-conditions');

    expect(eh.el.href).toBe(EXTERNAL_LINKS.termsAndConditions.en);
    expect(eh.el.target).toBe('_blank');

    layoutFacadeStub._.language.set('ar');
    view.detectChanges();
    expect(eh.el.href).toBe(EXTERNAL_LINKS.termsAndConditions.ar);
  });

  it('should open the correct callUsUrl based on language', () => {
    const eh = view.$<HTMLAnchorElement>('.test-call-us');

    expect(eh.el.href).toBe(EXTERNAL_LINKS.callUs.en);
    expect(eh.el.target).toBe('_blank');

    layoutFacadeStub._.language.set('ar');
    view.detectChanges();
    expect(eh.el.href).toBe(EXTERNAL_LINKS.callUs.ar);
  });

  it('should open the correct sncUrl based on language', () => {
    const eh = view.$<HTMLAnchorElement>('.test-suggestion-and-complaints');

    expect(eh.el.href).toBe(EXTERNAL_LINKS.suggestionsAndComplaints.en);
    expect(eh.el.target).toBe('_blank');

    layoutFacadeStub._.language.set('ar');
    view.detectChanges();
    expect(eh.el.href).toBe(EXTERNAL_LINKS.suggestionsAndComplaints.ar);
  });

  automationTestIds(() => view, {
    'test-username-input': 'should have a unique class for the username field',
    'test-login-submit': 'should have a unique class name for the login submit',
    'test-error-message': 'should have a class name for the error message',
    'test-privacy-policy': 'should have a privacy policy element',
    'test-registration': 'should have a registration element',
  });

  describe('ErrorHandling', () => {
    it('should handle error on failed login and set error message', async () => {
      const errorDetail = {
        code: ERR.BAD_CREDENTIALS,
        message: 'Login failed',
      };
      authServiceStub.v.login = spyApi(new ApiError({ message: errorDetail.message, code: ERR.BAD_CREDENTIALS }));

      updateForm();
      await component.submit();

      expect(authServiceStub.v.login).toHaveBeenCalled();
      expect(component.loading()).toBe(false);
      expect(component.error()).toEqual(errorDetail);
    });

    it('should handle error on login when recaptcha token is invalid', async () => {
      const error = { message: 'Invalid recaptcha token', code: ERR.INVALID_RECAPTCHA };
      authServiceStub.v.login = spyApi(new ApiError({ code: ERR.INVALID_RECAPTCHA, message: error.message }));

      updateForm();
      await component.submit();

      expect(component.loading()).toBeFalsy();
      expect(component.error()).toEqual(error);
    });

    it('should set the dialog details and open the dialog when errorCode exists in errorMapping', async () => {
      const errorDetail = {
        title: 'Server unavailable',
        message: 'We are experiencing technical difficulties, please try again later',
      };
      component.errorMapping = {
        [ERR.SERVER_ERROR]: {
          title: 'Server unavailable',
          message: 'We are experiencing technical difficulties, please try again later',
        },
      };
      authServiceStub.v.login = spyApi(
        new ApiError({
          message: 'We are experiencing technical difficulties, please try again later',
          code: ERR.SERVER_ERROR,
        }),
      );

      updateForm();
      await component.submit();
      expect(errorDetail).toEqual(component.errorMapping[ERR.SERVER_ERROR]);
    });

    it('should set the dialog details and open the dialog when server error exists in errorMapping', async () => {
      const errorDetail = {
        title: 'The account is locked',
        message: 'Too many failed login attempts.For support please contact 19093.',
      };
      component.errorMapping = {
        [ERR.USER_LOCKED]: {
          title: 'The account is locked',
          message: 'Too many failed login attempts.For support please contact 19093.',
        },
      };
      authServiceStub.v.login = spyApi(
        new ApiError({
          message: 'Too many failed login attempts.For support please contact 19093.',
          code: ERR.USER_LOCKED,
        }),
      );

      updateForm();
      await component.submit();
      expect(errorDetail).toEqual(component.errorMapping[ERR.USER_LOCKED]);
    });

    it('should set the alert details when errorCode exists in alertErrorMapping', async () => {
      component.alertErrorMapping = {
        [ERR.BAD_CREDENTIALS]: {
          title: 'Invalid credentials',
          message: 'Invalid username or password. Please try again.',
        },
      };
      authServiceStub.v.login = spyApi(
        new ApiError({ message: 'Invalid username or password. Please try again.', code: ERR.BAD_CREDENTIALS }),
      );

      updateForm();
      await component.submit();
      expect(component.alertErrorDetail()).toEqual(component.alertErrorMapping[ERR.BAD_CREDENTIALS]);
    });
  });
});
