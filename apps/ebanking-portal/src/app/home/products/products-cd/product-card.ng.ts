import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { Badge } from '@scb/ui/badge';
import { Button } from '@scb/ui/button';
import { Card } from '@scb/ui/card';
import { Icon } from '@scb/ui/icon';

@Component({
  selector: 'app-product-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card, Icon, Button, Badge, RouterLink, TranslocoPipe],
  template: `<scb-card class="flex h-full flex-col">
    <div class="flex items-center justify-between">
      <div class="bg-icon-container-blue grid h-[50px] w-[50px] place-items-center rounded-full">
        <icon
          [name]="icon()"
          class="text-icon-brand w-4xl" />
      </div>
      @if (isNew()) {
        <scb-badge
          variant="info"
          size="md">
          {{ 'products.new' | transloco }}
        </scb-badge>
      }
    </div>
    <h4 class="head-xs-s mt-xl">
      <ng-content select=".title" />
    </h4>
    <div class="bg-text-inverted my-xl h-[1px] w-full"></div>
    <div class="gap-y-lg text-text-secondary mb-xl flex flex-1 flex-col">
      <ng-content select="app-product-card-item" />
    </div>
    <a
      scbButton
      variant="secondary"
      size="md"
      class="w-full"
      [routerLink]="path()">
      <ng-content select=".btn-text" />
    </a>
  </scb-card>`,
})
export class ProductCard {
  readonly icon = input.required<string>();
  readonly isNew = input(false);
  readonly path = input<string>();
}

@Component({
  selector: 'app-product-card-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="body-md"><ng-content select=".item-title" /></div>
    <div class="head-2xs-s"><ng-content select=".item-content" /></div>
  `,
  host: {
    class: 'flex items-center justify-between',
  },
})
export class ProductCardItem {}
