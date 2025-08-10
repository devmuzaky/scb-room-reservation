import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppBreadcrumbsComponent } from '@/core/components';
import { TranslocoDirective } from '@jsverse/transloco';
import { AccountListPage } from './accounts-list.page';

@Component({
  selector: 'app-account-list-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AccountListPage, AppBreadcrumbsComponent, TranslocoDirective],
  template: `<section class="col-span-12 max-sm:hidden">
      <app-breadcrumbs
        *transloco="let t; prefix: 'breadcrumbs'"
        [routes]="[{ label: t('home'), path: '/dashboard' }, { label: t('accountsOverview') }]"></app-breadcrumbs>
    </section>

    <app-account-list class="col-span-12" />`,
  host: {
    class: `container-grid py-3xl px-3xl`,
  },
})
export default class AccountListContainer {}
