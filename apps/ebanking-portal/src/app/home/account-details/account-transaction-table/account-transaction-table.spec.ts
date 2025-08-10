import { HttpClient } from '@angular/common/http';
import { ResourceStatus, signal } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { provideTestTransloco } from '@/config/transloco.testing';
import { AppLanguage } from '@/layout/layout-store';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { apiStatus, httpFakeResponse } from '@/models/api';
import { fakeService, render, RenderResult } from '@scb/util/testing';
import { STATUS_OPTIONS, TRANSACTION_TYPE_OPTIONS } from '../account-details.models';
import AccountTransactionsDetailTableComponent from './account-transaction-table';

const httpClientStub = fakeService(HttpClient, {
  request: httpFakeResponse({
    totalPages: 2,
    totalRecords: 50,
    transactions: [
      {
        accountId: 110038010100101,
        transactionDate: '2024-04-15',
        transactionType: 'UNKNOWN',
        description: null,
        debitAmount: 0,
        creditAmount: 1.2,
        status: 'Pending',
        currencyId: 'EGP',
        balanceAfter: 108782.76,
      },
    ],
  }),
});

const activatedRouteStub = {
  snapshot: {
    paramMap: {
      get: jest.fn().mockReturnValue('mockAccountId'),
    },
  },
};

const layoutFacadeServiceStub = fakeService(LayoutFacadeService, {
  isDarkTheme: signal(false),
  language: signal('en' as AppLanguage),
});

