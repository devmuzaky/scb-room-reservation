import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ResourceStatus, signal, WritableSignal } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { Observable, of } from 'rxjs';
import { provideTestTransloco } from '@/config/transloco.testing';
import { fakeApi } from '@/core/test';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { ApiError, apiStatus, httpFakeResponse } from '@/models/api';
import { ERR } from '@/models/error';
import { CurrencyList, DashboardStore } from '@/store/dashboard.store';
import { Directionality } from '@scb/ui/bidi';
import { Breadcrumbs } from '@scb/ui/breadcrumb';
import { Select } from '@scb/ui/select';
import { Base64ConverterService } from '@scb/util/base64-converter';
import { fakeService, render, RenderResult } from '@scb/util/testing';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuModule } from 'primeng/menu';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { AccountDetailsService } from '../account-details/account-details.service';
import { AccountData } from './accounts-list.models';
import { AccountListPage } from './accounts-list.page';
import { AccountsListService } from './accounts-list.service';

const MOCK_ACCOUNT_LIST_RESPONSE = {
  lastUpdatedTimestamp: 1740388890531,
  totalBalance: 50000,
  totalPages: 5,
  totalRecords: 50,
  accountList: [
    {
      accountNumber: 'ACC-123456',
      accountNickName: 'My Savings',
      accountType: 'Savings',
      availableBalance: 10000,
      currency: 'USD',
    },
    {
      accountNumber: 'ACC-789012',
      accountNickName: 'My Checking',
      accountType: 'Checking',
      availableBalance: 5000,
      currency: 'EUR',
    },
  ],
} satisfies AccountData;

const MOCK_EMPTY_RESPONSE = {
  lastUpdatedTimestamp: 1740388890531,
  totalBalance: 0,
  totalPages: 0,
  totalRecords: 0,
  accountList: [],
} satisfies AccountData;

const httpClientStub = fakeService(HttpClient, {
  request: httpFakeResponse(MOCK_ACCOUNT_LIST_RESPONSE),
  get: () => of(),
});

@Component({ template: `` })
class TestLogin {}

