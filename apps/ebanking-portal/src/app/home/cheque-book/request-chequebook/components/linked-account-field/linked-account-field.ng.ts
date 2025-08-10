import { Component, inject, input, output, signal } from '@angular/core';
import { CurrencyView } from '@/core/components';
import { LinkedAccountDTO, LinkedAccountInfo } from '@/home/cheque-book/chequebook.model';
import { TranslocoDirective } from '@jsverse/transloco';
import { Badge } from '@scb/ui/badge';
import { Button } from '@scb/ui/button';
import { Icon } from '@scb/ui/icon';
import { ChequeBookService } from '../../chequebook.service';
import { LinkedAccountsDrawer, RequestType } from '../linked-accounts-drawer/linked-accounts-drawer.ng';

@Component({
  selector: 'linked-account-field',
  templateUrl: './linked-account-field.html',
  imports: [Icon, LinkedAccountsDrawer, Button, TranslocoDirective, Badge, CurrencyView],
})
export class LinkedAccountField {
  readonly transfer = inject(ChequeBookService);
  readonly type = input<'linked' | 'debit'>('linked');
  readonly requestType = input.required<RequestType>();
  readonly currency = input<string>();
  readonly setLinkedAccountData = input<LinkedAccountInfo | null | undefined>(null);
  readonly accountSelected = output<SelectChequeBookAccountFieldProps>();

  readonly open = signal(false);
  readonly selectedAccount = signal<LinkedAccountDTO | null>(null);

  readonly accountList = signal<LinkedAccountDTO[]>([]);

  openDrawer() {
    this.open.set(true);
  }

  handleAccountList(list: LinkedAccountDTO[]) {
    this.accountList.set(list);
    const accountNumber = this.setLinkedAccountData()?.accountNumber || '';
    const categoryDescription = this.setLinkedAccountData()?.categoryDescription || '';

    const matchedAccount = list.find(
      account => account.accountNumber === accountNumber && account.categoryDescription === categoryDescription,
    );

    if (matchedAccount) {
      const current = this.selectedAccount();
      if (current && current.workingBalance !== matchedAccount.workingBalance) {
        this.selectedAccount.set({
          ...current,
          workingBalance: matchedAccount.workingBalance,
        });
        this.accountChange(matchedAccount);
      }
    }
  }

  accountChange(account: LinkedAccountDTO) {
    this.accountSelected.emit({
      type: this.type(),
      accountSelected: account,
    });
  }
}

export interface SelectChequeBookAccountFieldProps {
  type: 'linked' | 'debit';
  accountSelected: LinkedAccountDTO;
}
