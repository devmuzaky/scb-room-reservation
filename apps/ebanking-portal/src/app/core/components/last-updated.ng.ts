import { DatePipe } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { lastUpdateProcess } from '../utils/utils';

@Component({
  selector: 'app-last-updated',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe],
  imports: [TranslocoPipe, Button],
  template: `<p
      class="body-sm text-text-tertiary"
      data-testid="CHEQUE_IN_LIST_LAST_UPDATED">
      {{ 'lastUpdatedAt' | transloco }}: {{ lastUpdatedAt() }}
    </p>
    @if (!noRefresh()) {
      <button
        scbButton
        variant="ghost"
        size="md"
        data-testid="DATA_REFRESH"
        (click)="refresh.emit()"
        icon="refresh"></button>
    }`,
  host: {
    '[class]': `'items-center gap-md ' + (!mobileVisible() ? 'hidden sm:flex' : 'flex')`,
  },
})
export class LastUpdated {
  readonly date = input.required<number | string | undefined>();
  readonly refresh = output();
  readonly lastUpdatedAt = lastUpdateProcess(this.date);
  readonly noRefresh = input(false, { transform: booleanAttribute });
  readonly mobileVisible = input(false, { transform: booleanAttribute });
}
