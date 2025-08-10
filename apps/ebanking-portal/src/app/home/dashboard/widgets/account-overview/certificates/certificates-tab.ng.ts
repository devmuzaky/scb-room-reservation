import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RolePermissionDirective } from '@/core/directives/role-permission.directive';
import { TranslocoPipe } from '@jsverse/transloco';
import { Carousel, CarouselItem, CarouselSteps } from '@scb/ui/carousel';
import { Certificates } from '../../../model';
import { BalanceCardComponent } from '../../../ui/balance-card/balance-card.component';
import { Banner } from '../ui/banner.ng';
import { NewAccount } from '../ui/new-account.ng';

@Component({
  selector: 'app-certificates-tab',
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
    @if (certificates().certificatesList && certificates().certificatesList.length) {
      <scb-carousel #myCarousel>
        @for (accountDetail of certificates().certificatesList; track accountDetail.currency) {
          <app-balance-card
            scbCarouselItem
            [accountDetail]="accountDetail"
            [currency]="accountDetail.currency"
            [accountType]="accountType"
            href="/dashboard/certificates"
            class="basis-full sm:basis-1/2"
            [class]="(certificates().certificatesList || []).length > 1 ? '2xl:basis-1/3' : ''" />
        }

        <app-new-account
          routerLink="/products/certificate-of-deposits"
          *rolePermission="['MAKER', 'SUPER_USER']"
          scbCarouselItem
          class="basis-full cursor-pointer sm:basis-1/2"
          [class]="(certificates().certificatesList || []).length > 1 ? '2xl:basis-1/3' : ''">
          {{ 'dashboard.certificates.openNewCD' | transloco }}
        </app-new-account>

        <scb-carousel-steps [carousel]="myCarousel" />
      </scb-carousel>
    } @else {
      <app-banner
        *rolePermission="['MAKER', 'SUPER_USER']"
        routerLink="/products/certificate-of-deposits" />
    }
  `,
})
export class CertificatesTab {
  readonly certificates = input.required<Certificates>();
  readonly accountType = 'Certificates';
}
