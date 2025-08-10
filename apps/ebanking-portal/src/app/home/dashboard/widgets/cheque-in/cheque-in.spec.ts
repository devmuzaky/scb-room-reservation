import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ResourceStatus, signal } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideTestTransloco } from '@/config/transloco.testing';
import { AppLanguage } from '@/layout/layout-store';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import {
  CHEQUE_IN_EMPTY_DEDUCTED_MOCK,
  CHEQUE_IN_MOCK,
  COLLECTED_MOCK,
  POSTDATED_MOCK,
  RETURNED_MOCK,
} from '@/mocks/cheque-in.mock';
import { apiStatus, httpFakeResponse } from '@/models/api';
import { AuthStore } from '@/store/auth-store';
import { fakeService, render, RenderResult } from '@scb/util/testing';
import { ChequeIn } from './cheque-in';

const httpClientStub = fakeService(HttpClient, {
  request: httpFakeResponse({ lastUpdatedTimestamp: '12344', deductedCheques: [], returnedCheques: [] }),
});

const MockLayoutFacadeService = fakeService(LayoutFacadeService, {
  isDarkTheme: signal(false),
  language: signal('en' as AppLanguage),
});

describe('CHEQUE IN', () => {
  let view: RenderResult<ChequeIn>;
  let component: ChequeIn;
  let authStoreMock: { user: jest.Mock };

  beforeEach(async () => {
    authStoreMock = {
      user: jest.fn(() => ({ username: '123' })),
    };

    view = await render(ChequeIn, [
      provideNoopAnimations(),
      provideTestTransloco(),
      provideRouter([]),
      httpClientStub,
      DatePipe,
      MockLayoutFacadeService,
      { provide: AuthStore, useValue: authStoreMock },
    ]);

    component = view.host;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create', () => {
    expect(view.host).toBeTruthy();
  });

  it('should run through loader function', async () => {
    view.detectChanges();
    await view.sleep(1);

    expect(component.collectedList()).toBeUndefined();
  });

  it('should check the dark theme property', () => {
    expect(component.darkMode()).toBe(false);
  });

  it('should return cheque out response with data', () => {
    jest.spyOn(component.list, 'value').mockReturnValue(CHEQUE_IN_MOCK);

    expect(component.collectedList()).toEqual(COLLECTED_MOCK);
    expect(component.returnedList()).toEqual(RETURNED_MOCK);
    expect(component.postDatedList()).toEqual(POSTDATED_MOCK);
  });

  it('should return cheque out response with empty lists', () => {
    jest.spyOn(component.list, 'value').mockReturnValue(CHEQUE_IN_EMPTY_DEDUCTED_MOCK);
    component.list.status();
    expect(component.collectedList()).toEqual([]);
    expect(component.returnedList()).toEqual([]);
    expect(component.postDatedList()).toEqual([]);
  });

  it('should return cheque out response with undefined values', () => {
    jest.spyOn(component.list, 'value').mockReturnValue(undefined);
    component.list.status();
    expect(component.collectedList()).toBeUndefined();
    expect(component.returnedList()).toBeUndefined();
    expect(component.postDatedList()).toBeUndefined();
  });

  it('should return "loading" when status is Loading', () => {
    const mockStatus = signal(ResourceStatus.Loading);
    (component as any).status = apiStatus(mockStatus);
    expect((component as any).status()).toBe('loading');
  });

  it('should return "loading" when status is Reloading', () => {
    jest.spyOn(component.list, 'status').mockReturnValue(ResourceStatus.Reloading);
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
});
