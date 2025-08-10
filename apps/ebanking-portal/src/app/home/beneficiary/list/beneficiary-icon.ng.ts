import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Icon } from '@scb/ui/icon';
import { PAYMENT_METHODS_OUTSIDE } from '../models/constants';
import { TransactionMethod } from '../models/models';

@Component({
  selector: 'beneficiary-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    <icon
      [name]="icon()"
      class="text-text-brand h-4xl w-4xl"></icon>
  `,
  host: {
    class: 'h-14 w-14 flex-shrink-0 rounded-full bg-gray-100 inline-flex items-center justify-center p-lg',
  },
})
export class BeneficiaryIcon {
  readonly tMethod = input<TransactionMethod>();

  readonly icon = computed(() => {
    const icon = PAYMENT_METHODS_OUTSIDE.find(item => item.id === this.tMethod())?.icon;
    return icon || 'bank';
  });
}
