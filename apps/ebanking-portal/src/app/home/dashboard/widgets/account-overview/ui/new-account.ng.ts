import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Card } from '@scb/ui/card';
import { Icon } from '@scb/ui/icon';

@Component({
  selector: 'app-new-account',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card, Icon],
  template: `<scb-card class="border-brand p-xl gap-lg flex flex-col items-center justify-center border border-dashed">
    <icon name="add-account" />
    <h4 class="body-md mf-md text-text-secondary">
      <ng-content />
    </h4>
  </scb-card>`,
  host: {
    class: '',
  },
})
export class NewAccount {}
