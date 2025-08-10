import { HttpClient } from '@angular/common/http';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { fakeService, render, RenderResult } from '@scb/util/testing';
import { provideTestTransloco } from '../../../../../core/config/transloco.testing';
import { RouterMock } from '../../../../../core/mocks/router.mock';
import { Accounts } from '../../../model';
import { AccountsTab } from './accounts-tab.ng';

const httpStub = fakeService(HttpClient, {
  post: jest.fn(),
  get: jest.fn(),
});

describe('AccountsTab', () => {
  let view: RenderResult<AccountsTab>;
  let component: AccountsTab;

  beforeEach(async () => {
    view = await render(AccountsTab, [
      provideNoopAnimations(),
      provideTestTransloco(),
      {
        provide: Router,
        useValue: RouterMock,
      },
      httpStub,
    ]);
    component = view.host;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(view.host).toBeTruthy();
  });

  it('should require accounts as input', () => {
    const mockAccounts: Accounts = {
      equivalentInEGP: 1000,
      accountsList: [],
    };
    Object.defineProperty(component, 'accounts', {
      value: mockAccounts,
    });
    expect(component.accounts).toEqual(mockAccounts);
  });

  it('should have accountType set to "Accounts"', () => {
    expect(component.accountType).toBe('Accounts');
  });
});
