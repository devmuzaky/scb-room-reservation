import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';

@Component({
  selector: 'app-select-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, TranslocoDirective],
  template: ` <button
      *transloco="let t; prefix: 'chequesIn'"
      scbButton
      size="sm"
      class="flex-1 whitespace-nowrap"
      (click)="apply.emit()"
      data-testid="accounts_button_resetFilter">
      {{ t('apply') }}
    </button>
    <button
      *transloco="let t"
      scbButton
      variant="secondary"
      size="sm"
      class="flex-1 whitespace-nowrap"
      (click)="resetValue.emit(); apply.emit()"
      data-testid="accounts_button_resetFilter">
      {{ t('reset') }}
    </button>`,
  host: {
    class: 'flex gap-3 border-t-1 border-border-tertiary px-2 py-3',
    'data-testid': 'accounts_div_currencySelectFooter',
  },
})
export class SelectFooter {
  readonly apply = output();
  readonly resetValue = output();
}
