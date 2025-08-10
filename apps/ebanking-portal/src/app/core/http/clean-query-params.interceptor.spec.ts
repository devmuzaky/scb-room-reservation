import {
  HttpClient,
  HttpInterceptorFn,
  HttpParams,
  HttpResponse,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { of } from 'rxjs';
import { injectService } from '@scb/util/testing';
import { cleanQueryParamsInterceptor } from './clean-query-params.interceptor';

const fakeInterceptor: HttpInterceptorFn = (req, next) => {
  return of(new HttpResponse({ body: { url: req.url, params: req.params, method: req.method, body: req.body } }));
};

@Injectable()
class TestService {
  readonly http = inject(HttpClient);

  get(url: string, params: Record<string, string | null | undefined>) {
    let httpParams = new HttpParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        httpParams = httpParams.set(key, value ?? '');
      }
    });

    return this.http.get<{ url: string; params: HttpParams }>(url, { params: httpParams });
  }

  post(url: string, body: any, params: Record<string, string | null | undefined>) {
    let httpParams = new HttpParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        httpParams = httpParams.set(key, value ?? '');
      }
    });

    return this.http.post<{ url: string; params: HttpParams; method: string; body: any }>(url, body, {
      params: httpParams,
    });
  }
}

describe('CleanQueryParamsInterceptor', () => {
  let service: TestService;

  beforeEach(() => {
    service = injectService(TestService, [
      provideHttpClient(withInterceptors([cleanQueryParamsInterceptor, fakeInterceptor])) as any,
      TestService,
    ]);
  });

  it('should remove empty, null, and undefined query parameters', () => {
    service
      .get('/api/test', {
        name: 'John',
        empty: '',
        nullValue: null,
        zero: '0',
        undefinedValue: undefined,
        falseValue: 'false',
      })
      .subscribe(res => {
        expect(res.params.has('name')).toBeTruthy();
        expect(res.params.get('name')).toBe('John');

        expect(res.params.has('empty')).toBeFalsy();
        expect(res.params.has('nullValue')).toBeFalsy();

        expect(res.params.has('zero')).toBeTruthy();
        expect(res.params.get('zero')).toBe('0');

        expect(res.params.has('undefinedValue')).toBeFalsy();

        expect(res.params.has('falseValue')).toBeTruthy();
        expect(res.params.get('falseValue')).toBe('false');
      });
  });

  it('should not modify requests without query parameters', () => {
    service.get('/api/test', {}).subscribe(res => {
      expect(res.params.keys().length).toBe(0);
    });
  });

  describe('POST requests', () => {
    it('should remove empty, null, and undefined query parameters in POST requests', () => {
      const testBody = { data: 'test data' };

      service
        .post('/api/test', testBody, {
          name: 'John',
          empty: '',
          nullValue: null,
          zero: '0',
          undefinedValue: undefined,
          falseValue: 'false',
        })
        .subscribe(res => {
          expect(res.method).toBe('POST');
          expect(res.body).toEqual(testBody);

          expect(res.params.has('name')).toBeTruthy();
          expect(res.params.get('name')).toBe('John');

          expect(res.params.has('empty')).toBeFalsy();
          expect(res.params.has('nullValue')).toBeFalsy();

          expect(res.params.has('zero')).toBeTruthy();
          expect(res.params.get('zero')).toBe('0');

          expect(res.params.has('undefinedValue')).toBeFalsy();

          expect(res.params.has('falseValue')).toBeTruthy();
          expect(res.params.get('falseValue')).toBe('false');
        });
    });

    it('should not modify POST requests without query parameters', () => {
      const testBody = { data: 'test data' };

      service.post('/api/test', testBody, {}).subscribe(res => {
        expect(res.method).toBe('POST');
        expect(res.body).toEqual(testBody);
        expect(res.params.keys().length).toBe(0);
      });
    });

    it('should remove all parameters in POST request if all are empty string or null', () => {
      const testBody = { data: 'test data' };

      service
        .post('/api/test', testBody, {
          emptyParam: '',
          nullParam: null,
          anotherEmpty: '',
          anotherNull: null,
        })
        .subscribe(res => {
          expect(res.method).toBe('POST');
          expect(res.body).toEqual(testBody);
          expect(res.params.keys().length).toBe(0);
          expect(res.params.has('emptyParam')).toBeFalsy();
          expect(res.params.has('nullParam')).toBeFalsy();
          expect(res.params.has('anotherEmpty')).toBeFalsy();
          expect(res.params.has('anotherNull')).toBeFalsy();
        });
    });
  });
});
