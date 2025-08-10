import { ChangeDetectionStrategy, Component, input, ResourceRef } from '@angular/core';
import { Skeleton } from '@/core/components';
import { TranslocoDirective } from '@jsverse/transloco';
import { Card } from '@scb/ui/card';
import { Icon } from '@scb/ui/icon';

@Component({
  selector: 'app-product-form-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card, Skeleton, Icon, TranslocoDirective],
  template: `@if (apiRef().isLoading()) {
      <scb-card>
        <scb-skeleton width="100px" />
        <scb-skeleton width="100px" />
        <scb-skeleton width="100px" />
      </scb-card>
      <scb-card>
        <scb-skeleton width="100px" />
        <scb-skeleton width="100px" />
        <scb-skeleton width="100px" />
        <scb-skeleton width="100px" />
        <scb-skeleton width="100px" />
        <scb-skeleton width="100px" />
      </scb-card>
    } @else if (apiRef().error()) {
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
          (click)="apiRef().reload()"
          data-testid="accounts_button_reload">
          {{ t('error.reload') }}
        </button>
      </div>
    } @else {
      <ng-content />
    }`,
})
export class ProductFormContainer {
  readonly apiRef = input.required<ResourceRef<any>>();
}
