import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { Card } from '@scb/ui/card';

@Component({
  selector: 'app-products',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card, Button, RouterLink, TranslocoDirective],
  template: `<div
    class="gap-2xl col-span-12 row-span-8 grid md:grid-cols-3"
    *transloco="let t; prefix: 'products'">
    @for (item of data; track item.title) {
      <scb-card class="flex flex-col items-center">
        <img
          [src]="item.icon"
          alt=""
          height="115px" />
        <h4 class="head-sm-s mt-2xl">{{ t(item.title) }}</h4>
        <div class="bg-text-inverted my-lg h-[1px] w-full"></div>
        <p class="body-md text-text-tertiary mb-2xl">{{ t(item.desc) }}</p>
        <a
          scbButton
          [routerLink]="item.link"
          variant="ghost"
          size="md"
          class="w-full">
          {{ t('viewAll') }}
        </a>
      </scb-card>
    }
  </div>`,
  host: {
    class: 'container-grid py-3xl px-3xl',
  },
})
export default class Products {
  readonly data = [
    {
      icon: '/icons/products-cd.png',
      title: 'list.cdTitle',
      desc: 'list.cdDesc',
      link: '/products/certificate-of-deposits',
    },
    {
      icon: '/icons/products-td.png',
      title: 'list.tdTitle',
      desc: 'list.tdDesc',
      link: '/products/time-deposits',
    },
    {
      icon: '/icons/products-accounts.png',
      title: 'list.accountsTitle',
      desc: 'list.accountsDesc',
      link: '/products/accounts',
    },
  ];
}
