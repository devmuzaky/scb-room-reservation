import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideTestTransloco } from '@/config/transloco.testing';
import { fakeApi } from '@/core/test';
import { ApiError } from '@/models/api';
import { ERR } from '@/models/error';
import { ElementHelper, fakeService, render, RenderResult } from '@scb/util/testing';
import { ActivateUser } from './activate-user';
import { ActivateUserComponent } from './activate-user.component';
import { ActivateUserService } from './activate-user.service';

const activateUserServiceStub = fakeService(ActivateUserService, {
  validateUser: jest.fn(),
});

describe('ActivateUser Component', () => {
  let view: RenderResult<ActivateUserComponent>;
  let usernameInput: ElementHelper<HTMLInputElement>;
  let service: ActivateUserService;
  let au: ActivateUser;

  beforeEach(async () => {
    view = await render(ActivateUserComponent, [
      provideNoopAnimations(),
      provideTestTransloco(),
      ActivateUser,
      activateUserServiceStub,
    ]);
    view.detectChanges();
    service = view.inject(ActivateUserService);
    au = view.inject(ActivateUser);
    usernameInput = view.$('.test-username');
  });

  function updateForm(username = 'scb') {
    usernameInput.input(username);
  }

  it('should create', () => {
    expect(view.host).toBeTruthy();
  });

  it('should handle the form validation', () => {
    updateForm('');
    expect(view.host.form.invalid).toBeTruthy();

    updateForm();
    expect(view.host.form.valid).toBeTruthy();
  });

  describe('Error Handling', () => {
    it('should not call api if it is invalid or loading', () => {
      updateForm('');

      view.host.submit();
      expect(service.validateUser).not.toHaveBeenCalled();

      updateForm();
      view.host.loading.set(true);

      view.host.submit();
      expect(service.validateUser).not.toHaveBeenCalled();
    });

    it('should call api if it is valid', () => {
      updateForm();

      jest.spyOn(au, 'next');
      const api = fakeApi({
        maskedMobileNumber: '123',
        maskedEmail: 'aa***@scb.com',
      });
      service.validateUser = api.fn;

      view.host.submit();
      api.complete();

      expect(au.next).toHaveBeenCalled();
      expect(au.username()).toBe('scb');
      expect(view.host.loading()).toBeFalsy();
      expect(view.host.isInvalid()).toBeFalsy();
    });

    it('should handle INVALID_USER or INVALID_COMPANY_ID errors from API', () => {
      updateForm(); // Provide valid username

      jest.spyOn(au, 'next');
      const api = fakeApi(
        new ApiError({
          code: ERR.INVALID_USER,
          message: 'Invalid User',
        }),
      );
      service.validateUser = api.fn;

      view.host.submit();
      api.complete();

      expect(au.next).toHaveBeenCalled();
      expect(au.username()).toBe('scb');
      expect(view.host.loading()).toBeFalsy();
    });
  });
});
