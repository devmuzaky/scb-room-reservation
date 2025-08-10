import { Observable, Subject } from 'rxjs';
import { RenderResult } from '@scb/util/testing';
import { ApiError, ApiResult } from '../models/api';

type ExtractGeneric<T> = T extends ApiResult<infer U> | ApiError<infer U> ? U : never;

type ApiResponse<T> =
  T extends ApiError<any>
    ? Observable<ApiResult<any>>
    : T extends ApiResult<any>
      ? Observable<ApiResult<ExtractGeneric<T>>>
      : never;

export function fakeApi<T extends ApiResult<any> | ApiError<any>>(data: T) {
  const sub = new Subject<ApiResult<T extends ApiError<any> ? any : ExtractGeneric<T>>>();
  return {
    fn: () => sub.asObservable() as ApiResponse<T>,
    complete: () => (data instanceof ApiError ? sub.error(data) : sub.next(data as any)),
  };
}

export function automationTestIds<T>(view: () => RenderResult<any>, data: Record<string, string>) {
  describe('Accessibility and Unique ID', () => {
    for (const id in data) {
      it(data[id], () => {
        const el = view().$(`.${id}`);
        expect(el).toBeTruthy();
      });
    }
  });
}
