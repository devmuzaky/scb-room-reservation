import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-select-value',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` {{ placeholder() }}
    @if (len(); as l) {
      <div
        class="bg-info-tint px-md py-xs text-text-info mf-md rounded-4xl"
        data-testid="accounts_div_currencyValueCount">
        +{{ l }}
      </div>
    }`,
  host: {
    class: 'gap-md body-label-md-m flex items-center',
  },
})
export class SelectValue {
  readonly placeholder = input.required<string>();
  readonly len = input.required<number>();
}
