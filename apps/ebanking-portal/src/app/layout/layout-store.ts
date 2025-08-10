import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { ThemeMode } from '@scb/util/theme';

export type AppLanguage = 'ar' | 'en';

export type LayoutInterface = {
  theme: ThemeMode;
  language: AppLanguage;
};

export const initialLangState: LayoutInterface = {
  theme: 'dark' as ThemeMode,
  language: 'en',
};

export const LayoutStore = signalStore(
  // provide the store in root service
  { providedIn: 'root' },
  withState(initialLangState),

  withComputed(store => ({
    isArabic: computed(() => store.language() === 'ar'),
  })),
  withMethods(store => ({
    // Change theme by calling this method
    setTheme(theme: ThemeMode) {
      patchState(store, () => ({ theme }));
    },
    // Change language by calling this method
    setAppLanguage(language: AppLanguage) {
      patchState(store, () => ({ language }));
    },
  })),
);
