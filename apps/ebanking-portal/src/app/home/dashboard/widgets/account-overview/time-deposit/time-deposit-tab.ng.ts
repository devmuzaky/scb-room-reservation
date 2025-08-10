import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RolePermissionDirective } from '@/core/directives/role-permission.directive';
import { TranslocoPipe } from '@jsverse/transloco';
import { Carousel, CarouselItem, CarouselSteps } from '@scb/ui/carousel';
import { Deposits } from '../../../model';
import { BalanceCardComponent } from '../../../ui/balance-card/balance-card.component';
import { Banner } from '../ui/banner.ng';
import { NewAccount } from '../ui/new-account.ng';

@Component({
  selector: 'app-time-deposits-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BalanceCardComponent,
    NewAccount,
    Carousel,
    CarouselItem,
    CarouselSteps,
    TranslocoPipe,
    Banner,
    RouterLink,
    RolePermissionDirective,
  ],
  template: `
    @if (deposits().depositsList && deposits().depositsList.length) {
      <scb-carousel #myCarousel>
        @for (accountDetail of deposits().depositsList; track accountDetail.currency) {
          <app-balance-card
            [accountDetail]="accountDetail"
            [currency]="accountDetail.currency"
            [accountType]="accountType"
            scbCarouselItem
            class="basis-full sm:basis-1/2"
            href="/dashboard/deposits"
            [class]="(deposits().depositsList || []).length > 1 ? '2xl:basis-1/3' : ''" />
        }

        <app-new-account
          routerLink="/products/time-deposits"
          *rolePermission="['MAKER', 'SUPER_USER']"
          scbCarouselItem
          class="basis-full cursor-pointer sm:basis-1/2"
          [class]="(deposits().depositsList || []).length > 1 ? '2xl:basis-1/3' : ''">
          {{ 'dashboard.timeDeposits.openNewTD' | transloco }}
        </app-new-account>

        <scb-carousel-steps [carousel]="myCarousel" />
      </scb-carousel>
    } @else {
      <app-banner
        *rolePermission="['MAKER', 'SUPER_USER']"
        routerLink="/products/time-deposits" />
    }
  `,
})
export class TimeDepositsTab {
  readonly deposits = input.required<Deposits>();
  readonly accountType = 'Deposits';
}
