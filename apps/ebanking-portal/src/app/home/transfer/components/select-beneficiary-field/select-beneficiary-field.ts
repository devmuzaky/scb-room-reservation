import { ChangeDetectionStrategy, Component, input, model, OnInit, signal } from '@angular/core';
import { Beneficiary } from '@/home/beneficiary/models/models';
import { BeneficiaryDetails } from '@/home/transfer-details/Model/transfer-details.model';
import { TranslocoDirective } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { Icon } from '@scb/ui/icon';
import { BeneficiaryAccountsDrawer } from '../beneficiary-accounts-drawer/beneficiary-accounts-drawer.ng';
import { BeneficiarySelectedView } from '../beneficiary-selected/beneficiary-selected-view.ng';

@Component({
  selector: 'select-beneficiary-field',
  templateUrl: './select-beneficiary-field.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, BeneficiaryAccountsDrawer, Button, TranslocoDirective, BeneficiarySelectedView],
})
export class SelectBeneficiaryField implements OnInit {
  readonly open = signal(false);
  readonly type = input.required<'inside' | 'outside'>();
  readonly setBeneficiaryAccountData = input<BeneficiaryDetails | null | undefined>(null);
  readonly selectedBeneficiary = model<Beneficiary | undefined>(undefined);

  openDrawer() {
    this.open.set(true);
  }

  ngOnInit() {
    if (this.setBeneficiaryAccountData()) {
      this.selectedBeneficiary.set({
        beneficiaryName: this.setBeneficiaryAccountData()?.beneficiaryName || '',
        beneficiaryNickname: this.setBeneficiaryAccountData()?.beneficiaryNickname || '',
        bank: this.setBeneficiaryAccountData()?.bank,
        beneficiaryNumber: this.setBeneficiaryAccountData()?.beneficiaryNumber || '',
        transactionMethod: this.setBeneficiaryAccountData()?.transactionMethod || '',
      } as Beneficiary);
    }
  }
}
