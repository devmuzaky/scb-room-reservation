import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { render, RenderResult } from '@scb/util/testing';
import { provideTestTransloco } from '../../../../../core/config/transloco.testing';
import { RouterMock } from '../../../../../core/mocks/router.mock';
import { Certificates } from '../../../model';
import { CertificatesTab } from './certificates-tab.ng';

describe('CertificatesTab', () => {
  let view: RenderResult<CertificatesTab>;
  let component: CertificatesTab;

  const mockCertificates: Certificates = {
    equivalentInEGP: 1000,
    certificatesList: [],
  };

  beforeEach(async () => {
    view = await render(CertificatesTab, [
      provideNoopAnimations(),
      provideTestTransloco(),
      provideHttpClient(),
      provideHttpClientTesting(),
      {
        provide: Router,
        useValue: RouterMock,
      },
    ]);
    component = view.host;

    view.fixture.componentRef.setInput('certificates', mockCertificates);
    view.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(view.host).toBeTruthy();
  });

  it('should require certificates as input', () => {
    expect(component.certificates()).toEqual(mockCertificates);
  });

  it('should have accountType set to "Certificates"', () => {
    expect(component.accountType).toBe('Certificates');
  });
});
