import { HttpInterceptorFn, HttpParams } from '@angular/common/http';

/**
 * Interceptor to remove empty query parameters from HTTP requests
 */
export const cleanQueryParamsInterceptor: HttpInterceptorFn = (req, next) => {
  // Clean query params if present
  if (req.params.keys().length > 0) {
    const originalParams = req.params;
    let cleanedParams = new HttpParams();

    originalParams.keys().forEach(key => {
      const value = originalParams.get(key);
      if (value !== null && value !== undefined && value !== '') {
        cleanedParams = cleanedParams.set(key, value);
      }
    });

    req = req.clone({
      params: cleanedParams,
    });
  }

  // Clean empty fields from body if POST request and body is an object
  if (req.method === 'POST' && req.body && typeof req.body === 'object' && !Array.isArray(req.body)) {
    const cleanedBody: Record<string, any> = {};
    Object.keys(req.body).forEach(key => {
      const value = (req.body as Record<string, unknown>)[key];
      if (value !== null && value !== undefined && value !== '') {
        cleanedBody[key] = value;
      }
    });
    req = req.clone({
      body: cleanedBody,
    });
  }

  // Continue with the request
  return next(req);
};
