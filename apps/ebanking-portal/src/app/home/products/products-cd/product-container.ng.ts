import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Skeleton } from '@/core/components';
import { TranslocoDirective } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { Card } from '@scb/ui/card';
import { Icon } from '@scb/ui/icon';

@Component({
  selector: 'app-product-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card, Skeleton, TranslocoDirective, Icon, Button],
  template: `<div class="{{ 'gap-2xl grid ' + (!isEmpty() || loading() ? 'md:grid-cols-3' : '') }}">
    @if (loading()) {
      @for (item of [1, 2, 3]; track item) {
        <scb-card class="loading">
          <scb-skeleton
            width="15%"
            height="40px" />
          <scb-skeleton width="50%" />
          <scb-skeleton width="50%" />
          <scb-skeleton width="80%" />
          <scb-skeleton width="90%" />
          <scb-skeleton width="100%" />
        </scb-card>
      }
    } @else if (error()) {
      <div
        *transloco="let t; prefix: 'dashboard'"
        class="py-3xl sm:px-3xl col-span-12 flex w-full flex-col items-center justify-center gap-3 px-4 text-center"
        data-testid="accounts_div_errorState">
        <icon
          [name]="'api-failure'"
          class="text-3xl"
          data-testid="accounts_icon_apiFailure" />
        <h4
          class="head-2xs-s text-text-primary"
          data-testid="accounts_h4_apiError">
          {{ t('error.apiError') }}
        </h4>
        <p
          class="body-sm text-text-primary"
          data-testid="accounts_p_apiErrorDetail">
          {{ t('error.apiErrorDetail') }}
        </p>
        <button
          scbButton
          variant="ghost"
          size="sm"
          icon="refresh"
          (click)="reload.emit()"
          data-testid="accounts_button_reload">
          {{ t('error.reload') }}
        </button>
      </div>
    } @else if (isEmpty()) {
      <div
        *transloco="let t; prefix: 'products'"
        data-testid="PRODUCTS_EMPTY"
        class="emptyState flex w-full flex-col items-center justify-center text-center">
        <icon
          name="not-found"
          data-testid="PRODUCTS_EMPTY_ICON"
          class="text-3xl" />
        <h4
          data-testid="PRODUCTS_EMPTY_TITLE"
          class="mt-sm mb-sm mf-2xl font-semibold">
          {{ t('noProductFoundTitle') }}
        </h4>
        <p
          data-testid="PRODUCTS_EMPTY_SUBTITLE"
          class="text-text-tertiary text-sm-sm">
          {{ t('noProductFoundDesc') }}
        </p>
      </div>
    } @else {
      <ng-content />
    }
  </div>`,
})
export class ProductContainer {
  readonly loading = input.required<boolean>();
  readonly error = input();
  readonly isEmpty = input(false);
  readonly reload = output();
}
