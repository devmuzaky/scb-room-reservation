import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ResourceStatus } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideTestTransloco } from '@/config/transloco.testing';
import { CHEQUE_OUT_EMPTY_DEDUCTED_MOCK, CHEQUE_OUT_MOCK, DEDUCTED_MOCK, RETURNED_MOCK } from '@/mocks/cheque-out.mock';
import { httpFakeResponse } from '@/models/api';
import { AuthStore } from '@/store/auth-store';
import { fakeService, render, RenderResult } from '@scb/util/testing';
import { ChequeOut } from './cheque-out';

const httpClientStub = fakeService(HttpClient, {
  request: httpFakeResponse({ lastUpdatedTimestamp: '12344', deductedCheques: [], returnedCheques: [] }),
});

describe('CHEQUE OUT', () => {
  let view: RenderResult<ChequeOut>;
  let component: ChequeOut;
  let authStoreMock: { user: jest.Mock };

  beforeEach(async () => {
    authStoreMock = {
      user: jest.fn(() => ({ username: '123' })),
    };

    view = await render(ChequeOut, [
      provideNoopAnimations(),
      provideTestTransloco(),
      provideRouter([]),
      httpClientStub,
      DatePipe,
      { provide: AuthStore, useValue: authStoreMock },
    ]);

    component = view.host;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create', async () => {
    expect(view.host).toBeTruthy();
  });

  it('should run through loader function', async () => {
    view.detectChanges();
    await view.sleep(1);

    expect(component.deductedList()).toBeDefined();
  });

  it('should return cheque out response with data', () => {
    jest.spyOn(component.list, 'value').mockReturnValue(CHEQUE_OUT_MOCK);

    expect(component.deductedList()).toEqual(DEDUCTED_MOCK);
    expect(component.returnedList()).toEqual(RETURNED_MOCK);
  });

  it('should return cheque out response with empty lists', () => {
    jest.spyOn(component.list, 'value').mockReturnValue(CHEQUE_OUT_EMPTY_DEDUCTED_MOCK);
    component.list.status();
    expect(component.deductedList()).toEqual([]);
    expect(component.returnedList()).toEqual([]);
  });

  it('should return cheque out response with undefined values', () => {
    jest.spyOn(component.list, 'value').mockReturnValue(undefined);
    component.list.status();
    expect(component.deductedList()).toBeUndefined();
    expect(component.returnedList()).toBeUndefined();
  });

  it('should return "loading" when status is Loading', () => {
    jest.spyOn(component.list, 'status').mockReturnValue(ResourceStatus.Loading);
    expect(component.status()).toBe('loading');
  });

  it('should return "loading" when status is Reloading', () => {
    jest.spyOn(component.list, 'status').mockReturnValue(ResourceStatus.Reloading);
    expect(component.status()).toBe('loading');
  });

  it('should return "error" when status is Error', () => {
    jest.spyOn(component.list, 'status').mockReturnValue(ResourceStatus.Error);
    expect(component.status()).toBe('error');
  });

  it('should return "default" when status is Error', () => {
    jest.spyOn(component.list, 'status').mockReturnValue(ResourceStatus.Idle);
    expect(component.status()).toBe('default');
  });
});