describe('ACCOUNT LIST PAGE', () => {
  let view: RenderResult<AccountListPage>;
  let component: AccountListPage;
  let service: AccountsListService;
  let detailService: AccountDetailsService;

  let accountsListServiceMock: {
    downloadAccountList: jest.Mock<Observable<{ file: string }>>;
  };
  let accountDetailsServiceMock: { generateAccountDetailPDF: jest.Mock<Observable<{ pdfBase64: string }>> };

  let dashboardStoreMock: {
    currencyList: WritableSignal<CurrencyList>;
    setCurrencyList: (type: 'accounts' | 'certificates' | 'deposits', currencyList: string[]) => void;
  };
  let layoutFacadeMock: {
    language: jest.Mock;
    showBalances: jest.Mock;
  };
  let base64ConverterMock: { downloadPdf: jest.Mock; base64ToFile: jest.Mock };
  let activatedRouteMock: { snapshot: { queryParamMap: { get: jest.Mock } } };
  let selectMock: { close: jest.Mock };

  beforeEach(async () => {
    // Set up mock services first
    accountsListServiceMock = {
      downloadAccountList: jest.fn().mockReturnValue(of({ file: 'base64string' })),
    };

    accountDetailsServiceMock = {
      generateAccountDetailPDF: jest.fn().mockReturnValue(of({ pdfBase64: 'base64string' })),
    };

    dashboardStoreMock = {
      currencyList: signal({ accounts: ['EGP', 'USD'] } as CurrencyList),
      setCurrencyList: jest.fn(),
    };

    layoutFacadeMock = {
      language: jest.fn().mockReturnValue('en'),
      showBalances: jest.fn().mockReturnValue(signal(true)),
    };

    base64ConverterMock = {
      downloadPdf: jest.fn(),
      base64ToFile: jest.fn(),
    };

    selectMock = {
      close: jest.fn(),
    };

    // Create a Subject for queryParams to control when it emits

    activatedRouteMock = {
      snapshot: {
        queryParamMap: {
          get: jest.fn().mockReturnValue('EGP,USD'),
        },
      },
      queryParams: of({ currency: 'EGP,USD' }),
    } as any;

    // Render the component with all dependencies
    view = await render(AccountListPage, [
      provideNoopAnimations(),
      provideTestTransloco(),
      provideRouter([{ path: 'login', component: TestLogin }]),
      DatePipe,
      httpClientStub,
      { provide: AccountsListService, useValue: accountsListServiceMock },
      { provide: AccountDetailsService, useValue: accountDetailsServiceMock },

      { provide: DashboardStore, useValue: dashboardStoreMock },
      { provide: LayoutFacadeService, useValue: layoutFacadeMock },
      { provide: Base64ConverterService, useValue: base64ConverterMock },
      { provide: ActivatedRoute, useValue: activatedRouteMock },
      { provide: Directionality, useValue: { value: 'ltr', change: of('ltr') } },
      { provide: Breadcrumbs, useValue: {} },
      { provide: Select, useValue: selectMock },
      BreadcrumbModule,
      TooltipModule,
      TableModule,
      PaginatorModule,
      MenuModule,
    ]);

    view.detectChanges();
    component = view.host;

    service = view.injectHost(AccountsListService);
    detailService = view.injectHost(AccountDetailsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('OnInit', () => {
    it('should initialize with query params', async () => {
      expect(component.currencyValue()).toStrictEqual(['EGP', 'USD']);
    });
  });

  describe('Pagination & Reload table data', () => {
    it('should update page number and reload on page change', () => {
      jest.spyOn(view.host.accountListResource, 'reload');
      view.host.onPageChange({ first: 2, rows: 10 } as PaginatorState);
      expect(view.host.first()).toBe(2);
      expect(view.host.rows()).toBe(10);
      expect(view.host.accountListResource.reload).toHaveBeenCalled();
    });

    it('should apply filters and reload data', () => {
      jest.spyOn(component, 'onUpdateCurrencies');
      jest.spyOn(view.host.accountListResource, 'reload');
      view.detectChanges();
      view.host.applyFilter();
      expect(view.host.first()).toBe(0);
      expect(view.host.rows()).toBe(10);
      expect(view.host.accountListResource.reload).toHaveBeenCalled();
      expect(view.host.onUpdateCurrencies).toHaveBeenCalled();
    });

    it('should clear filters and reload data', () => {
      jest.spyOn(view.host.accountListResource, 'reload');
      view.host.clearFilter();
      expect(view.host.first()).toBe(0);
      expect(view.host.rows()).toBe(10);
      expect(view.host.currencyValue()).toStrictEqual([]);
      expect(view.host.accountListResource.reload).toHaveBeenCalled();
    });

    it('should reset filters and reload data', () => {
      jest.spyOn(component, 'onUpdateCurrencies');
      view.host.resetFilter();
      expect(view.host.first()).toBe(0);
      expect(view.host.rows()).toBe(10);
      expect(view.host.currencyValue()).toStrictEqual([]);
      expect(view.host.onUpdateCurrencies).toHaveBeenCalled();
    });
  });

  describe('Status', () => {
    it('should return "loading" when status is Loading', () => {
      const mockStatus = signal(ResourceStatus.Loading);
      (component as any).status = apiStatus(mockStatus);
      expect((component as any).status()).toBe('loading');
    });

    it('should return "loading" when status is Reloading', () => {
      const mockStatus = signal(ResourceStatus.Reloading);
      (component as any).status = apiStatus(mockStatus);
      expect((component as any).status()).toBe('loading');
    });

    it('should return "error" when status is Error', () => {
      const mockStatus = signal(ResourceStatus.Error);
      (component as any).status = apiStatus(mockStatus);
      expect((component as any).status()).toBe('error');
    });
    it('should return "default" when status is Error', () => {
      jest.spyOn(component.accountListResource, 'status').mockReturnValue(ResourceStatus.Idle);
      expect(component.status()).toBe('default');
    });
  });

  describe('Computed properties', () => {
    it('should load account list with data', async () => {
      httpClientStub.v.request = httpFakeResponse(MOCK_ACCOUNT_LIST_RESPONSE);
      component.accountListResource.reload();
      await view.whenStable();

      expect(component.accountList()).toStrictEqual(MOCK_ACCOUNT_LIST_RESPONSE.accountList);
      expect(component.totalBalance()).toBe(50000);
      expect(component.totalPages()).toBe(5);
      expect(component.totalRecords()).toBe(50);
      expect(component.lastUpdatedAt()).toBeDefined();
      expect(component.currenciesList()).toBeDefined();
    });

    it('should load account list with EMPTY data with loader function', async () => {
      httpClientStub.v.request = httpFakeResponse(MOCK_EMPTY_RESPONSE);
      component.accountListResource.reload();
      await view.whenStable();

      expect(component.accountList()).toStrictEqual([]);
      expect(component.totalBalance()).toBe(0);
      expect(component.totalPages()).toBe(0);
      expect(component.totalRecords()).toBe(0);
      expect(component.lastUpdatedAt()).toBeDefined();
    });
  });

  describe('Account Details PDF & Download ', () => {
    it('should call generatePDF and download the file on success', async () => {
      const api = fakeApi({
        pdfBase64: 'JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0Zpb+',
      });
      detailService.generateAccountDetailPDF = api.fn;

      jest.spyOn(view.host, 'showAccountDetailPDF');
      await view.host.showAccountDetailPDF('123456');
      expect(view.host.loading()).toBeTruthy();
      api.complete();
      expect(view.host.loading()).toBeFalsy();
    });

    it('should call generatePDF and generate error', async () => {
      const api = fakeApi(new ApiError({ code: ERR.BAD_GATEWAY, message: 'Server error' }));
      detailService.generateAccountDetailPDF = api.fn;

      await view.host.showAccountDetailPDF('12345');
      expect(view.host.loading()).toBeTruthy();
      api.complete();
      expect(view.host.loading()).toBeFalsy();
    });
  });

  describe('Account List PDF & Download', () => {
    it('should call downloadAccountList and download the file on success', async () => {
      const api = fakeApi({
        file: 'JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0Zpb+',
      });
      service.downloadAccountList = api.fn;

      jest.spyOn(base64ConverterMock, 'downloadPdf');

      await view.host.exportData('pdf');
      expect(view.host.loading()).toBeTruthy();
      api.complete();
      expect(view.host.loading()).toBeFalsy();
      expect(base64ConverterMock.downloadPdf).toHaveBeenCalledWith(
        'JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0Zpb+',
        'Accounts Overview', // Updated to match actual translation
      );
    });

    it('should call downloadAccountList for CSV and use base64ToFile', async () => {
      const api = fakeApi({
        file: 'base64csvstring',
      });
      service.downloadAccountList = api.fn;

      jest.spyOn(base64ConverterMock, 'base64ToFile');

      await view.host.exportData('csv');
      expect(view.host.loading()).toBeTruthy();
      api.complete();
      expect(view.host.loading()).toBeFalsy();
      expect(base64ConverterMock.base64ToFile).toHaveBeenCalledWith('base64csvstring', 'csv', 'Accounts Overview');
    });
  });
});
