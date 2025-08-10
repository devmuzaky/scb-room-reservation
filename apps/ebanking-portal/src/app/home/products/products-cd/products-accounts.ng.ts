import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AppBreadcrumbsComponent, CurrencyView } from '@/core/components';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective } from '@jsverse/transloco';
import { ProductAccount, ProductResponse } from '../model';
import { ProductCard, ProductCardItem } from './product-card.ng';
import { ProductContainer } from './product-container.ng';

@Component({
  selector: 'app-products-accounts',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppBreadcrumbsComponent, TranslocoDirective, ProductCard, ProductCardItem, CurrencyView, ProductContainer],
  template: `
    <section class="col-span-12 max-sm:hidden 2xl:row-span-1">
      <app-breadcrumbs
        *transloco="let t; prefix: 'breadcrumbs'"
        [routes]="[
          { label: t('products'), path: '/products' },
          { label: t('accounts'), path: '' },
        ]"></app-breadcrumbs>
    </section>

    <div
      class="col-span-12 row-span-8"
      *transloco="let t; prefix: 'products'">
      <app-product-container
        [loading]="accSource.isLoading()"
        [error]="isError()"
        (reload)="accSource.reload()"
        [isEmpty]="data().length === 0">
        @for (item of data(); track $index) {
          @let acc = item.accountListResponse;
          <app-product-card
            icon="bank"
            [path]="'/products/accounts/current-account/' + acc.categoryId">
            <ng-container class="title">{{ acc.accountTitle }}</ng-container>
            <app-product-card-item>
              <ng-container class="item-title">{{ t('minimumDeposit') }}:</ng-container>
              <ng-container class="item-content">
                <currency-view [amount]="acc.minimumDeposit" />
              </ng-container>
            </app-product-card-item>
            @if (acc.frequency && acc.interestType === 'Interest') {
              <app-product-card-item>
                <ng-container class="item-title">{{ t('frequency') }}:</ng-container>
                <ng-container class="item-content">{{ t(acc.frequency) }}</ng-container>
              </app-product-card-item>
            }
            <app-product-card-item>
              <ng-container class="item-title">{{ t('chequebook') }}:</ng-container>
              <ng-container class="item-content">{{ acc.checkBookAvailable ? t('available') : '' }}</ng-container>
            </app-product-card-item>
            @if (acc.minForInterest) {
              <app-product-card-item>
                <ng-container class="item-title">{{ t('minForInterest') }}:</ng-container>
                <ng-container class="item-content">
                  <currency-view [amount]="acc.minForInterest" />
                </ng-container>
              </app-product-card-item>
            }
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
export default class ProductsAccounts {
  readonly layoutFacade = inject(LayoutFacadeService);

  readonly accSource = httpResource<ProductResponse<ProductAccount>>(() => {
    const _ = this.layoutFacade.language();
    return `/api/product/list/account-list`;
  });
  readonly isError = computed(
    () => this.accSource.error() || (this.accSource.hasValue() && this.accSource.value().status === 'Failed'),
  );
  readonly data = computed(() => this.accSource.value()?.data || []);
}
