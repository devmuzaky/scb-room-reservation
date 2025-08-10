import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideTestTransloco } from '@/config/transloco.testing';
import { fakeApi } from '@/core/test';
import { ApiError } from '@/models/api';
import { ERR } from '@/models/error';
import { ElementHelper, fakeService, render, RenderResult } from '@scb/util/testing';
import { Registration } from './registration';
import { RegistrationFormComponent } from './registration-form.component';
import { RegistrationService } from './registration.service';

const forgetPasswordServiceStub = fakeService(RegistrationService, {
  registerUser: jest.fn(),
});

describe('ResetPassword Component', () => {
  let view: RenderResult<RegistrationFormComponent>;
  let companyIdInput: ElementHelper<HTMLInputElement>;
  let usernameInput: ElementHelper<HTMLInputElement>;
  let service: RegistrationService;
  let fp: Registration;

  beforeEach(async () => {
    view = await render(RegistrationFormComponent, [
      provideNoopAnimations(),
      provideTestTransloco(),
      Registration,
      forgetPasswordServiceStub,
    ]);
    view.detectChanges();
    service = view.inject(RegistrationService);
    fp = view.inject(Registration);
    companyIdInput = view.$('.test-company-id');
    usernameInput = view.$('.test-username');
  });

  function updateForm(id = '123', username = 'scb') {
    companyIdInput.input(id);
    usernameInput.input(username);
  }

  it('should create', () => {
    expect(view.host).toBeTruthy();
  });

  it('should handle the form validation', () => {
    updateForm('', '');
    expect(view.host.form.invalid).toBeTruthy();

    updateForm('1', '');
    expect(view.host.form.invalid).toBeTruthy();

    updateForm('', '1');
    expect(view.host.form.invalid).toBeTruthy();

    updateForm();
    expect(view.host.form.valid).toBeTruthy();
  });

  describe('Error Handling', () => {
    it('should not call api if it is invalid or loading', () => {
      updateForm('1234', '');

      view.host.submit();
      expect(service.registerUser).not.toHaveBeenCalled();

      updateForm();
      view.host.loading.set(true);

      view.host.submit();
      expect(service.registerUser).not.toHaveBeenCalled();
    });

    it('should call api if it is valid', () => {
      updateForm();

      jest.spyOn(fp, 'next');
      const api = fakeApi({
        numberOfAttempts: 0,
        token: '123',
        maskedMobileNumber: '123',
        maskedEmail: 'aa***@scb.com',
      });
      service.registerUser = api.fn;

      view.host.submit();
      api.complete();

      expect(fp.next).toHaveBeenCalled();
      expect(fp.username()).toBe('scb');
      expect(view.host.loading()).toBeFalsy();
      expect(view.host.isInvalid()).toBeFalsy();
    });

    it('should handle incorrect credentials error from api', () => {
      updateForm();

      jest.spyOn(fp, 'next');
      const api = fakeApi(new ApiError({ code: ERR.INVALID_COMPANY_ID, message: 'Incorrect credentials' }));
      service.registerUser = api.fn;

      view.host.submit();
      api.complete();

      expect(fp.next).not.toHaveBeenCalled();
      expect(view.host.loading()).toBeFalsy();
      expect(view.host.isInvalid()).toBeTruthy();
      view.detectChanges();

      expect(view.$('scb-alert')).toBeTruthy();
    });

    it('should handle locked temporarily error from api and reset form on close', async () => {
      updateForm();

      jest.spyOn(fp, 'next');
      const api = fakeApi(
        new ApiError({
          code: ERR.LOCKED_TEMPORARILY,
          message: 'Locked temporarily',
          details: { hoursRemaining: '2025-02-02 15:36:00.0' },
        }),
      );
      service.registerUser = api.fn;

      view.host.submit();
      api.complete();

      expect(fp.next).not.toHaveBeenCalled();
      expect(view.host.loading()).toBeFalsy();
      expect(view.host.isInvalid()).toBeFalsy();
    });
  });
});
