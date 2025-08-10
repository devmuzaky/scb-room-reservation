import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { render, RenderResult } from '@scb/util/testing';
import { provideTestTransloco } from '../../../../../core/config/transloco.testing';
import { RouterMock } from '../../../../../core/mocks/router.mock';
import { Banner } from './banner.ng';

describe('AccountsTab', () => {
  let view: RenderResult<Banner>;
  let component: Banner;

  beforeEach(async () => {
    view = await render(Banner, [
      provideNoopAnimations(),
      provideTestTransloco(),
      {
        provide: Router,
        useValue: RouterMock,
      },
    ]);
    component = view.host;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(view.host).toBeTruthy();
  });
});
