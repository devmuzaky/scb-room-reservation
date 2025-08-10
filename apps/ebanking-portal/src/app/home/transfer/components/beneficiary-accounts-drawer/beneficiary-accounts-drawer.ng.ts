import { NgClass } from '@angular/common';
import { Component, computed, effect, inject, input, model, signal, ViewEncapsulation } from '@angular/core';
import { Skeleton } from '@/core/components';
import { AddBeneficiaryFormComponent } from '@/home/beneficiary/add-form/add-form.ng';
import {
  BENEFICIARY_TRANSACTION_TYPE_OPTIONS,
  IBAN_PAYMENT_METHOD,
  PAYMENT_METHODS_OUTSIDE,
} from '@/home/beneficiary/models/constants';
import { Beneficiary } from '@/home/beneficiary/models/models';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective } from '@jsverse/transloco';
import { Button, IconButton } from '@scb/ui/button';
import { Icon } from '@scb/ui/icon';
import { ChipModule } from 'primeng/chip';
import { DrawerModule } from 'primeng/drawer';
import { TransferService } from '../../transfer.service';
import { BeneficiarySelectedView } from '../beneficiary-selected/beneficiary-selected-view.ng';

@Component({
  selector: 'beneficiary-accounts-drawer',
  templateUrl: './beneficiary-accounts-drawer.ng.html',
  imports: [
    DrawerModule,
    Icon,
    IconButton,
    Button,
    AddBeneficiaryFormComponent,
    TranslocoDirective,
    ChipModule,
    Skeleton,
    NgClass,
    BeneficiarySelectedView,
  ],
  styles: `
    .p-drawer-header {
      display: block !important;
    }
    .dark .mobile-full {
      background: var(--color-gray-850) !important;
    }
    .mobile-full {
      width: 35rem !important;
    }
    p-chip.p-component {
      border-radius: 35px;
    }
    p-chip.p-component.active,
    .dark p-chip.p-component.active {
      background: var(--color-primary);
    }
    .dark p-chip.p-component {
      background: var(--color-gray-850);
    }

    p-chip.p-component .text-text-primary {
      flex: 1;
      white-space: nowrap;
      padding-right: 24px;
    }
    html[dir='rtl'] p-chip.p-component .text-text-primary {
      padding-left: 24px;
      padding-right: 5px;
    }
    p-chip.p-component.active .text-text-primary {
      color: var(--color-white);
    }
    p-chip.p-component .text-text-primary.all-btn {
      padding-right: 17px;
    }
    html[dir='rtl'] p-chip.p-component .text-text-primary.all-btn {
      padding-right: 17px;
      padding-left: 17px;
    }

    p-chip.p-component.active .text-text-primary img,
    .dark p-chip.p-component .text-text-primary img {
      filter: invert(1);
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
      .p-drawer-right .p-drawer-content {
        height: 61vh !important;
        flex-grow: 1;
        padding-bottom: 80px;
      }
      .p-drawer-right .p-drawer-footer {
        margin-top: 0;
      }
    }

    .p-drawer-right .p-drawer-content {
      padding-bottom: 80px;
    }
  `,
  encapsulation: ViewEncapsulation.None,
})
export class BeneficiaryAccountsDrawer {
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly transferService = inject(TransferService);

  readonly step = signal<'list' | 'add'>('list');
  readonly type = input.required<'inside' | 'outside'>();
  readonly activeAccountId = signal('');
  readonly selectedTransactionMethod = signal('');
  readonly open = model(false);
  readonly selectedBeneficiary = model<Beneficiary | undefined>(undefined);

  readonly lang = computed(() => this.layoutFacade.language());
  readonly searchTerm = signal('');

  readonly beneficiaryType = computed(() => (this.type() === 'inside' ? 'INSIDE_SCB' : 'LOCAL_OUTSIDE_SCB'));

  readonly beneficiaries = computed(() => {
    const type = this.beneficiaryType();
    const transactionMethod = this.selectedTransactionMethod() || undefined;
    return this.transferService.getBeneficiaries(type, transactionMethod);
  });

  readonly isLoading = computed(() => {
    const type = this.beneficiaryType();
    return this.transferService.isBeneficiariesLoading(type);
  });

  readonly hasError = computed(() => {
    const type = this.beneficiaryType();
    return !!this.transferService.getBeneficiariesError(type);
  });

  readonly filteredList = computed(() => {
    const beneficiaries = this.beneficiaries();
    const term = this.searchTerm();
    return this.transferService.filterBeneficiaries(beneficiaries, term);
  });

  readonly isEmpty = computed(() => this.beneficiaries().length === 0);

  readonly transactionFilterOptions = () => {
    return BENEFICIARY_TRANSACTION_TYPE_OPTIONS.filter(option => {
      if (this.type() === 'inside') {
        const method = PAYMENT_METHODS_OUTSIDE.find(item => item.id === option.key);
        return method?.id !== IBAN_PAYMENT_METHOD;
      }
      return true;
    }).map(option => {
      const icon = PAYMENT_METHODS_OUTSIDE.find(item => item.id === option.key)?.icon || 'bank';
      return {
        transactionMethod: option.key,
        label: option.value,
        icon,
      };
    });
  };

  readonly transactionMethods = computed(() => {
    const items = this.beneficiaries();
    const map = new Map(
      items.map(b => [b.transactionMethod, { transactionMethod: b.transactionMethod, icon: b.icon }]),
    );
    return Array.from(map.values());
  });

  constructor() {
    effect(() => {
      if (this.open()) {
        const type = this.beneficiaryType();
        this.transferService.loadBeneficiariesData(type);
      }
    });
  }

  closeDrawer() {
    this.open.set(false);
    this.selectedTransactionMethod.set('');
  }

  addNewBeneficiary() {
    this.step.set('add');
  }

  closeBeneficiary() {
    this.step.set('list');
  }

  addNewBeneficiaryOrClose(data: boolean | Beneficiary) {
    if (typeof data === 'boolean') {
      this.closeBeneficiary();
    } else {
      this.selectBeneficiary(data);
    }
  }

  reload() {
    const type = this.beneficiaryType();
    this.transferService.refreshBeneficiariesData(type);
  }

  selectBeneficiary(item: Beneficiary) {
    this.selectedBeneficiary.set(item);
    this.step.set('list');
    this.closeDrawer();

    const type = this.beneficiaryType();
    this.transferService.refreshBeneficiariesData(type);
  }

  onSearch(value: string) {
    this.searchTerm.set(value);
  }

  setTransactionMethod(method: string): void {
    this.selectedTransactionMethod.set(method);
    this.activeAccountId.set(method);
  }

  applyFilter() {
    this.reload();
  }
}
