import { booleanAttribute, ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { Icon } from '@scb/ui/icon';

@Component({
  selector: 'app-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `<img
      [src]="facade.isDarkTheme() ? 'logo-white.svg' : 'logo.svg'"
      alt="SCB logo"
      class="{{ 'h-full 2xl:block ' + (small() ? '!hidden' : 'hidden') }}" />
    <icon
      name="logo-sm"
      class="{{ 'h-full ' + (small() ? '' : '2xl:hidden') }}" />`,
  host: {
    class: 'block h-5xl',
  },
})
export class Logo {
  readonly facade = inject(LayoutFacadeService);
  readonly small = input(false, { transform: booleanAttribute });
}
