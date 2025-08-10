import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { Card } from '@scb/ui/card';
import { Icon } from '@scb/ui/icon';

@Component({
  selector: 'app-quick-action',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card, Icon, TranslocoDirective, RouterLink],
  template: `<scb-card
    class="p-xl gap-lg col-span-4 col-start-9 row-span-2 row-start-1 h-full rounded-4xl"
    *transloco="let t">
    <h4 class="head-xs-s mb-lg">{{ t('quickAction.quickAction') }}</h4>
    <div class="flex justify-between">
      <div
        routerLink="/transfer"
        class="gap-md justify-centertext-center flex w-[50px] cursor-pointer flex-col items-center sm:w-auto 2xl:w-[50px]">
        <icon name="instant-transfer" />
        <p class="body-sm">{{ t('quickAction.instantTransfer') }}</p>
      </div>
      <div
        routerLink="/chequebook/new-chequebook"
        class="gap-md flex w-[50px] cursor-pointer flex-col items-center justify-center text-center sm:w-auto 2xl:w-[50px]">
        <icon name="cheque-request" />
        <p class="body-sm">{{ t('quickAction.chequeRequest') }}</p>
      </div>
      <div
        routerLink="/products/accounts"
        class="gap-md flex w-[50px] cursor-pointer flex-col items-center justify-center text-center sm:w-auto 2xl:w-[50px]">
        <icon name="gov-payment" />
        <p class="body-sm">{{ t('quickAction.govPayment') }}</p>
      </div>
      <div
        routerLink="/products/time-deposits"
        class="gap-md flex w-[50px] cursor-pointer flex-col items-center justify-center text-center sm:w-auto 2xl:w-[50px]">
        <icon name="bulk-payments" />
        <p class="body-sm">{{ t('quickAction.timeDeposits') }}</p>
      </div>
    </div>
  </scb-card>`,
})
export class QuickAction {}
