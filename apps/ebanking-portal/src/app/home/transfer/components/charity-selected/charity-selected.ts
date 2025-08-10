import { Component, input } from '@angular/core';
import { Icon } from '@scb/ui/icon';
import { CharityTransferDto } from '../../model';

@Component({
  selector: 'app-charity-selected-view',
  template: `
    <div class="gap-lg flex flex-1 items-center">
      <div class="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
        <icon
          [name]="customerId() || 'building'"
          class="text-primary h-6 w-6" />
      </div>
      <div class="gap-sm flex flex-1 flex-col">
        <div class="head-xs-s truncate-force">{{ charity().charityName }}</div>
        <div class="text-text-secondary head-xs-s truncate-force body-md">{{ charity().charityType }}</div>
      </div>
    </div>
  `,
  imports: [Icon],
  host: {
    class: 'border-border-secondary p-xl flex flex-1 rounded-lg border',
  },
})
export class CharitySelectedView {
  readonly charity = input.required<CharityTransferDto>();
  readonly customerId = input<string>();
}
