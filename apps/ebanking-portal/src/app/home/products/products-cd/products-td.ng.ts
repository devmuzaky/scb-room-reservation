import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { AppBreadcrumbsComponent, CurrencyView } from '@/core/components';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective } from '@jsverse/transloco';
import { Tab, Tabs } from '@scb/ui/tabs';
import { ProductResponse, ProductTdDetail } from '../model';
import { ProductCard, ProductCardItem } from './product-card.ng';
import { ProductContainer } from './product-container.ng';

@Component({
  selector: 'app-products-td',
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
          { label: t('timeDeposits'), path: '' },
        ]"></app-breadcrumbs>
    </section>

    <div
      class="col-span-12 row-span-8"
      *transloco="let t; prefix: 'products'">
      <scb-tabs
        class="!bg-transparent"
        [(selectedIndex)]="selectedIndex">
        <scb-tab [label]="t('all')"> </scb-tab>
        <scb-tab label="EGP"> </scb-tab>
        <scb-tab label="USD"> </scb-tab>
      </scb-tabs>
      <app-product-container
        [loading]="tdSource.isLoading()"
        [error]="isError()"
        (reload)="tdSource.reload()"
        [isEmpty]="filteredList().length === 0">
        @for (item of filteredList(); track item.cdTdId) {
          <app-product-card
            [isNew]="item.new"
            icon="time-deposits"
            [path]="'/products/time-deposits/td-form/' + +item.categoryId + '--' + item.cdTdId">
            <ng-container class="title">{{ item.title }}</ng-container>
            <app-product-card-item>
              <ng-container class="item-title">{{ t('interestRate') }}:</ng-container>
              <ng-container class="item-content">{{ addPercentage(item.interestRate) }}</ng-container>
            </app-product-card-item>
            <app-product-card-item>
              <ng-container class="item-title">{{ t('frequency') }}:</ng-container>
              <ng-container class="item-content">{{ item.frequency }}</ng-container>
            </app-product-card-item>
            <app-product-card-item>
              <ng-container class="item-title">{{ t('interestType') }}:</ng-container>
              <ng-container class="item-content">{{ item.interestType }}</ng-container>
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
export default class ProductsTD {
  readonly layoutFacade = inject(LayoutFacadeService);

  readonly selectedIndex = signal(0);
  readonly tdType = ['All', 'egp', 'usd'];
  readonly tdSource = httpResource<ProductResponse<ProductTdDetail>>(() => {
    const _ = this.layoutFacade.language();
    return `/api/product/list/td-list?currency_id=${this.tdType[0]}`;
  });
  readonly isError = computed(
    () => this.tdSource.error() || (this.tdSource.hasValue() && this.tdSource.value().status === 'Failed'),
  );
  readonly filteredList = computed(() => {
    const data = this.tdSource.value()?.data || [];
    const type = this.tdType[this.selectedIndex()];
    if (type === 'All') return data;
    return data.filter(x => x.currency?.toLowerCase() === type);
  });

  addPercentage(rate: string | undefined): string {
    if (!rate) return '';
    const parts = rate.split(' - ');
    return parts.map(p => p.trim() + '%').join(' - ');
  }
}
