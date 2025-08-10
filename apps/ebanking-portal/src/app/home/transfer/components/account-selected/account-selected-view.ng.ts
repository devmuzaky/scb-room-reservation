import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Icon } from '@scb/ui/icon';

@Component({
  selector: 'app-account-selected-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `<div class="gap-lg flex flex-1 items-center">
    <div class="bg-icon-container-blue h-12 w-12 rounded-full">
      <icon
        name="bank"
        class="h-4xl text-text-brand m-2 w-4xl rounded-full"></icon>
    </div>
    <div class="flex flex-1 flex-col">
      <div class="mf-md line-clamp-1 font-semibold">{{ nickname() }}</div>
      <div class="text-text-secondary mf-md">{{ accountNumber() }}</div>
    </div>
  </div>`,
  host: {
    class: 'border-border-secondary p-xl flex flex-1 rounded-lg border',
  },
})
export class AccountSelectedView {
  readonly nickname = input.required<string>();
  readonly accountNumber = input.required<string | number>();
}
