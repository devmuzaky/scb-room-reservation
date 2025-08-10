import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { AppConfigService } from '../config/app-config.service';

export const AcceptLanguageInterceptor: HttpInterceptorFn = (req, next) => {
  const layoutStore = inject(LayoutFacadeService);
  if (req.url.startsWith('/api')) {
    // we have to call here because the config service is not available
    // if the http call is made inside the config service, it will throw an error
    const { apiUrl } = inject(AppConfigService).config;
    req = req.clone({
      url: `${apiUrl}${req.url}`,
      headers: req.headers.set('Accept-Language', layoutStore.language().toUpperCase()),
    });
  }
  return next(req);
};
