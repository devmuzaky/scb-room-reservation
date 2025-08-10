import { HttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTestTransloco } from '@/core/config/transloco.testing';
import { OverrideDownloadBtn } from '@/core/mocks/download.btn.mock';
import { httpFakeResponse } from '@/core/models/api';
import { AuthStore } from '@/core/store/auth-store';
import { fakeService, render, RenderResult } from '@scb/util/testing';
import { CreditCard } from './credit-card.ng';

const httpStub = fakeService(HttpClient, {
  request: httpFakeResponse({
    ccList: [
      {
        ccNumber: '524815******5806',
        holderName: 'TEST CARD 13',
        availableToUse: 50650.49,
        utilizedAmount: 0,
        dueAmount: 0,
        dueDate: '2023-05-26',
        currency: 'EGB',
      },
    ],
    pagination: {
      pageStart: 0,
      totalSize: 1,
      pageSize: 10,
      totalPages: 1,
    },
  }),
  get: jest.fn(),
});

const authStoreStub = fakeService(AuthStore, {
  user: signal({ username: '' }) as any,
});

describe('Credit Card Component', () => {
  let view: RenderResult<CreditCard>;

  beforeEach(async () => {
    view = await render(CreditCard, [provideTestTransloco(), provideRouter([]), httpStub, authStoreStub], {
      components: [OverrideDownloadBtn],
    });
  });

  it('should create', async () => {
    await view.whenStable();
    expect(view.host).toBeTruthy();
  });

  it('should handle the empty response also', async () => {
    httpStub.v.request = httpFakeResponse(undefined);
    await view.whenStable();
    expect(view.host.ccList()).toEqual([]);
    expect(view.host.totalRecords()).toEqual(0);
    expect(view.host.totalPages()).toEqual(0);
  });

  it('should get the download url', () => {
    const url = view.host.downloadOptions.url('pdf');
    expect(url).toContain('/pdf');
  });
});
