import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideTestTransloco } from '@/config/transloco.testing';
import { fakeService, render, RenderResult } from '@scb/util/testing';
import { Registration } from './registration';
import { RegistrationFeatureComponent } from './registration-feature.component';
import { RegistrationService } from './registration.service';

const forgetPasswordServiceStub = fakeService(RegistrationService, {
  registerUser: jest.fn(),
});

describe('RegistrationFeatureComponent', () => {
  let view: RenderResult<RegistrationFeatureComponent>;
  let reg: Registration;
  let component: RegistrationFeatureComponent;

  beforeEach(async () => {
    view = await render(RegistrationFeatureComponent, [
      provideNoopAnimations(),
      provideTestTransloco(),
      Registration,
      forgetPasswordServiceStub,
    ]);
    view.detectChanges();
    reg = view.inject(Registration);
    component = view.host;
    jest.spyOn(reg, 'next');
  });

  it('should create', () => {
    expect(view.host).toBeTruthy();
  });

  it('should call next when getStarted is triggered', () => {
    component.getStarted();
    expect(reg.next).toHaveBeenCalled();
  });
});
