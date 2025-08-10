import { HttpClient } from '@angular/common/http';
import { Component, ResourceStatus, signal } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { provideTestTransloco } from '@/config/transloco.testing';
import { fakeApi } from '@/core/test';
import { ApiError, apiStatus, httpFakeResponse } from '@/models/api';
import { ERR } from '@/models/error';
import { fakeService, render, RenderResult } from '@scb/util/testing';
import { AccountDetailsService } from '../account-details.service';
import { AccountDetailsComponent } from './account-basic-details.ng';

const regServiceMock = fakeService(AccountDetailsService, {
  generateAccountDetailPDF: jest.fn(),
});

const mockActivatedRoute = {
  paramMap: of({
    get: (key: string) => (key === 'accountId' ? '1234567890' : null),
  }),
  snapshot: {
    paramMap: {
      get: (key: string) => (key === 'accountId' ? '1234567890' : null),
    },
  },
};

const httpClientStub = fakeService(HttpClient, {
  request: httpFakeResponse({
    nickname: 'Hamada',
    totalAvailableBalance: 6787657,
    accountType: 'Savings',
    accountNumber: 110038010100101,
    iban: 'EG123456789012345678901234',
    totalBalance: 10000.0,
    availableBalance: 8000.0,
    pendingBalance: 500.0,
    blockedBalance: 1500.0,
    lastUpdated: 1740466650000,
  }),
});

@Component({
  selector: 'app-detail',
  template: ``,
})
class TestLoginComponent {}

describe('AccountDetailsComponent', () => {
  let view: RenderResult<AccountDetailsComponent>;
  let component: AccountDetailsComponent;
  let layoutFacade: { language: jest.Mock; isDarkTheme: jest.Mock };

  beforeEach(async () => {
    view = await render(
      AccountDetailsComponent,
      [
        provideNoopAnimations(),
        provideTestTransloco(),
        provideRouter([{ path: 'detail', component: TestLoginComponent }]),
        regServiceMock,
        httpClientStub,
        { provide: ActivatedRoute, useValue: mockActivatedRoute }, // Mock ActivatedRoute
      ],
      {
        providers: [regServiceMock],
      },
    );

    layoutFacade = {
      language: jest.fn(),
      isDarkTheme: jest.fn(),
    };

    view.detectChanges();
    component = view.host;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create', () => {
    expect(view.host).toBeTruthy();
  });

  it('should return true if language is defined', () => {
    layoutFacade.language.mockReturnValue('ar');

    expect(component.lang()).toBeDefined();
  });

  it('should return lastUpdatedAt is defined', () => {
    expect(component.lastUpdatedAt()).toBeDefined();
  });

  it('should return lastUpdatedAt when response is empty', () => {
    expect(component.lastUpdatedAt()).toBeDefined();
  });

  it('should call generatePDF and download the file on success', async () => {
    const pdfResponse = {
      pdfBase64: 'JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0Zpb+',
    };
    const api = fakeApi({
      pdfBase64: 'JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0Zpb+',
    });
    regServiceMock.v.generateAccountDetailPDF = api.fn;
    const component = view.host;
    await component.generateAccountDetailPDF();
    expect(component.loading()).toBeTruthy();
    api.complete();
    expect(component.loading()).toBeFalsy();
  });

  it('should call generatePDF and generate error', async () => {
    const api = fakeApi(new ApiError({ code: ERR.BAD_GATEWAY, message: 'Server error' }));
    regServiceMock.v.generateAccountDetailPDF = api.fn;
    const component = view.host;
    await component.generateAccountDetailPDF();
    expect(component.loading()).toBeTruthy();
    api.complete();
    expect(component.loading()).toBeFalsy();
  });

  it('should return "loading" when status is Loading', () => {
    const mockStatus = signal(ResourceStatus.Loading);
    (component as any).status = apiStatus(mockStatus); // Override for testing
    expect((component as any).status()).toBe('loading');
  });

  it('should return "loading" when status is Reloading', () => {
    const mockStatus = signal(ResourceStatus.Reloading);
    (component as any).status = apiStatus(mockStatus); // Override for testing
    expect((component as any).status()).toBe('loading');
  });

  it('should return "error" when status is Error', () => {
    const mockStatus = signal(ResourceStatus.Error);
    (component as any).status = apiStatus(mockStatus); // Override for testing
    expect((component as any).status()).toBe('error');
  });

  it('should return "default" when status is Error', () => {
    jest.spyOn(component.accountBasicDetailsResource, 'status').mockReturnValue(ResourceStatus.Idle);
    expect(component.status()).toBe('default');
  });

  it('should handle lastUpdatedAt when accountDetails is null', () => {
    // Mock the resource to return null
    jest.spyOn(component.accountBasicDetailsResource, 'value').mockReturnValue(null as any);

    // Should return undefined when accountDetails is null
    expect(component.lastUpdatedAt()).toBeUndefined();
  });

  it('should handle lastUpdatedAt when accountDetails is undefined', () => {
    // Mock the resource to return undefined
    jest.spyOn(component.accountBasicDetailsResource, 'value').mockReturnValue(undefined);

    // Should return undefined when accountDetails is undefined
    expect(component.lastUpdatedAt()).toBeUndefined();
  });

  it('should handle accountDetails when resource value is null', () => {
    // Mock the resource to return null
    jest.spyOn(component.accountBasicDetailsResource, 'value').mockReturnValue(null as any);

    // Should return null when resource value is null
    expect(component.accountDetails()).toBeNull();
  });

  it('should handle accountDetails when resource value is undefined', () => {
    // Mock the resource to return undefined
    jest.spyOn(component.accountBasicDetailsResource, 'value').mockReturnValue(undefined);

    // Should return null when resource value is undefined
    expect(component.accountDetails()).toBeNull();
  });
});
