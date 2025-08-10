import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoPipe } from '@jsverse/transloco';
import { Icon } from '@scb/ui/icon';
import { List } from '@scb/ui/list';
import { Tooltip } from '@scb/ui/tooltip';

@Component({
  selector: 'app-layout-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Tooltip, Icon, List, TranslocoPipe, RouterLink],
  template: ` @if (active()) {
      <div
        class="{{
          'h-2xl bg-brand absolute mt-[10px] w-sm ltr:rounded-tr-sm ltr:rounded-br-sm rtl:rounded-tl-sm rtl:rounded-bl-sm ltr:transition-[left] rtl:transition-[right] ' +
            (layout.iconMode() ? 'rtl:-right-md ltr:-left-md' : 'rtl:-right-xl ltr:-left-xl')
        }}"></div>
    }
    @let n = name() | transloco;
    <a
      scbList
      class="{{
        'w-full transition-[padding] whitespace-nowrap ' +
          (layout.iconMode() ? 'ltr:pl-2xl rtl:pr-2xl ' : '') +
          (active() ? 'body-label-md-m! text-text-primary bg-sidenav-bg-active' : 'body-label-md! text-text-tertiary')
      }}"
      [scbTooltip]="layout.iconMode() ? n : ''"
      scbTooltipPosition="left"
      [attr.data-testid]="testId()"
      [routerLink]="href()"
      (click)="href() && layout.itemClick()">
      <icon
        [name]="iconName()"
        class="{{ 'w-2xl ' + (active() ? 'text-icon-brand' : '') }}" />
      @if (!layout.iconMode()) {
        {{ n }}
      }
    </a>`,
  host: {
    class: 'block relative',
  },
})
export class ShellItem {
  readonly layout = inject(LayoutFacadeService);
  readonly name = input.required<string>();
  readonly icon = input.required<string>();
  readonly activeIcon = input<string>();
  readonly testId = input('');
  readonly href = input<string>();
  readonly sideMenu = input('');
  readonly active = computed(() => this.sideMenu() && this.sideMenu() === this.href());
  readonly iconName = computed<string>(() => {
    return this.active() ? (this.activeIcon() as string) : this.icon();
  });
}
