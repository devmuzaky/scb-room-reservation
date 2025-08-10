import { Component, computed, inject } from '@angular/core';
import { AuthService } from '@/auth/api/auth.service';
import { CurrencyView, DateView } from '@/core/components';
import { NumberCommaFormatPipe } from '@/core/pipes/format-number.pipe';
import { CharitySelectedView } from '@/home/transfer/components/charity-selected/charity-selected';
import { TranslocoDirective } from '@jsverse/transloco';
import { Alert } from '@scb/ui/alert';
import { Card } from '@scb/ui/card';
import { Icon } from '@scb/ui/icon';
import { ScbDate } from '@scb/util/datepicker';
import { TransferService } from '../../transfer.service';
import { AccountSelectedView } from '../account-selected/account-selected-view.ng';
import { BeneficiarySelectedView } from '../beneficiary-selected/beneficiary-selected-view.ng';
import { TransactionSummaryOutside } from '../transaction-summary/transaction-summary-outside.ng';

@Component({
  selector: 'transaction-success',
  templateUrl: './transaction-success.ng.html',
  imports: [
    TranslocoDirective,
    Card,
    Icon,
    AccountSelectedView,
    BeneficiarySelectedView,
    DateView,
    NumberCommaFormatPipe,
    Alert,
    TransactionSummaryOutside,
    CurrencyView,
    CharitySelectedView,
  ],
})
export class TransactionSuccess {
  readonly transfer = inject(TransferService);
  readonly authService = inject(AuthService);

  readonly data = this.transfer.transferSaveRes;
  readonly formData = this.transfer.value;

  readonly beneficiary = this.transfer.selectedBeneficiary;
  readonly isError = computed(() => !!this.transfer.errorMessage());
  readonly displayData = computed(() => (this.isError() ? this.formData() : this.data()));
  readonly isWorkingHours = this.isBetweenWorkingHours(new ScbDate(new Date()).cairoDate());
  readonly isFc = computed(() => this.formData().transferCurrency !== 'EGP');

  readonly isMakerRole = computed(() => {
    const userRoles = this.authService.getRolesFromToken();
    return userRoles?.includes('MAKER') ?? false;
  });

  readonly exchangeRate = computed(() => {
    if (this.isFc()) {
      const fromExchange = this.data()?.exchangeRate;
      const buy = fromExchange?.buy ?? 0;
      const truncatedBuy = Math.floor(buy * 100) / 100;
      return `1 ${fromExchange?.currencyName} = ${truncatedBuy} EGP`;
    }
    return '';
  });

  readonly instantAndRecurring = computed(
    () => this.formData().isSchedule && this.formData().scheduleDto?.frequencyType !== 'ONCE',
  );

  private isBetweenWorkingHours(date: Date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Convert everything to minutes for easier comparison
    const totalMinutes = hours * 60 + minutes;

    // Define the start and end times in minutes
    const startMinutes = 8 * 60 + 30; // 8:30 AM
    const endMinutes = 15 * 60 + 30; // 3:30 PM (15:30 in 24-hour format)

    return totalMinutes >= startMinutes && totalMinutes <= endMinutes;
  }
}