fdescribe('AccountDetailsComponent', () => {
  let view: RenderResult<AccountTransactionsDetailTableComponent>;
  let component: AccountTransactionsDetailTableComponent;

  beforeEach(async () => {
    view = await render(AccountTransactionsDetailTableComponent, [
      provideNoopAnimations(),
      provideTestTransloco(),
      httpClientStub,
      layoutFacadeServiceStub,
      { provide: ActivatedRoute, useValue: activatedRouteStub },
    ]);

    view.detectChanges();
    component = view.host;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create', () => {
    expect(view.host).toBeTruthy();
  });

  it('should get accountId from ActivatedRoute', () => {
    expect(view.host.accountId()).toBe('mockAccountId');
  });

  it('should get the default language', () => {
    expect(view.host.lang()).toBe('en');
  });

  it('should update page number and reload on page change', () => {
    jest.spyOn(view.host, 'reload');
    view.host.onPageChange({ page: 0, rows: 10 } as any);
    expect(view.host.pageNumber()).toBe(0);
    expect(view.host.rows()).toBe(10);
    expect(view.host.reload).toHaveBeenCalled();
  });

  it('should update rows and reload on page size change', () => {
    jest.spyOn(view.host, 'reload');
    const mockEvent = { value: 20 } as any;
    view.host.onPageSizeChange(mockEvent);
    expect(view.host.rows()).toBe(20);
    expect(view.host.reload).toHaveBeenCalled();
  });

  it('should apply filters and reload transactions', () => {
    jest.spyOn(view.host, 'reload');
    view.host.applyFilter();
    expect(view.host.pageNumber()).toBe(0);
    expect(view.host.rows()).toBe(10);
    expect(view.host.reload).toHaveBeenCalled();
  });

  it('should reset filters and reload transactions', () => {
    jest.spyOn(view.host, 'reload');
    view.host.resetFilter();
    expect(view.host.pageNumber()).toBe(0);
    expect(view.host.rows()).toBe(10);
    expect(view.host.reload).toHaveBeenCalled();
  });

  it('should return totalRecords value when accountTransactionsList has data', () => {
    (component as any).accountTransactionsList = createMockResourceRef({
      transactions: [],
      pagination: {
        pageSize: 10,
        pageStart: 0,
        totalPages: 1,
        totalSize: 5,
      },
    });

    expect(component.totalSize()).toBe(5);
  });

  it('should return 0 when accountTransactionsList is undefined', () => {
    (component as any).accountTransactionsList = createMockResourceRef(undefined);

    expect(component.totalSize()).toBe(0);
  });

  it('should return 0 when totalRecords is missing', () => {
    (component as any).accountTransactionsList = createMockResourceRef({
      transactions: [],
      pagination: {
        pageSize: 10,
        pageStart: 0,
        totalPages: 1,
        totalSize: 0,
      },
    } as any);

    expect(component.totalSize()).toBe(0);
  });

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
    jest.spyOn(component.accountTransactionsList, 'status').mockReturnValue(ResourceStatus.Idle);
    expect(component.status()).toBe('default');
  });

  it('should handle undefined state for darkMode signal', () => {
    jest.spyOn(component.layoutFacade, 'isDarkTheme').mockReturnValue(false);
    expect(component.darkMode()).toBe(false);
  });

  it('should handle undefined state for transactionFilterOptions', () => {
    expect(component.transactionFilterOptions()).toEqual(TRANSACTION_TYPE_OPTIONS);
  });

  it('should handle undefined state for statusFilterOptions', () => {
    expect(component.statusFilterOptions()).toEqual(STATUS_OPTIONS);
  });

  it('should handle undefined state for accountDetailList', () => {
    (component as any).accountTransactionsList = createMockResourceRef(undefined);
    expect(component.accountDetailList()).toEqual({
      totalPages: 0,
      totalSize: 0,
      transactions: [],
    });
  });

  it('should handle undefined state for totalPages', () => {
    (component as any).accountTransactionsList = createMockResourceRef(undefined);
    expect(component.totalPages()).toBe(0);
  });

  it('should handle undefined state for totalPages when value() returns undefined', () => {
    const mockResourceRef = createMockResourceRef(undefined);
    mockResourceRef.value = jest.fn().mockReturnValue(undefined);
    (component as any).accountTransactionsList = mockResourceRef;
    expect(component.totalPages()).toBe(0);
  });

  it('should return totalPages from pagination when value() returns data', () => {
    const mockResourceRef = createMockResourceRef({
      transactions: [],
      pagination: {
        pageSize: 10,
        pageStart: 0,
        totalPages: 5,
        totalSize: 50,
      },
    });
    (component as any).accountTransactionsList = mockResourceRef;
    expect(component.totalPages()).toBe(5);
  });

  it('should handle undefined state for totalSize', () => {
    (component as any).accountTransactionsList = createMockResourceRef(undefined);
    expect(component.totalSize()).toBe(0);
  });

  it('should handle undefined state for isAccountListEmpty', () => {
    (component as any).accountTransactionsList = createMockResourceRef(undefined);
    expect(component.isAccountListEmpty()).toBe(true);
  });

  it('should return 1 for totalPage when lang changes', () => {
    // Mock the lang signal to trigger the computation
    jest.spyOn(component.layoutFacade, 'language').mockReturnValue('ar');
    expect(component.totalPage()).toBe(1);
  });

  it('should handle undefined transactionSelect viewChild', () => {
    const mockSelect = {
      close: jest.fn(),
    };
    (component as any).transactionSelect = signal(mockSelect);
    component.applyFilter();
    expect(mockSelect.close).toHaveBeenCalled();
  });

  it('should handle undefined value from transactionSelect signal', () => {
    (component as any).transactionSelect = signal(undefined);
    component.applyFilter();
    // Should not throw error when transactionSelect signal returns undefined
    expect(component.transactionSelect()).toBeUndefined();
  });

  it('should handle undefined value from transactionSelect signal in resetFilter', () => {
    (component as any).transactionSelect = signal(undefined);
    component.resetFilter();
    // Should not throw error when transactionSelect signal returns undefined
    expect(component.transactionSelect()).toBeUndefined();
  });

  it('should not append status parameter when statusTypeValue is empty', () => {
    component.statusTypeValue.set('');
    const params = component.getParams();
    expect(params.get('status')).toBeNull();
  });

  it('should append status parameter when statusTypeValue has value', () => {
    component.statusTypeValue.set('Pending');
    const params = component.getParams();
    expect(params.get('status')).toBe('Pending');
  });

  it('should not append transactionTypes parameter when array is empty', () => {
    component.transactionTypeValue.set([]);
    const params = component.getParams();
    expect(params.get('transactionTypes')).toBeNull();
  });

  it('should append transactionTypes parameter when array has values', () => {
    component.transactionTypeValue.set(['Type1', 'Type2']);
    const params = component.getParams();
    expect(params.get('transactionTypes')).toBe('Type1,Type2');
  });

  it('should return true when accountDetailList is undefined', () => {
    const mockResourceRef = createMockResourceRef(undefined);
    (component as any).accountTransactionsList = mockResourceRef;
    expect(component.isAccountListEmpty()).toBe(true);
  });

  it('should return true when accountDetailList exists but transactions is undefined', () => {
    const mockResourceRef = createMockResourceRef({
      transactions: undefined,
      pagination: {
        pageSize: 10,
        pageStart: 0,
        totalPages: 1,
        totalSize: 0,
      },
    });
    (component as any).accountTransactionsList = mockResourceRef;
    expect(component.isAccountListEmpty()).toBe(true);
  });
});

function createMockResourceRef<T>(initialValue: T) {
  let currentValue = initialValue;

  return {
    value: jest.fn(() => currentValue),
    hasValue: jest.fn(() => currentValue !== undefined),
    status: jest.fn(() => 'ready'),
    destroy: jest.fn(),
    refresh: jest.fn(),
    set: jest.fn((newValue: T) => {
      currentValue = newValue;
    }),
  } as any;
}
