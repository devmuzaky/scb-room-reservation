import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RolePermissionDirective } from '@/core/directives/role-permission.directive';
import { TranslocoDirective } from '@jsverse/transloco';
import { Card } from '@scb/ui/card';
import { Icon } from '@scb/ui/icon';

@Component({
  selector: 'transfer-type-list',
  imports: [TranslocoDirective, Card, Icon, RouterLink, RolePermissionDirective],
  template: `
    <ng-container *rolePermission="['SUPER_USER', 'MAKER']">
      <section
        class="container-grid px-3xl pt-3xl"
        *transloco="let t; prefix: 'transfer.add'">
        <scb-card class="p-xl gap-lg col-span-12 flex flex-col">
          @for (item of transferTypeOptions; track item.icon) {
            <a
              [routerLink]="item.route"
              role="button"
              class="gap-xl p-xl border-border-secondary flex cursor-pointer items-center justify-between rounded-lg border dark:bg-gray-950">
              <div class="gap-lg flex items-center">
                <icon
                  class="flex h-[48px] w-[48px] rounded-full"
                  [name]="item.icon" />
                <p class="mf-lg font-semibold">{{ t(item.title) }}</p>
              </div>
              <icon
                class="text-button-icon-hover-ghost h-[24px] w-[24px] rtl:rotate-180"
                name="chevron-right" />
            </a>
          }
        </scb-card>
      </section>
    </ng-container>
    <section
      class="container-grid px-3xl pt-3xl"
      *transloco="let t; prefix: 'transfer.add'">
      <scb-card class="p-xl gap-lg col-span-12 flex flex-col">
        @for (item of transferHistoryOptions; track item.icon) {
          <a
            [routerLink]="item.route"
            class="gap-xl p-xl border-border-secondary flex cursor-pointer items-center justify-between rounded-lg border dark:bg-gray-950">
            <div class="gap-lg flex items-center">
              <icon
                class="flex h-[48px] w-[48px] rounded-full"
                [name]="item.icon" />
              <p class="mf-lg font-semibold">{{ t(item.title) }}</p>
            </div>

            <icon
              class="text-button-icon-hover-ghost h-[24px] w-[24px] rtl:rotate-180"
              name="chevron-right" />
          </a>
        }
      </scb-card>
    </section>
  `,
})
export default class TransferTypeList {
  readonly router = inject(Router);
  readonly transferTypeOptions: TransferTypeOptions[] = [
    {
      icon: 'own-accounts',
      title: 'between',
      route: 'form/OWN',
    },
    {
      icon: 'beneficiary-inside',
      title: 'inside',
      route: 'form/INSIDE',
    },
    {
      icon: 'beneficiary-outside',
      title: 'outside',
      route: 'form/OUTSIDE',
    },
    {
      icon: 'charity',
      title: 'charity',
      route: 'form/CHARITY',
    },
  ];

  readonly transferHistoryOptions: TransferTypeOptions[] = [
    {
      icon: 'schedule',
      title: 'scheduledTransfers',
      route: 'scheduled-transfers',
    },
    {
      icon: 'clock-rounded',
      title: 'transferHistory',
      route: 'transfer-history',
    },
  ];
}

type TransferTypeOptions = {
  icon: string;
  title: string;
  route?: string;
  queryParams?: Record<string, string>;
  data?: any;
};
