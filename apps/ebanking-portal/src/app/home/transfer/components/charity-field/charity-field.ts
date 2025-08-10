import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { CharityDrawer } from '@/home/transfer/components/charity-drawer/charity-drawerr';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { Icon } from '@scb/ui/icon';
import { CharityItem } from '../../model';

@Component({
  selector: 'charity-field',
  template: `
    @if (selectedCharity(); as charity) {
      <div
        *transloco="let t; prefix: 'transfer.charityDrawer'"
        class="gap-md p-xl border-border-secondary flex items-center justify-between rounded-lg border">
        <div class="gap-lg flex flex-1 items-center">
          <div class="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
            <icon
              [name]="charity.customerId || 'building'"
              class="text-primary h-6 w-6" />
          </div>
          <div class="gap-sm flex flex-1 flex-col">
            <div class="head-xs-s truncate-force">{{ getCharityName(charity) }}</div>
          </div>
        </div>
        <button
          scbButton
          variant="ghost"
          size="md"
          (click)="openDrawer()">
          {{ t('change') }}
        </button>
      </div>
    } @else {
      <div
        (click)="openDrawer()"
        *transloco="let t; prefix: 'transfer.charityDrawer'"
        class="border-border-primary p-xl min-h-8xl flex cursor-pointer items-center justify-center rounded-lg border border-dashed text-center transition hover:border-gray-400">
        <span class="text-text-tertiary inline-flex items-center space-x-1">
          <icon
            name="plus"
            class="h-3xl w-3xl" />
          <span class="mf-md font-normal">{{ t('selectCharity') }}</span>
        </span>
      </div>
    }

    <charity-drawer
      [(open)]="open"
      [(selectedCharity)]="selectedCharity"
      (charitySelected)="onCharitySelected($event)" />
  `,
  imports: [Icon, CharityDrawer, Button, TranslocoDirective],
})
export class CharityField {
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly charitySelected = output<CharityItem>();
  readonly preselectedCharity = input<CharityItem | null>(null);

  readonly open = signal(false);
  readonly selectedCharity = signal<CharityItem | null>(null);
  readonly isArabic = computed(() => this.layoutFacade.language() === 'ar');

  constructor() {
    effect(() => {
      const preselected = this.preselectedCharity();
      if (preselected) {
        this.selectedCharity.set(preselected);
      }
    });
  }

  openDrawer() {
    this.open.set(true);
  }

  onCharitySelected(charity: CharityItem) {
    this.charitySelected.emit(charity);
  }

  getCharityName(charity: CharityItem): string {
    if (this.isArabic()) {
      return charity.customerNameAR || charity.customerNameEN;
    } else {
      return charity.customerNameEN || charity.customerNameAR;
    }
  }
}
