import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { AppBreadcrumbsComponent, CurrencyView } from '@/core/components';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective } from '@jsverse/transloco';
import { Tab, Tabs } from '@scb/ui/tabs';
import { ProductCdDetail, ProductResponse } from '../model';
import { ProductCard, ProductCardItem } from './product-card.ng';
import { ProductContainer } from './product-container.ng';

@Component({
  selector: 'app-products-cd',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Tabs,
    Tab,
    AppBreadcrumbsComponent,
    TranslocoDirective,
    ProductCard,
    ProductCardItem,
    ProductContainer,
    CurrencyView,
  ],
  template: `
    <section class="col-span-12 max-sm:hidden 2xl:row-span-1">
      <app-breadcrumbs
        *transloco="let t; prefix: 'breadcrumbs'"
        [routes]="[
          { label: t('products'), path: '/products' },
          { label: t('certificateOfDeposits'), path: '' },
        ]"></app-breadcrumbs>
    </section>

    <div
      class="col-span-12 row-span-8"
      *transloco="let t; prefix: 'products'">
      <scb-tabs
        class="!bg-transparent"
        [(selectedIndex)]="selectedIndex">
        <scb-tab [label]="t('all')"> </scb-tab>
        <scb-tab [label]="t('threeYears')"> </scb-tab>
        <scb-tab [label]="t('fiveYears')"> </scb-tab>
      </scb-tabs>
      <app-product-container
        [loading]="cdSource.isLoading()"
        [error]="isError()"
        (reload)="cdSource.reload()"
        [isEmpty]="filteredList().length === 0">
        @for (item of filteredList(); track item.cdTdId) {
          <app-product-card
            [isNew]="item.new"
            icon="prod"
            [path]="'/products/certificate-of-deposits/cd-form/' + item.categoryId + '--' + item.cdTdId">
            <ng-container class="title">{{ item.title }}</ng-container>
            <app-product-card-item>
              <ng-container class="item-title">{{ t('interestRate') }}:</ng-container>
              <ng-container class="item-content">{{ item.interestRate }}%</ng-container>
            </app-product-card-item>
            <app-product-card-item>
              <ng-container class="item-title">{{ t('frequency') }}:</ng-container>
              <ng-container class="item-content">{{ t(item.frequency) }}</ng-container>
            </app-product-card-item>
            <app-product-card-item>
              <ng-container class="item-title">{{ t('interestType') }}:</ng-container>
              <ng-container class="item-content">{{ t(item.interestType) }}</ng-container>
            </app-product-card-item>
            <app-product-card-item>
              <ng-container class="item-title">{{ t('minimumDeposit') }}:</ng-container>
              <ng-container class="item-content">
                <currency-view
                  [amount]="item.minimumDeposit"
                  [currency]="item.currency" />
              </ng-container>
            </app-product-card-item>
            <ng-container class="btn-text">{{ t('applyNow') }}</ng-container>
          </app-product-card>
        }
      </app-product-container>
    </div>
  `,
  host: {
    class: 'container-grid py-3xl px-3xl',
  },
})
export default class ProductsCD {
  readonly layoutFacade = inject(LayoutFacadeService);

  readonly selectedIndex = signal(0);
  readonly cdType = ['All', 'three_years', 'five_years'];
  readonly cdSource = httpResource<ProductResponse<ProductCdDetail>>(() => {
    const _ = this.layoutFacade.language();
    return `/api/product/list/cd-list?cd_type=${this.cdType[0]}`;
  });
  readonly isError = computed(
    () => this.cdSource.error() || (this.cdSource.hasValue() && this.cdSource.value().status === 'Failed'),
  );
  readonly filteredList = computed(() => {
    const data = this.cdSource.value()?.data || [];
    const type = this.cdType[this.selectedIndex()];
    if (type === 'All') return data;
    return data.filter(x => x.duration === (type === 'three_years' ? '36M' : '60M'));
  });
}
