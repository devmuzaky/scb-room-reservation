import { HttpClient, HttpInterceptorFn, HttpResponse, provideHttpClient, withInterceptors } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { of } from 'rxjs';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { fakeService, injectService } from '@scb/util/testing';
import { AppConfigService } from '../config/app-config.service';
import { AcceptLanguageInterceptor } from './accept-language.interceptor';

const fakeApiInterceptor: HttpInterceptorFn = (req, next) => {
  return of(new HttpResponse({ body: { url: req.url, lang: req.headers.get('Accept-Language') } }));
};

const layoutFacadeStub = fakeService(LayoutFacadeService, () => {
  const language = signal<'en' | 'ar'>('en');
  return {
    language,
    __: { language },
  };
});

const apiUrl = 'https://corp-dev.apps.scbocp.scb.local';
const configServiceStub = fakeService(AppConfigService, {
  config: {
    apiUrl,
    featureFlag: true,
    siteKey: '',
    mapAPIKey: '',
    idle: 1800,
    timeout: 30,
    keepalive: 900,
  },
});

@Injectable()
class FakeService {
  readonly http = inject(HttpClient);

  get(url: string) {
    return this.http.get<{ url: string; lang: string }>(url);
  }
}

describe('ApiPrefixInterceptor', () => {
  let service: FakeService;

  beforeEach(() => {
    service = injectService(FakeService, [
      provideHttpClient(withInterceptors([AcceptLanguageInterceptor, fakeApiInterceptor])) as any,
      FakeService,
      layoutFacadeStub,
      configServiceStub,
    ]);
  });

  it('should prefix the origin', () => {
    service.get('/api/auth').subscribe(res => {
      expect(res.url).toBe(`${apiUrl}/api/auth`);
      expect(res.lang).toBe('EN');
    });

    layoutFacadeStub._.language.set('ar');
    service.get('/api/auth').subscribe(res => {
      expect(res.url).toBe(`${apiUrl}/api/auth`);
      expect(res.lang).toBe('AR');
    });
  });

  it('should not prefix the origin if it is not api', () => {
    service.get('/assets/logo.svg').subscribe(res => {
      expect(res.url).toBe('/assets/logo.svg');
      expect(res.lang).toBeFalsy();
    });
  });
});
