import { Component, computed, effect, inject, model, output, signal, ViewEncapsulation } from '@angular/core';
import { Skeleton } from '@/core/components';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective } from '@jsverse/transloco';
import { Button, IconButton } from '@scb/ui/button';
import { Icon } from '@scb/ui/icon';
import { DrawerModule } from 'primeng/drawer';
import { CharityItem } from '../../model';
import { TransferService } from '../../transfer.service';

@Component({
  selector: 'charity-drawer',
  templateUrl: './charity-drawer.html',
  imports: [DrawerModule, Icon, IconButton, TranslocoDirective, Skeleton, Button],
  styles: `
    .p-drawer-header {
      display: block !important;
    }
    .dark .mobile-full {
      background: var(--color-gray-850) !important;
    }
    .mobile-full {
      width: 33rem !important;
    }

    @media screen and (max-width: 1680px) {
      .mobile-full {
        width: 35rem !important;
      }
    }
    @media screen and (max-width: 640px) {
      .mobile-full {
        width: 100% !important;
        margin-top: 20vh;
        height: 80vh !important;
        justify-content: end;
        border-radius: 28px 28px 0px 0px;
      }
    }
  `,
  encapsulation: ViewEncapsulation.None,
})
export class CharityDrawer {
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly transferService = inject(TransferService);

  readonly searchTerm = signal('');
  readonly open = model(false);
  readonly selectedCharity = model<CharityItem | null>(null);
  readonly charitySelected = output<CharityItem>();

  readonly lang = computed(() => this.layoutFacade.language());
  readonly isArabic = computed(() => this.lang() === 'ar');

  readonly list = this.transferService.getCharityList();
  readonly isLoading = this.transferService.isCharityLoading();
  readonly hasError = this.transferService.getCharityError();

  readonly status = computed(() => {
    if (this.isLoading()) return 'loading';
    if (this.hasError()) return 'error';
    return 'success';
  });

  readonly filteredList = computed(() => {
    return this.transferService.filterCharities(this.searchTerm());
  });

  readonly isEmpty = computed(() => this.list().length === 0);

  constructor() {
    effect(() => {
      if (this.open()) {
        this.transferService.loadCharityData();
      }
    });
  }

  closeDrawer() {
    this.open.set(false);
  }

  reload() {
    this.transferService.refreshCharityData();
  }

  selectCharity(charity: CharityItem) {
    this.selectedCharity.set(charity);
    this.charitySelected.emit(charity);
    this.closeDrawer();
  }

  onSearch(value: string) {
    this.searchTerm.set(value);
  }

  getCharityName(charity: CharityItem): string {
    return this.transferService.getCharityName(charity, this.isArabic());
  }
}
