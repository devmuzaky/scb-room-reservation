import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RolePermissionDirective } from '@/core/directives/role-permission.directive';
import { TranslocoPipe } from '@jsverse/transloco';
import { Carousel, CarouselItem, CarouselSteps } from '@scb/ui/carousel';
import { Accounts } from '../../../model';
import { BalanceCardComponent } from '../../../ui/balance-card/balance-card.component';
import { NewAccount } from '../ui/new-account.ng';

@Component({
  selector: 'app-accounts-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BalanceCardComponent,
    NewAccount,
    RolePermissionDirective,
    Carousel,
    CarouselItem,
    CarouselSteps,
    TranslocoPipe,
    RouterLink,
  ],
  template: `
    <scb-carousel #myCarousel>
      @for (accountDetail of accounts().accountsList; track accountDetail.currency) {
        <app-balance-card
          scbCarouselItem
          [accountDetail]="accountDetail"
          [currency]="accountDetail.currency"
          [accountType]="accountType"
          class="basis-full sm:basis-1/2"
          href="/dashboard/accounts"
          [class]="(accounts().accountsList || []).length > 1 ? '2xl:basis-1/3' : ''" />
      }

      <app-new-account
        routerLink="/products/accounts"
        *rolePermission="['MAKER', 'SUPER_USER']"
        scbCarouselItem
        class="basis-full cursor-pointer sm:basis-1/2"
        [class]="(accounts().accountsList || []).length > 1 ? '2xl:basis-1/3' : ''">
        {{ 'dashboard.accounts.openNewAccount' | transloco }}
      </app-new-account>

      <scb-carousel-steps [carousel]="myCarousel" />
    </scb-carousel>
  `,
})
export class AccountsTab {
  readonly accounts = input.required<Accounts>();
  readonly accountType = 'Accounts';
}
