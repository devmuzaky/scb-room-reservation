import { HttpClient } from '@angular/common/http';
import { Component, input, ResourceStatus, signal, WritableSignal } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { provideTestTransloco } from '@/config/transloco.testing';
import { AppLanguage } from '@/layout/layout-store';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { apiStatus, httpFakeResponse } from '@/models/api';
import { AuthStore, User } from '@/store/auth-store';
import { TabChangeEvent } from '@scb/ui/tabs';
import { fakeService, render, RenderResult } from '@scb/util/testing';
import { Accounts, AccountsOverView, Certificates, DashboardResponse, Deposits } from '../../model';
import { AccountOverview, AccountTabs } from './accounts-overview';
import { AccountsTab } from './accounts/accounts-tab.ng';
import { CertificatesTab } from './certificates/certificates-tab.ng';
import { TimeDepositsTab } from './time-deposit/time-deposit-tab.ng';

const httpStub = fakeService(HttpClient, {
  post: () => of(),
  get: () => of(),
  request: httpFakeResponse<DashboardResponse>({
    accountsOverView: {
      accounts: {
        equivalentInEGP: 1000,
        accountsList: [
          {
            currency: 'EGP',
            totalAmount: 1000,
            equivalentInEGP: 1000,
            totalAccounts: 3,
          },
        ],
      },
      certificates: {
        equivalentInEGP: 2000,
        certificatesList: [
          {
            currency: 'EGP',
            totalAmount: 2000,
            equivalentInEGP: 2000,
            certificatesCount: 1,
          },
        ],
      },
      deposits: {
        equivalentInEGP: 3000,
        depositsList: [
          {
            currency: 'EGP',
            totalAmount: 3000,
            equivalentInEGP: 3000,
            timeDepositsCount: 1,
          },
        ],
      },
      lastUpdateAt: 0,
    },
  }),
});

const LayoutFacadeStub = fakeService(LayoutFacadeService, {
  language: signal<AppLanguage>('en'),
  mobileMode: signal(false),
  isDarkTheme: signal(false),
});

@Component({ selector: 'app-accounts-tab', template: `` })
class FakeAccount implements Partial<AccountsTab> {
  readonly accounts = input.required<Accounts>();
}
@Component({ selector: 'app-accounts-tab', template: `` })
class FakeCertificate implements Partial<CertificatesTab> {
  readonly certificates = input.required<Certificates>();
}
@Component({ selector: 'app-accounts-tab', template: `` })
class FakeTimeDeposit implements Partial<TimeDepositsTab> {
  readonly deposits = input.required<Deposits>();
}

