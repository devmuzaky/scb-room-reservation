import { TitleCasePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
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
import { apiStatus } from '@/core/models/api';
import { LinkedAccountDTO, LinkedAccountListResponseDTO } from '@/home/cheque-book/chequebook.model';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective } from '@jsverse/transloco';
import { Badge } from '@scb/ui/badge';
import { Button, IconButton } from '@scb/ui/button';
import { FormField, ScbInput } from '@scb/ui/form-field';
import { Icon } from '@scb/ui/icon';
import { ChipModule } from 'primeng/chip';
import { DrawerModule } from 'primeng/drawer';
import { ChequeBookService } from '../../chequebook.service';

@Component({
  selector: 'linked-accounts-drawer',
  templateUrl: './linked-accounts-drawer.ng.html',
  imports: [
    ChipModule,
    DrawerModule,
    Icon,
    FormField,
    ScbInput,
    IconButton,
    TranslocoDirective,
    Badge,
    CurrencyView,
    Skeleton,
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
export class LinkedAccountsDrawer {
  readonly accountListChange = output<LinkedAccountDTO[]>();
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly chequeBook = inject(ChequeBookService);
  readonly requestType = input.required<RequestType>();
  readonly searchTerm = signal('');
  readonly type = input<'linked' | 'debit'>('linked');
  readonly currency = input<string>();
  readonly open = model(false);
  readonly selectedAccount = model<LinkedAccountDTO | null>(null);

  readonly selectedCurrency = linkedSignal(() => this.currency() || '');
  readonly lang = computed(() => this.layoutFacade.language());
  readonly currenciesFilter = signal<string[]>([]);
  readonly refresh = signal(1);
  readonly resource = httpResource<LinkedAccountListResponseDTO>(() => ({
    url: `/api/product/chequebooks/accounts`,
    params: {
      accountType: '',
      pageSize: 100,
      pageStart: 0,
    },
  }));

  readonly linkedAccountsList = computed(() => {
    const list = this.resource.value()?.accounts ?? [];
    list.forEach(x => (x.currency = x.currency.toUpperCase()));
    return list;
  });
  readonly status = apiStatus(this.resource.status);
  readonly isEmpty = computed(() => this.linkedAccountsList().length === 0);

  constructor() {
    effect(() => {
      if (this.open()) {
        this.resource.reload();
      }
    });
  }

  closeDrawer() {
    this.open.set(false);
  }

  setCurrency(currency: string): void {
    this.selectedCurrency.set(currency);
    this.reload();
  }

  reload() {
    this.refresh.update(x => x + 1);
  }

  selectAccount(item: LinkedAccountDTO) {
    this.selectedAccount.set(item);
    this.closeDrawer();
  }

  onSearch(value: string) {
    this.searchTerm.set(value);
  }

  readonly filteredAccountsList = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const list = this.linkedAccountsList();

    return list.filter(item => {
      const matchesSearch =
        !term || item.accountNumber?.toLowerCase().includes(term) || item.accountNumber?.toLowerCase().includes(term);

      return matchesSearch;
    });
  });
}

export type RequestType = 'linked' | 'debit';
