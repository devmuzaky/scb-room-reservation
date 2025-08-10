import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Icon } from '@scb/ui/icon';

@Component({
  selector: 'round-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    <icon
      [name]="icon()"
      class="text-text-brand h-full w-full"></icon>
  `,
  host: {
    class:
      'h-4xl w-4xl flex-shrink-0 rounded-full bg-bg-info-tint inline-flex items-center justify-center p-[6.5px] text-brand',
  },
})
export class RoundIcon {
  readonly icon = input.required<string>();
}
