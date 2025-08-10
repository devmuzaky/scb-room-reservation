import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { Card } from '@scb/ui/card';
import { Icon } from '@scb/ui/icon';

export type AccountBasicDetailWidgetStatus = 'empty' | 'loading' | 'error' | 'default';

@Component({
  selector: 'app-account-detail-widget',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Card, Button, CommonModule, TranslocoDirective, RouterModule],
  template: `
    <scb-card
      class="py-xl flex h-full flex-col rounded-4xl !px-0"
      *transloco="let t; prefix: 'dashboard'">
      <div class="px-xl relative h-full overflow-hidden">
        @if (status() === 'loading') {
          <ng-content select=".loading"></ng-content>
        } @else if (status() === 'empty') {
          <ng-content select=".emptyState"></ng-content>
        } @else if (status() === 'error') {
          <div class="flex w-full flex-col items-center justify-center gap-3 text-center">
            <icon
              [name]="'api-failure'"
              class="text-3xl" />
            <h4 class="head-2xs-s text-text-primary">{{ t('error.apiError') }}</h4>
            <p class="body-sm text-text-primary">{{ t('error.apiErrorDetail') }}</p>
            <button
              scbButton
              variant="ghost"
              size="sm"
              icon="refresh"
              (click)="reload.emit()">
              {{ t('error.reload') }}
            </button>
          </div>
        } @else {
          <ng-content />
        }
      </div>
    </scb-card>
  `,
  host: {
    class: 'block h-full',
  },
})
export class AccountBasicDetailWidget {
  readonly status = input<AccountBasicDetailWidgetStatus>('loading');
  readonly lastUpdated = input<string | null>();
  readonly verticalTitle = input(false);
  readonly reload = output();
}
