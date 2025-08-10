import { importProvidersFrom } from '@angular/core';
import { TranslocoTestingModule, TranslocoTestingOptions } from '@jsverse/transloco';
import ar from '../../../../public/i18n/ar.json';
import en from '../../../../public/i18n/en.json';

export function provideTestTransloco(options: TranslocoTestingOptions = {}) {
  return importProvidersFrom(
    TranslocoTestingModule.forRoot({
      langs: { en, ar },
      translocoConfig: {
        availableLangs: ['en', 'es'],
        defaultLang: 'en',
      },
      preloadLangs: true,
      ...options,
    }),
  );
}