describe('AccountOverview', () => {
  let view: RenderResult<AccountOverview>;
  let component: AccountOverview;
  let authStoreMock: { user: WritableSignal<User> };

  beforeEach(async () => {
    authStoreMock = {
      user: signal({ username: '123' } as User),
    };

    view = await render(
      AccountOverview,
      [
        provideNoopAnimations(),
        provideTestTransloco(),
        httpStub,
        LayoutFacadeStub,
        { provide: AuthStore, useValue: authStoreMock },
      ],
      {
        components: [
          [{ imports: [AccountsTab] }, { imports: [FakeAccount] }],
          [{ imports: [CertificatesTab] }, { imports: [FakeCertificate] }],
          [{ imports: [TimeDepositsTab] }, { imports: [FakeTimeDeposit] }],
        ],
      },
    );

    component = view.host;
    jest.spyOn(component.dashboardData, 'status');
    jest.spyOn(component.layoutFacade, 'language').mockImplementation(() => 'ar');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create', () => {
    expect(view.host).toBeTruthy();
  });

  it('should initialize with default values', () => {
    authStoreMock.user.set({ username: null } as unknown as User);
    expect(component.totalEquivalent()).toBe(0);
    expect(component.dashboardData.status()).toBe(ResourceStatus.Loading);
  });

  it('should update the effect', async () => {
    component.dashboardData.reload();
    await view.sleep(1);
    await view.whenStable();
    expect(component.dashboardData.value()).toBeTruthy();
  });

  it('should compute accounts, certificates, and deposits correctly', () => {
    jest.spyOn(component.dashboardData, 'value').mockReturnValue({
      accountsOverView: {
        accounts: {
          equivalentInEGP: 1000,
          accountsList: [],
        },
        certificates: {
          equivalentInEGP: 2000,
          certificatesList: [],
        },
        deposits: {
          equivalentInEGP: 3000,
          depositsList: [],
        },
        lastUpdateAt: 0,
      },
    });

    expect(component.accounts()).toEqual({ equivalentInEGP: 1000, accountsList: [] });
    expect(component.certificates()).toEqual({ equivalentInEGP: 2000, certificatesList: [] });
    expect(component.deposits()).toEqual({ equivalentInEGP: 3000, depositsList: [] });
  });

  it('should update totalEquivalent on tab change', async () => {
    jest.spyOn(component.dashboardData, 'value').mockReturnValue({
      accountsOverView: {
        accounts: {
          equivalentInEGP: 1000,
          accountsList: [],
        },
        certificates: {
          equivalentInEGP: 2000,
          certificatesList: [],
        },
        deposits: {
          equivalentInEGP: 3000,
          depositsList: [],
        },
        lastUpdateAt: 0,
      },
    });

    component.onTabChange({ index: AccountTabs.ACCOUNTS } as TabChangeEvent);
    expect(component.totalEquivalent()).toBe(1000);

    component.onTabChange({ index: AccountTabs.CERTIFICATES } as TabChangeEvent);
    expect(component.totalEquivalent()).toBe(2000);

    component.onTabChange({ index: AccountTabs.DEPOSITS } as TabChangeEvent);
    expect(component.totalEquivalent()).toBe(3000);

    component.onTabChange({ index: -1 } as TabChangeEvent);
    expect(component.totalEquivalent()).toBe(0);
  });

  it('should return NaN when last updated timestamp is undefined', () => {
    jest.spyOn(component.dashboardData, 'value').mockReturnValue(undefined as unknown as DashboardResponse);
    component.dashboardData.reload();
    expect(component.lastUpdatedAt()).toBe('');
  });

  it('should format the last updated timestamp lastUpdatedAtFormatted', () => {
    const mockTimestamp = 1739866792044;
    const mockFormattedDate = '8:00 AM, 22 May 2025';
    jest.spyOn(component, 'lang').mockReturnValue('ar');
    jest.spyOn(component.datePipe, 'transform').mockReturnValue(mockFormattedDate);

    jest.spyOn(component.dashboardData, 'value').mockReturnValue({
      accountsOverView: {
        lastUpdateAt: mockTimestamp,
      },
    } as DashboardResponse);

    expect(component.lastUpdatedAt()).toBe(mockFormattedDate);
  });

  it('should return an empty object if lastUpdateAt is undefined', () => {
    jest.spyOn(component.dashboardData, 'value').mockReturnValue({
      accountsOverView: {},
    } as DashboardResponse);
    expect(component.lastUpdatedAt()).toBe('');
  });

  it('should return "loading" when status is Loading', () => {
    const mockStatus = signal(ResourceStatus.Loading);
    (component as any).status = apiStatus(mockStatus);
    expect((component as any).status()).toBe('loading');
  });

  it('should return "loading" when status is Reloading', () => {
    jest.spyOn(component.dashboardData, 'status').mockReturnValue(ResourceStatus.Reloading);
    expect(component.status()).toBe('loading');
  });

  it('should return "error" when status is Error', () => {
    const mockStatus = signal(ResourceStatus.Error);
    (component as any).status = apiStatus(mockStatus);
    expect((component as any).status()).toBe('error');
  });

  it('should return "default" when status is Error', () => {
    const mockStatus = signal(ResourceStatus.Idle);
    (component as any).status = apiStatus(mockStatus);
    expect((component as any).status()).toBe('default');
  });

  it('should return true when language is "ar"', () => {
    const result = component.isArabic();
    expect(result).toBe(true);
  });

  it('should return false when language is not "ar"', () => {
    jest.spyOn(component.layoutFacade, 'language').mockImplementation(() => 'en');
    const result = component.isArabic();
    expect(result).toBe(false);
  });

  it('should return empty objects for accounts, certificates, and deposits when dashboardData is undefined', () => {
    jest.spyOn(component.dashboardData, 'value').mockReturnValue(undefined);

    expect(component.accounts()).toEqual({});
    expect(component.certificates()).toEqual({});
    expect(component.deposits()).toEqual({});
  });

  it('should return empty objects for accounts, certificates, and deposits when accountsOverView is missing', () => {
    jest.spyOn(component.dashboardData, 'value').mockReturnValue({
      accountsOverView: {} as AccountsOverView,
    } as DashboardResponse);

    expect(component.accounts()).toEqual({});
    expect(component.certificates()).toEqual({});
    expect(component.deposits()).toEqual({});
  });

  describe('totalEquivalent computed property', () => {
    it('should return accounts equivalentInEGP when ACCOUNTS tab is selected', () => {
      jest.spyOn(component.dashboardData, 'value').mockReturnValue({
        accountsOverView: {
          lastUpdateAt: 123,
          accounts: {
            equivalentInEGP: 1000,
            accountsList: [],
          },
          certificates: {
            equivalentInEGP: 0,
            certificatesList: [],
          },
          deposits: {
            equivalentInEGP: 0,
            depositsList: [],
          },
        } as AccountsOverView,
      } as DashboardResponse);
      component.selectedTab.set(AccountTabs.ACCOUNTS);
      expect(component.totalEquivalent()).toBe(1000);
    });
    it('should return certificates equivalentInEGP when CERTIFICATES tab is selected', () => {
      jest.spyOn(component.dashboardData, 'value').mockReturnValue({
        accountsOverView: {
          lastUpdateAt: 0,
          accounts: {
            equivalentInEGP: 0,
            accountsList: [],
          },
          certificates: {
            equivalentInEGP: 2000,
            certificatesList: [],
          },
          deposits: {
            equivalentInEGP: 0,
            depositsList: [],
          },
        } as AccountsOverView,
      } as DashboardResponse);
      component.selectedTab.set(AccountTabs.CERTIFICATES);
      expect(component.totalEquivalent()).toBe(2000);
    });
    it('should return deposits equivalentInEGP when DEPOSITS tab is selected', () => {
      jest.spyOn(component.dashboardData, 'value').mockReturnValue({
        accountsOverView: {
          lastUpdateAt: 0,
          accounts: {
            equivalentInEGP: 0,
            accountsList: [],
          },
          certificates: {
            equivalentInEGP: 0,
            certificatesList: [],
          },
          deposits: {
            equivalentInEGP: 3000,
            depositsList: [],
          },
        } as AccountsOverView,
      } as DashboardResponse);
      component.selectedTab.set(AccountTabs.DEPOSITS);
      expect(component.totalEquivalent()).toBe(3000);
    });
    it('should return 0 when accounts equivalentInEGP is undefined', () => {
      jest.spyOn(component.dashboardData, 'value').mockReturnValue({
        accountsOverView: {
          lastUpdateAt: 0,
          accounts: {
            equivalentInEGP: undefined as unknown as number,
            accountsList: [],
          },
          certificates: {
            equivalentInEGP: 0,
            certificatesList: [],
          },
          deposits: {
            equivalentInEGP: 0,
            depositsList: [],
          },
        } as AccountsOverView,
      } as DashboardResponse);
      component.selectedTab.set(AccountTabs.ACCOUNTS);
      expect(component.totalEquivalent()).toBe(0);
    });
    it('should return 0 when certificates equivalentInEGP is undefined', () => {
      jest.spyOn(component.dashboardData, 'value').mockReturnValue({
        accountsOverView: {
          lastUpdateAt: 0,
          accounts: {
            equivalentInEGP: 0,
            accountsList: [],
          },
          certificates: {
            equivalentInEGP: undefined as unknown as number,
            certificatesList: [],
          },
          deposits: {
            equivalentInEGP: 0,
            depositsList: [],
          },
        } as AccountsOverView,
      } as DashboardResponse);
      component.selectedTab.set(AccountTabs.CERTIFICATES);
      expect(component.totalEquivalent()).toBe(0);
    });
    it('should return 0 when deposits equivalentInEGP is undefined', () => {
      jest.spyOn(component.dashboardData, 'value').mockReturnValue({
        accountsOverView: {
          lastUpdateAt: 0,
          accounts: {
            equivalentInEGP: 0,
            accountsList: [],
          },
          certificates: {
            equivalentInEGP: 0,
            certificatesList: [],
          },
          deposits: {
            equivalentInEGP: undefined as unknown as number,
            depositsList: [],
          },
        } as AccountsOverView,
      } as DashboardResponse);
      component.selectedTab.set(AccountTabs.DEPOSITS);
      expect(component.totalEquivalent()).toBe(0);
    });
    it('should return 0 when accountsOverView is undefined', () => {
      jest.spyOn(component.dashboardData, 'value').mockReturnValue(undefined);
      component.selectedTab.set(AccountTabs.ACCOUNTS);
      expect(component.totalEquivalent()).toBe(0);
      component.selectedTab.set(AccountTabs.CERTIFICATES);
      expect(component.totalEquivalent()).toBe(0);
      component.selectedTab.set(AccountTabs.DEPOSITS);
      expect(component.totalEquivalent()).toBe(0);
    });
    it('should return 0 when an invalid tab index is selected', () => {
      jest.spyOn(component.dashboardData, 'value').mockReturnValue({
        accountsOverView: {
          lastUpdateAt: 0,
          accounts: {
            equivalentInEGP: 1000,
            accountsList: [],
          },
          certificates: {
            equivalentInEGP: 0,
            certificatesList: [],
          },
          deposits: {
            equivalentInEGP: 0,
            depositsList: [],
          },
        } as AccountsOverView,
      } as DashboardResponse);
      component.selectedTab.set(99 as AccountTabs);
      expect(component.totalEquivalent()).toBe(0);
    });
  });
});
