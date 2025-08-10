import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AppBreadcrumbsComponent } from '@/core/components';
import { RolePermissionDirective } from '@/core/directives/role-permission.directive';
import { TranslocoDirective } from '@jsverse/transloco';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ExchangeRate } from '../dashboard/widgets/exchange-rate/exchange-rate';
import { QuickAction } from '../dashboard/widgets/quick-actions/quick-action.ng';
import AccountTransactionsDetailTableComponent from './account-transaction-table/account-transaction-table';
import { AccountDetailsComponent } from './basic-details/account-basic-details.ng';

@Component({
  selector: 'app-account-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AccountDetailsComponent,
    QuickAction,
    ExchangeRate,
    AccountTransactionsDetailTableComponent,
    RouterModule,
    BreadcrumbModule,
    AppBreadcrumbsComponent,
    TranslocoDirective,
    RolePermissionDirective,
  ],
  template: `
    @if (showBreadcrumb) {
      <section class="px-3xl pt-3xl col-span-12 max-sm:hidden">
        <app-breadcrumbs
          *transloco="let t; prefix: 'breadcrumbs'"
          [routes]="[
            { label: t('home'), path: '/dashboard' },
            { label: t('accountsOverview'), path: '/dashboard/accounts' },
            { label: t('accountDetail') },
          ]"></app-breadcrumbs>
      </section>
    }
    <div class="container-grid px-3xl pt-3xl">
      <ng-container *rolePermission="['SUPER_USER', 'MAKER']">
        <app-quick-action
          class="col-span-4 sm:col-span-6 2xl:col-span-4 2xl:col-start-9 2xl:row-span-1 2xl:row-start-1" />
        <app-account-basic-details
          class="col-span-4 sm:col-span-6 2xl:col-span-8 2xl:col-start-1 2xl:row-span-2 2xl:row-start-1" />
        <app-exchange-rate
          class="col-span-4 sm:col-span-6 2xl:col-span-4 2xl:col-start-9 2xl:row-span-1 2xl:row-start-2" />
      </ng-container>
      <ng-container *rolePermission="['CHECKER', 'VIEWER']">
        <app-account-basic-details
          class="col-span-4 sm:col-span-6 2xl:col-span-8 2xl:col-start-1 2xl:row-span-2 2xl:row-start-1" />

        <app-exchange-rate
          class="col-span-4 sm:col-span-6 2xl:col-span-4 2xl:col-start-9 2xl:row-span-2 2xl:row-start-1" />
      </ng-container>

      <app-account-details-table
        class="col-span-4 sm:col-span-6 2xl:col-span-12 2xl:col-start-1 2xl:row-span-5 2xl:row-start-3" />
    </div>
  `,
})
export default class AccountBasicDetailComponent {
  readonly route = inject(ActivatedRoute);
  readonly showBreadcrumb = !this.route.snapshot.data['hideBreadcrumb'];
}
