import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import ar from '@angular/common/locales/ar';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';
import { AppConfigService } from '@/core/config/app-config.service';
import { providePrimeNGConfig } from '@/core/config/primeng.config';
import { provideTranslocoService } from '@/core/config/transloco.config';
import { AcceptLanguageInterceptor } from '@/core/http/accept-language.interceptor';
import { AuthorizationJWTInterceptor } from '@/core/http/authorization.interceptor';
import { cleanQueryParamsInterceptor } from '@/core/http/clean-query-params.interceptor';
import { provideCaptcha } from '@scb/ui/captcha';
import { registerPopover } from '@scb/ui/popover';
import { provideTooltipOptions } from '@scb/ui/tooltip';
import { MessageService } from 'primeng/api';
import { appRoutes } from './app.routes';

registerLocaleData(ar);
// Factory function for loading configuration
export function initializeApp() {
  const configService = inject(AppConfigService);
  // Initialize configuration asynchronously
  return configService.loadConfig();
}

export function siteKeyFn() {
  return inject(AppConfigService).config.siteKey;
}

export const AppConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideHttpClient(
      withInterceptors([cleanQueryParamsInterceptor, AcceptLanguageInterceptor, AuthorizationJWTInterceptor]),
    ),
    provideAppInitializer(initializeApp),
    provideCaptcha(siteKeyFn),
    providePrimeNGConfig(),
    provideTranslocoService(),
    provideTooltipOptions({ showDelay: 500 }),
    registerPopover(),
    provideExperimentalZonelessChangeDetection(),
    provideRouter(appRoutes, withPreloading(PreloadAllModules)),
    Title,
    MessageService,
  ],
};
