import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppBreadcrumbsComponent } from '@/core/components';
import { TranslocoDirective } from '@jsverse/transloco';
import { CertificatesListPage } from './certificates-list.page';

@Component({
  selector: 'app-certificates-list-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CertificatesListPage, AppBreadcrumbsComponent, TranslocoDirective],
  template: `<section class="col-span-12 max-sm:hidden">
      <app-breadcrumbs
        *transloco="let t; prefix: 'breadcrumbs'"
        [routes]="[{ label: t('home'), path: '/dashboard' }, { label: t('certificateOverview') }]"></app-breadcrumbs>
    </section>

    <app-certificates-list class="col-span-12" />`,
  host: {
    class: `container-grid py-3xl px-3xl`,
  },
})
export default class CertificatesListContainer {}
