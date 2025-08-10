import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { AppLanguage } from '@/layout/layout-store';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { Button, ButtonSize } from '@scb/ui/button';
import { Icon } from '@scb/ui/icon';

@Component({
  selector: 'app-lang-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Button],
  template: `<button
    scbButton
    variant="ghost"
    [size]="size()"
    [dir]="dir()"
    (click)="toggleLang()"
    class="gap-sm flex items-center">
    <icon name="globe" />
    {{ label() }}
  </button>`,
})
export class LangButton {
  private readonly layoutFacade = inject(LayoutFacadeService);
  readonly label = computed(() => (this.layoutFacade.language() === 'en' ? 'عربي' : 'EN'));
  readonly dir = computed(() => (this.layoutFacade.language() !== 'ar' ? 'rtl' : 'ltr'));

  readonly size = input<ButtonSize>('lg');

  toggleLang(): void {
    const lang: AppLanguage = this.layoutFacade.language() === 'en' ? 'ar' : 'en';
    this.layoutFacade.setLanguage(lang);
  }
}
