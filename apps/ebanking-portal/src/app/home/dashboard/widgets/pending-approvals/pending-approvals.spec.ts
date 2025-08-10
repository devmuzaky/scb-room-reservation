import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { provideTestTransloco } from '@/config/transloco.testing';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { fakeService, render, RenderResult } from '@scb/util/testing';
import { PendingApprovals } from './pending-approvals';

const httpClientStub = fakeService(HttpClient, {
  post: () => of(),
  get: () => of(),
});

describe('PendingApprovals', () => {
  let view: RenderResult<PendingApprovals>;

  let component: PendingApprovals;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [{ provide: LayoutFacadeService, useFactory: () => ({}) }],
    });

    view = await render(PendingApprovals, [provideNoopAnimations(), provideTestTransloco(), httpClientStub], {
      providers: [],
    });

    component = view.host;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create', () => {
    expect(view.host).toBeTruthy();
  });

  it('should map approvalsDetail correctly', () => {
    const transactionGroup = {
      groupId: 'TRANSFERS',
      groupName: 'Transfers',
      groupDescription: 'Transfer Description',
      transactions: [
        {
          transactionId: '123',
          transactionType: 'Transfer',
          submittedBy: 'User',
          submittedAt: '2025-02-27',
          status: 'Pending',
          amount: { currency: 'USD', value: 100 },
        },
      ],
    };
    jest.spyOn(component, 'myApprovals').mockReturnValue({ groups: [transactionGroup] } as any);
    jest.spyOn(component.translocoService, 'translate').mockImplementation((key: any) => key);
    const result = component.approvalsDetail();
    expect(result[0].heading).toBe('dashboard.pendingApprovals.transfers');
    expect(result[0].icon).toBe('bank-transfer');
    expect(result[0].totalTransactions).toBe(1);
  });

  it('should return myApprovals from resource', () => {
    const mockTransactionResponse = {
      status: 'Success',
      groups: [
        {
          groupId: 'TRANSFERS',
          groupName: 'Transfers',
          transactions: [],
        },
      ],
    } as any;

    jest.spyOn(component.myApprovalsResource, 'value').mockReturnValue(mockTransactionResponse);
    expect(component.myApprovals()).toEqual(mockTransactionResponse);
  });

  it('should return otherApprovals from resource', () => {
    const mockTransactionResponse = {
      status: 'Success',
      groups: [
        {
          groupId: 'PAYMENTS',
          groupName: 'Payments',
          transactions: [],
        },
      ],
    } as any;

    jest.spyOn(component.otherApprovalsResource, 'value').mockReturnValue(mockTransactionResponse);
    expect(component.otherApprovals()).toEqual(mockTransactionResponse);
  });

  it('should return undefined when myApprovals resource value is undefined', () => {
    jest.spyOn(component.myApprovalsResource, 'value').mockReturnValue(undefined);
    expect(component.myApprovals()).toBeUndefined();
  });

  it('should return undefined when otherApprovals resource value is undefined', () => {
    jest.spyOn(component.otherApprovalsResource, 'value').mockReturnValue(undefined);
    expect(component.otherApprovals()).toBeUndefined();
  });

  it('should handle myApprovals with empty groups', () => {
    const mockTransactionResponse = {
      status: 'Success',
      groups: [],
    } as any;

    jest.spyOn(component.myApprovalsResource, 'value').mockReturnValue(mockTransactionResponse);
    expect(component.myApprovals()).toEqual(mockTransactionResponse);
  });

  it('should handle otherApprovals with empty groups', () => {
    const mockTransactionResponse = {
      status: 'Success',
      groups: [],
    } as any;

    jest.spyOn(component.otherApprovalsResource, 'value').mockReturnValue(mockTransactionResponse);
    expect(component.otherApprovals()).toEqual(mockTransactionResponse);
  });

  it('should handle myApprovals with complex transaction data', () => {
    const mockTransactionResponse = {
      status: 'Success',
      groups: [
        {
          groupId: 'TRANSFERS',
          groupName: 'Transfers',
          transactions: [
            {
              transactionId: '123',
              transactionType: 'Transfer',
              submittedBy: 'User',
              submittedAt: '2025-02-27',
              status: 'Pending',
              amount: { currency: 'USD', value: 100 },
            },
          ],
        },
        {
          groupId: 'PAYMENTS',
          groupName: 'Payments',
          transactions: [
            {
              transactionId: '456',
              transactionType: 'Payment',
              submittedBy: 'User2',
              submittedAt: '2025-02-28',
              status: 'Pending',
              amount: { currency: 'EUR', value: 200 },
            },
          ],
        },
      ],
    } as any;

    jest.spyOn(component.myApprovalsResource, 'value').mockReturnValue(mockTransactionResponse);
    expect(component.myApprovals()).toEqual(mockTransactionResponse);
  });

  it('should handle otherApprovals with complex transaction data', () => {
    const mockTransactionResponse = {
      status: 'Success',
      groups: [
        {
          groupId: 'REQUESTS',
          groupName: 'Requests',
          transactions: [
            {
              transactionId: '789',
              transactionType: 'Request',
              submittedBy: 'User3',
              submittedAt: '2025-02-29',
              status: 'Pending',
              amount: { currency: 'GBP', value: 300 },
            },
          ],
        },
      ],
    } as any;

    jest.spyOn(component.otherApprovalsResource, 'value').mockReturnValue(mockTransactionResponse);
    expect(component.otherApprovals()).toEqual(mockTransactionResponse);
  });

  it('should return myApprovals groups when activeTab is MAKER', () => {
    const mockMyApprovals = {
      status: 'Success',
      groups: [
        {
          groupId: 'TRANSFERS',
          groupName: 'Transfers',
          transactions: [],
        },
      ],
    } as any;

    jest.spyOn(component.myApprovalsResource, 'value').mockReturnValue(mockMyApprovals);
    jest.spyOn(component.otherApprovalsResource, 'value').mockReturnValue(undefined);
    component.activeTab.set(component.ApprovalTypesEnum.MAKER);
    jest.spyOn(component.translocoService, 'translate').mockImplementation((key: any) => key);

    const result = component.approvalsDetail();
    expect(result).toHaveLength(1);
    expect(result[0].groupId).toBe('TRANSFERS');
  });

  it('should return otherApprovals groups when activeTab is CHECKER', () => {
    const mockOtherApprovals = {
      status: 'Success',
      groups: [
        {
          groupId: 'PAYMENTS',
          groupName: 'Payments',
          transactions: [],
        },
      ],
    } as any;

    jest.spyOn(component.myApprovalsResource, 'value').mockReturnValue(undefined);
    jest.spyOn(component.otherApprovalsResource, 'value').mockReturnValue(mockOtherApprovals);
    component.activeTab.set(component.ApprovalTypesEnum.CHECKER);
    jest.spyOn(component.translocoService, 'translate').mockImplementation((key: any) => key);

    const result = component.approvalsDetail();
    expect(result).toHaveLength(1);
    expect(result[0].groupId).toBe('PAYMENTS');
  });

  it('should return empty array when activeTab is MAKER but myApprovals is undefined', () => {
    jest.spyOn(component.myApprovalsResource, 'value').mockReturnValue(undefined);
    jest.spyOn(component.otherApprovalsResource, 'value').mockReturnValue(undefined);
    component.activeTab.set(component.ApprovalTypesEnum.MAKER);
    jest.spyOn(component.translocoService, 'translate').mockImplementation((key: any) => key);

    const result = component.approvalsDetail();
    expect(result).toEqual([]);
  });

  it('should return empty array when activeTab is CHECKER but otherApprovals is undefined', () => {
    jest.spyOn(component.myApprovalsResource, 'value').mockReturnValue(undefined);
    jest.spyOn(component.otherApprovalsResource, 'value').mockReturnValue(undefined);
    component.activeTab.set(component.ApprovalTypesEnum.CHECKER);
    jest.spyOn(component.translocoService, 'translate').mockImplementation((key: any) => key);

    const result = component.approvalsDetail();
    expect(result).toEqual([]);
  });

  it('should return empty array when activeTab is MAKER but myApprovals has no groups', () => {
    const mockMyApprovals = {
      status: 'Success',
      groups: undefined,
    } as any;

    jest.spyOn(component.myApprovalsResource, 'value').mockReturnValue(mockMyApprovals);
    jest.spyOn(component.otherApprovalsResource, 'value').mockReturnValue(undefined);
    component.activeTab.set(component.ApprovalTypesEnum.MAKER);
    jest.spyOn(component.translocoService, 'translate').mockImplementation((key: any) => key);

    const result = component.approvalsDetail();
    expect(result).toEqual([]);
  });

  it('should return empty array when activeTab is CHECKER but otherApprovals has no groups', () => {
    const mockOtherApprovals = {
      status: 'Success',
      groups: undefined,
    } as any;

    jest.spyOn(component.myApprovalsResource, 'value').mockReturnValue(undefined);
    jest.spyOn(component.otherApprovalsResource, 'value').mockReturnValue(mockOtherApprovals);
    component.activeTab.set(component.ApprovalTypesEnum.CHECKER);
    jest.spyOn(component.translocoService, 'translate').mockImplementation((key: any) => key);

    const result = component.approvalsDetail();
    expect(result).toEqual([]);
  });

  it('should handle conditional logic with both approvals having data', () => {
    const mockMyApprovals = {
      status: 'Success',
      groups: [
        {
          groupId: 'TRANSFERS',
          groupName: 'Transfers',
          transactions: [],
        },
      ],
    } as any;

    const mockOtherApprovals = {
      status: 'Success',
      groups: [
        {
          groupId: 'PAYMENTS',
          groupName: 'Payments',
          transactions: [],
        },
      ],
    } as any;

    jest.spyOn(component.myApprovalsResource, 'value').mockReturnValue(mockMyApprovals);
    jest.spyOn(component.otherApprovalsResource, 'value').mockReturnValue(mockOtherApprovals);
    component.activeTab.set(component.ApprovalTypesEnum.MAKER);
    jest.spyOn(component.translocoService, 'translate').mockImplementation((key: any) => key);

    const result = component.approvalsDetail();
    expect(result).toHaveLength(1);
    expect(result[0].groupId).toBe('TRANSFERS');

    // Switch to CHECKER
    component.activeTab.set(component.ApprovalTypesEnum.CHECKER);
    const result2 = component.approvalsDetail();
    expect(result2).toHaveLength(1);
    expect(result2[0].groupId).toBe('PAYMENTS');
  });
});
