import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, ResourceStatus, signal } from '@angular/core';
import { Skeleton } from '@/core/components';
import { lastUpdateProcess } from '@/utils/utils';
import { TranslocoDirective } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { Selectable, SelectableItem } from '@scb/ui/selectable';
import { DashboardWidget } from '../../dashboard-widget/dashboard-widget.ng';
import { CurrencyConverter } from './currency-converter.ng';
import { ExchangeRateService } from './exchange-rate.service';
import { RealTime } from './realtime.ng';

@Component({
  selector: 'app-exchange-rate',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ExchangeRateService, DatePipe],
  imports: [
    DashboardWidget,
    Skeleton,
    Selectable,
    SelectableItem,
    Button,
    RealTime,
    CurrencyConverter,
    TranslocoDirective,
  ],
  template: `<dashboard-widget
    class="h-full min-h-[342px]"
    [status]="status()"
    [verticalTitle]="true"
    (reload)="erService.reload()"
    *transloco="let t">
    <div class="title">{{ t('exchangeRate.title') }}</div>

    <p class="lastUpdated text-text-tertiary body-sm">{{ t('lastUpdatedAt') }} {{ lastUpdated() }}</p>

    <div class="loading">
      <scb-skeleton
        width="15%"
        height="40px" />
      <scb-skeleton width="50%" />
      <scb-skeleton width="50%" />
      <scb-skeleton width="80%" />
      <scb-skeleton width="90%" />
      <scb-skeleton width="100%" />
      <scb-skeleton width="100%" />
    </div>

    <button
      scbButton
      variant="ghost"
      size="md"
      icon="refresh"
      class="showReload"
      data-testid="ERATE_BTN_RELOAD"
      (click)="erService.reload()"></button>
    @if (status() === 'default') {
      <div class="gap-lg flex flex-col">
        <scb-selectable
          [(activeIndex)]="activeIndex"
          size="sm">
          <scb-selectable-item
            value="realTime"
            data-testid="ERATE_TAB_BTN_REALTIME">
            {{ t('exchangeRate.realTime') }}
          </scb-selectable-item>
          <scb-selectable-item
            value="currencyConverter"
            data-testid="ERATE_TAB_BTN_CURRENCY_CONVERTER">
            {{ t('exchangeRate.currencyConverter') }}
          </scb-selectable-item>
        </scb-selectable>
        @if (activeIndex() === 'realTime') {
          <app-real-time />
          <!--            Todo: temp hidden-->
          <button
            size="sm"
            class="mb-0.5 hidden"
            data-testid="ERATE_BTN_SEE_ALL">
            {{ t('seeAll') }}
          </button>
        } @else {
          <app-currency-converter />
        }
      </div>
    }
  </dashboard-widget>`,
})
export class ExchangeRate {
  readonly erService = inject(ExchangeRateService);
  readonly activeIndex = signal<'realTime' | 'currencyConverter'>('realTime');
  readonly lastUpdated = lastUpdateProcess(() => this.erService.value()?.lastUpdated);

  readonly status = computed(() => {
    switch (this.erService.status()) {
      case ResourceStatus.Loading:
      case ResourceStatus.Reloading:
        return 'loading';
      case ResourceStatus.Error:
        return 'error';
      default:
        return 'default';
    }
  });
}
