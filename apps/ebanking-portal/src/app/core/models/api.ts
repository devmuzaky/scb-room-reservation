import { HttpErrorResponse, HttpEvent, HttpEventType, HttpRequest } from '@angular/common/http';
import { computed, ResourceStatus, Signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { ERR } from './error';

export type ApiResult<T> = T;

interface ErrorDetail {
  field: string;
  message: string;
}

export interface ErrorResult {
  errorId?: string;
  message: string;
  code: ERR;
  errors?: ErrorDetail[];
  details?: ErrorDetails;
  status?: number;
}

export interface ErrorDetails {
  hoursRemaining?: string;
}

export class ApiError<T = ErrorResult> extends HttpErrorResponse {
  constructor(public override error: T extends never ? ErrorResult : ErrorResult & T) {
    super({ error });
  }
}

export function httpFakeResponse<T>(
  body: T,
  error = false,
  data?: { cond: (req: HttpRequest<any>) => boolean; body: T }[],
): any {
  return (req: HttpRequest<any>) => {
    const bData = data?.find(x => x.cond(req))?.body || body;
    const value = { type: HttpEventType.Response, body: bData } as HttpEvent<T>;
    return error ? throwError(() => value) : of(value);
  };
}

export function handleParams(obj: Record<string, any>) {
  const newObj = {} as Record<string, any>;
  for (const o in obj) {
    if (obj[o] !== undefined && (typeof obj[o] !== 'string' || obj[o])) {
      // if is an array then we have to join them
      if (Array.isArray(obj[o])) {
        if (obj[o].length) {
          newObj[o] = obj[o].join(',');
        }
      } else {
        newObj[o] = obj[o];
      }
    }
  }
  return newObj;
}

export function queryParamsString(obj: Record<string, any>) {
  return new URLSearchParams(handleParams(obj)).toString();
}

export function apiStatus(status: Signal<ResourceStatus>) {
  return computed(() => {
    switch (status()) {
      case ResourceStatus.Loading:
      case ResourceStatus.Reloading:
        return 'loading';
      case ResourceStatus.Error:
        return 'error';
      default:
        return 'default';
    }
  });
}

export interface Pagination {
  pageStart: number;
  totalSize: number;
  pageSize: number;
  totalPages: number;
}
