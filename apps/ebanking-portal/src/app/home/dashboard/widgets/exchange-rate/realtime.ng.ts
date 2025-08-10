import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { Avatar } from '@scb/ui/avatar';
import { Icon } from '@scb/ui/icon';
import { Separator } from '@scb/ui/separator';
import { Tooltip } from '@scb/ui/tooltip';
import { ExchangeRateService } from './exchange-rate.service';

@Component({
  selector: 'app-real-time',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Avatar, Icon, Separator, Tooltip, NgClass, TranslocoDirective],
  template: `<div class="gap-md flex flex-col">
    @for (item of rates(); track item) {
      <div
        class="gap-sm flex"
        *transloco="let t">
        <div class="gap-md flex flex-1 items-center">
          <scb-avatar
            [src]="item.flagSrc"
            class="!h-2xl !w-2xl flex-none" />
          <div>
            <h4
              class="body-label-md-m"
              data-testid="ERATE_TXT_REALTIME_CURRENCY_NAME">
              {{ item.currencyName }}
            </h4>
            <p
              class="body-sm text-text-tertiary"
              data-testid="ERATE_TXT_REALTIME_CURRENCY_DESC">
              {{ t('exchangeRate.currency.' + item.currencyName) }}
            </p>
          </div>
        </div>
        <div class="gap-md line-clamp-1 flex items-center">
          <p
            class="body-label-md-m"
            data-testid="ERATE_TXT_REALTIME_CURRENCY_RATE">
            {{ item.rate }}
          </p>
          <icon
            class="w-[14px]"
            [scbTooltip]="t('exchangeRate.trendTooltip')"
            [name]="item.trend === 'up' ? 'arrow-up' : 'linear-arrow-down'"
            [ngClass]="item.trend === 'up' ? 'text-icon-success' : 'text-icon-danger'"
            data-testid="ERATE_TXT_REALTIME_CURRENCY_TREND" />
        </div>
      </div>
      @if (!$last) {
        <scb-separator class="border-border-tertiary !my-0" />
      }
    }
  </div>`,
})
export class RealTime {
  readonly erService = inject(ExchangeRateService);
  readonly rates = computed(() => {
    const rates = this.erService.rates();
    // we have to skip the first value because it is EGP
    return rates.slice(1, 4).map(x => ({ ...x, rate: (1 / x.buy).toFixed(4) }));
  });
}
