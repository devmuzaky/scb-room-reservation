import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { IconButton } from '@scb/ui/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-theme-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconButton, TooltipModule, TranslocoDirective],
  template: `<button
    *transloco="let t; prefix: 'dashboardLayout'"
    [scbIconButton]="layoutFacade.isDarkTheme() ? 'sun' : 'moon'"
    color="primary"
    data-testid="BTN_THEME_TOGGLE"
    [showDelay]="200"
    [autoHide]="true"
    [pTooltip]="this.layoutFacade.isDarkTheme() ? t('lightMode') : t('darkMode')"
    tooltipPosition="bottom"
    (click)="onChange()"></button>`,
})
export class ThemeButton {
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly translocoService = inject(TranslocoService);
  readonly checked = signal(this.layoutFacade.isDarkTheme());

  onChange() {
    const checked = !this.layoutFacade.isDarkTheme();
    if (checked) {
      this.letThereBeDark();
    } else {
      this.letThereBeLight();
    }
  }

  private letThereBeDark() {
    this.layoutFacade.changeTheme('dark');
  }

  private letThereBeLight() {
    this.layoutFacade.changeTheme('light');
  }
}
