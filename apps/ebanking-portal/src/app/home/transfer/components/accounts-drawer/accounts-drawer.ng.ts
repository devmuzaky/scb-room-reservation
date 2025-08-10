import { NgClass, TitleCasePipe } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  model,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { CurrencyView, Skeleton } from '@/core/components';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective } from '@jsverse/transloco';
import { Badge } from '@scb/ui/badge';
import { Button, IconButton } from '@scb/ui/button';
import { Icon } from '@scb/ui/icon';
import { ChipModule } from 'primeng/chip';
import { DrawerModule } from 'primeng/drawer';
import { AccountDTO, TransferType } from '../../model';

@Component({
  selector: 'accounts-drawer',
  templateUrl: './accounts-drawer.ng.html',
  imports: [
    ChipModule,
    DrawerModule,
    Icon,
    IconButton,
    TranslocoDirective,
    Badge,
    CurrencyView,
    Skeleton,
    NgClass,
    TitleCasePipe,
    Button,
  ],
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
    }

    p-chip.p-component.active .text-text-primary {
      color: var(--color-white);
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
export class AccountsDrawer {
  readonly layoutFacade = inject(LayoutFacadeService);

  readonly type = input<'from' | 'to'>('from');
  readonly transferType = input.required<TransferType>();
  readonly currency = input<string>();
  readonly skipAccount = input<string | undefined>(undefined);
  readonly open = model(false);
  readonly selectedAccount = model<AccountDTO | null>(null);

  readonly accountsData = input<AccountDTO[]>([]);
  readonly isLoadingState = input<boolean>(false);
  readonly errorState = input<string | null>(null);
  readonly availableCurrencies = input<string[]>([]);

  readonly accountListChange = output<AccountDTO[]>();
  readonly refreshRequest = output<{ type: 'from' | 'to'; currency?: string }>();

  readonly searchTerm = signal('');
  readonly selectedCurrency = linkedSignal(() => this.currency() || '');
  readonly lang = computed(() => this.layoutFacade.language());

  readonly list = computed(() => {
    const currency = this.selectedCurrency();
    const accounts = this.accountsData();

    if (currency) {
      return accounts.filter(account => account.currency.toUpperCase() === currency.toUpperCase());
    }

    return accounts;
  });

  readonly isLoading = computed(() => this.isLoadingState());

  readonly hasError = computed(() => !!this.errorState());

  readonly currenciesFilter = computed(() => this.availableCurrencies());

  readonly filteredList = computed(() => {
    const accounts = this.list();
    const skipAccount = this.skipAccount();
    const term = this.searchTerm()?.toLowerCase() || '';

    let filtered = accounts;

    if (skipAccount) {
      filtered = filtered.filter(account => account.accountNumber !== skipAccount);
    }

    if (term) {
      filtered = filtered.filter(account => {
        const accountNumber = account.accountNumber?.toString().toLowerCase() || '';
        const nickname = account.nickname?.toLowerCase() || '';
        return accountNumber.includes(term) || nickname.includes(term);
      });
    }

    return filtered;
  });

  readonly hasUSDaccount = computed(() => {
    const filtered = this.filteredList();
    return filtered.length === 0 || filtered.every(account => account.currency.toLocaleUpperCase() === 'USD');
  });

  readonly isEmpty = computed(() => this.list().length === 0);

  constructor() {
    effect(() => {
      const currentList = this.list();
      this.accountListChange.emit(currentList);
    });

    effect(() => {
      if (this.open() && this.selectedCurrency()) {
        const type = this.type();
        const currency = this.selectedCurrency();
        const currentData = this.accountsData();

        const hasMatchingCurrencyData = currentData.some(
          account => account.currency.toUpperCase() === currency.toUpperCase(),
        );

        if (!hasMatchingCurrencyData && currency !== '' && currentData.length) {
          this.refreshRequest.emit({ type, currency });
        }
      }
    });
  }

  closeDrawer() {
    this.open.set(false);
  }

  setCurrency(currency: string): void {
    this.selectedCurrency.set(currency);

    const type = this.type();
    const currentData = this.accountsData();

    const hasMatchingCurrencyData =
      currency === '' || currentData.some(account => account.currency.toUpperCase() === currency.toUpperCase());

    if (!hasMatchingCurrencyData) {
      this.refreshRequest.emit({ type, currency });
    }
  }

  reload() {
    this.refreshRequest.emit({
      type: this.type(),
      currency: this.selectedCurrency(),
    });
  }

  selectAccount(item: AccountDTO) {
    this.selectedAccount.set(item);
    this.closeDrawer();
  }

  onSearch(value: string) {
    this.searchTerm.set(value);
  }
}
