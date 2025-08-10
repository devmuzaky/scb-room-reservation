import { HttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { provideTestTransloco } from '@/core/config/transloco.testing';
import { OverrideDownloadBtn } from '@/core/mocks/download.btn.mock';
import { RouterMock } from '@/core/mocks/router.mock';
import { httpFakeResponse } from '@/core/models/api';
import { AuthStore } from '@/core/store/auth-store';
import { AppLanguage } from '@/layout/layout-store';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { fakeService, render, RenderResult } from '@scb/util/testing';
import { Lcs } from './lcs.ng';

const activatedRouteStub = {
  snapshot: {
    paramMap: {
      get: jest.fn().mockReturnValue('lcNumber'),
    },
  },
};

const authStoreStub = fakeService(AuthStore, {
  user: signal({ username: '' }) as any,
});

const layoutFacadeStub = fakeService(LayoutFacadeService, {
  language: signal<AppLanguage>('en'),
  mobileMode: signal(false),
});

describe('Lcs Component', () => {
  let view: RenderResult<Lcs>;
  const httpStub = fakeService(HttpClient, {
    request: httpFakeResponse(undefined, false, [
      {
        cond: req => req.url.includes('dashboard/facilities-overview/lc'),
        body: {
          data: [
            {
              lcNumber: 'TF0935507217',
              cashCover: '307448.31',
              maturityDate: 2240517600000,
              lcType: 'LIDC',
              lcAmount: '307448.31',
              currency: 'USD',
              cashCoverPercentage: '100',
              outstandingBalance: '0',
            },
            {
              lcNumber: 'TF1314637240',
              cashCover: '26479700',
              maturityDate: 2240517600000,
              lcType: 'LIDC',
              lcAmount: '26479700',
              currency: 'JPY',
              cashCoverPercentage: '100',
              outstandingBalance: '0',
            },
          ],
          pagination: {
            pageStart: 0,
            pageSize: 10,
            totalSize: 52,
            totalPages: 26,
          },
        },
      },
      {
        cond: req => req.url.includes('dashboard/lookup/static-data'),
        body: { lcTypes: [] },
      },
    ]),
    get: jest.fn(),
  });

  beforeEach(async () => {
    view = await render(
      Lcs,
      [
        provideTestTransloco(),
        httpStub,
        layoutFacadeStub,
        {
          provide: Router,
          useValue: RouterMock,
        },
        authStoreStub,
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
      { components: [OverrideDownloadBtn] },
    );
  });

  it('should create', async () => {
    await view.whenStable();
    expect(view.host).toBeTruthy();
  });

  it('should get the download url', () => {
    const url = view.host.downloadOptions.url('pdf');
    expect(url).toContain('/pdf');
  });

  it('should navigate to details', () => {
    const lcNumber = 'TF0935507217';

    view.host.navigateToDetails(lcNumber);

    expect(RouterMock.navigate).toHaveBeenCalledWith(['/dashboard/lcs-details', lcNumber]);
  });
});

describe('computed properties with fallback values', () => {
  let view: RenderResult<Lcs>;

  const httpStubUndefined = fakeService(HttpClient, {
    request: httpFakeResponse(undefined, false, [
      {
        cond: req => req.url.includes('dashboard/lookup/static-data'),
        body: undefined,
      },
    ]),
    get: jest.fn(),
  });
  beforeEach(async () => {
    view = await render(
      Lcs,
      [
        provideTestTransloco(),
        httpStubUndefined,
        layoutFacadeStub,
        {
          provide: Router,
          useValue: RouterMock,
        },
        authStoreStub,
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
      { components: [OverrideDownloadBtn] },
    );
  });

  it('should handle lcTypeList, totalRecords, totalPages, lcsList, isEmpty when API returns undefined', async () => {
    expect(view.host.lcTypeList()).toEqual([]);
    expect(view.host.totalRecords()).toBe(0);
    expect(view.host.totalPages()).toBe(0);
    expect(view.host.lcsList()).toEqual([]);
    expect(view.host.isEmpty()).toBe(true);
  });
});
