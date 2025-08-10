import { computed, inject, Injectable, linkedSignal, signal } from '@angular/core';
import { PRIMENG_I18N } from '@/core/config/primeng.i18n';
import { AppLanguage, LayoutStore } from '@/layout/layout-store';
import { TranslocoService } from '@jsverse/transloco';
import { injectDirectionality } from '@scb/ui/bidi';
import { breakpointObserver } from '@scb/ui/layout';
import { StorageService } from '@scb/util/storage';
import { ThemeMode, ThemeService } from '@scb/util/theme';
import { PrimeNG } from 'primeng/config';

const LANGUAGE_CONFIG: Record<AppLanguage, { dir: 'rtl' | 'ltr' }> = {
  ar: { dir: 'rtl' },
  en: { dir: 'ltr' },
};

@Injectable({ providedIn: 'root' })
export class LayoutFacadeService {
  private readonly theme = inject(ThemeService);
  private readonly primengConfig = inject(PrimeNG);
  private readonly translocoService = inject(TranslocoService);
  private readonly layoutStore = inject(LayoutStore);
  private readonly dir = injectDirectionality();

  readonly showBalances = signal(true);
  readonly canLeave = signal(true);

  readonly isLightTheme = computed(() => this.layoutStore.theme() === 'light');
  readonly isDarkTheme = computed(() => this.layoutStore.theme() === 'dark');
  readonly language = this.layoutStore.language;
  readonly isArabic = computed(() => this.language() === 'ar');
  readonly isEnglish = computed(() => this.language() === 'en');
  private readonly storage = inject(StorageService);

  readonly breakpoints = breakpointObserver();

  readonly bp = this.breakpoints.observe({ md: '(max-width: 1365px)' });
  readonly bpMobile = this.breakpoints.observe({ sm: '(max-width: 639px)' });
  private readonly bpMobileState = linkedSignal(this.bpMobile.state);
  private readonly state = linkedSignal(this.bp.state);
  readonly mode = linkedSignal({
    source: this.state,
    computation: value => (value.md ? 'over' : 'partial'),
  });
  readonly mobileMode = linkedSignal({
    source: this.bpMobileState,
    computation: value => (value.sm ? true : false),
  });
  readonly show = signal(this.mode() === 'partial');

  readonly iconMode = computed(() => this.mode() === 'partial' && !this.show());

  toggle() {
    this.show.set(!this.show());
  }

  itemClick() {
    if (this.mode() === 'over') {
      this.show.set(false);
    }
  }

  constructor() {
    this.changeTheme(this.theme.init());
    const savedLang: AppLanguage = this.storage.get('language') || 'en';
    this.setLanguage(savedLang);
  }

  changeTheme(mode: ThemeMode): void {
    this.theme.change(mode);
    this.layoutStore.setTheme(mode);
  }

  setLanguage(language: AppLanguage): void {
    this.translocoService.setActiveLang(language);
    this.primengConfig.setTranslation(PRIMENG_I18N[language]);
    this.layoutStore.setAppLanguage(language);
    this.dir.setDirection(LANGUAGE_CONFIG[language].dir === 'rtl');
    this.storage.set('language', language);
  }

  toggleBalances() {
    this.showBalances.update(value => !value);
  }

  setCanLeave(value: boolean) {
    this.canLeave.set(value);
  }

  getCanLeave(): boolean {
    return this.canLeave();
  }
}
