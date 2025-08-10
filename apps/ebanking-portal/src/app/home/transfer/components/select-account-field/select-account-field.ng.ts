import { ChangeDetectionStrategy, Component, computed, input, OnInit, output, signal } from '@angular/core';
import { CurrencyView, Skeleton } from '@/core/components';
import { AccountInfo } from '@/home/transfer-details/Model/transfer-details.model';
import { TranslocoDirective } from '@jsverse/transloco';
import { Badge } from '@scb/ui/badge';
import { Button } from '@scb/ui/button';
import { Icon } from '@scb/ui/icon';
import { AccountDTO, SelectAccountFieldProps, TransferType } from '../../model';
import { AccountsDrawer } from '../accounts-drawer/accounts-drawer.ng';

@Component({
  selector: 'select-account-field',
  templateUrl: './select-account-field.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, AccountsDrawer, Button, TranslocoDirective, Badge, CurrencyView, Skeleton],
})
export class SelectAccountField implements OnInit {
  readonly type = input<'from' | 'to'>('from');
  readonly transferType = input.required<TransferType>();
  readonly currency = input<string>();
  readonly skipAccount = input<string>();
  readonly setAccountData = input<AccountInfo | null | undefined>(null);
  readonly isLoadingState = input<boolean>(false);
  readonly accountsData = input<AccountDTO[]>([]);
  readonly errorState = input<string | null>(null);
  readonly availableCurrencies = input<string[]>([]);

  readonly accountSelected = output<SelectAccountFieldProps>();
  readonly refreshRequest = output<{ type: 'from' | 'to'; currency?: string }>();

  readonly open = signal(false);
  readonly selectedAccount = signal<AccountDTO | null>(null);
  readonly accountList = signal<AccountDTO[]>([]);
  readonly isLoading = computed(() => this.isLoadingState());

  ngOnInit() {
    if (this.setAccountData()) {
      this.selectedAccount.set({
        accountNumber: this.setAccountData()?.accountNumber || '',
        accountType: this.setAccountData()?.accountType || '',
        nickname: this.setAccountData()?.accountNickname || '',
        availableBalance: this.setAccountData()?.availableBalance || 0,
        currency: this.currency(),
      } as AccountDTO);
    }
  }

  openDrawer() {
    this.open.set(true);
  }

  handleAccountList(list: AccountDTO[]) {
    this.accountList.set(list);
    const accountNumber = this.setAccountData()?.accountNumber || '';
    const accountType = this.setAccountData()?.accountType || '';

    const matchedAccount = list.find(
      account => account.accountNumber === accountNumber && account.accountType === accountType,
    );

    if (matchedAccount) {
      const current = this.selectedAccount();
      if (current && current.availableBalance !== matchedAccount.availableBalance) {
        this.selectedAccount.set({
          ...current,
          availableBalance: matchedAccount.availableBalance,
        });
        this.accountChange(matchedAccount);
      }
    }
  }

  accountChange(account: AccountDTO) {
    this.accountSelected.emit({
      type: this.type(),
      accountSelected: account,
    });
  }

  handleRefreshRequest(request: { type: 'from' | 'to'; currency?: string }) {
    this.refreshRequest.emit(request);
  }
}
