import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { render, RenderResult } from '@scb/util/testing';
import { provideTestTransloco } from '../../../../../core/config/transloco.testing';
import { RouterMock } from '../../../../../core/mocks/router.mock';
import { Deposits } from '../../../model';
import { TimeDepositsTab } from './time-deposit-tab.ng';

describe('TimeDepositsTab', () => {
  let view: RenderResult<TimeDepositsTab>;
  let component: TimeDepositsTab;

  const mockDeposits: Deposits = {
    equivalentInEGP: 1000,
    depositsList: [],
  };

  beforeEach(async () => {
    view = await render(TimeDepositsTab, [
      provideNoopAnimations(),
      provideTestTransloco(),
      provideHttpClient(),
      provideHttpClientTesting(),
      {
        provide: Router,
        useValue: RouterMock,
      },
    ]);
    component = view.host;

    view.fixture.componentRef.setInput('deposits', mockDeposits);
    view.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(view.host).toBeTruthy();
  });

  it('should require deposits as input', () => {
    expect(component.deposits()).toEqual(mockDeposits);
  });

  it('should have accountType set to "Deposits"', () => {
    expect(component.accountType).toBe('Deposits');
  });
});
