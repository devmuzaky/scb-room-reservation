import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, output } from '@angular/core';
import { CurrencyView, DateView } from '@/core/components';
import { NumberCommaFormatPipe } from '@/core/pipes/format-number.pipe';
import { ExchangeRateService } from '@/home/dashboard/widgets/exchange-rate/exchange-rate.service';
import { CharitySelectedView } from '@/home/transfer/components/charity-selected/charity-selected';
import { TranslocoDirective } from '@jsverse/transloco';
import { Alert } from '@scb/ui/alert';
import { Card } from '@scb/ui/card';
import { TransferSteps } from '../../model';
import { TransferService } from '../../transfer.service';
import { AccountSelectedView } from '../account-selected/account-selected-view.ng';
import { BeneficiarySelectedView } from '../beneficiary-selected/beneficiary-selected-view.ng';
import { TransactionSummaryOutside } from './transaction-summary-outside.ng';

@Component({
  selector: 'transaction-summary',
  templateUrl: './transaction-summary.ng.html',
  providers: [ExchangeRateService],
  imports: [
    TranslocoDirective,
    Card,
    Alert,
    AccountSelectedView,
    NumberCommaFormatPipe,
    BeneficiarySelectedView,
    DateView,
    TransactionSummaryOutside,
    CurrencyView,
    CharitySelectedView,
  ],
  host: {
    class: 'flex flex-col',
  },
})
export class TransactionSummary {
  readonly transfer = inject(TransferService);
  readonly erService = inject(ExchangeRateService);
  readonly http = inject(HttpClient);

  readonly step = output<TransferSteps>();

  readonly value = this.transfer.value;
  readonly beneficiary = this.transfer.selectedBeneficiary;

  readonly selectedFromCurrency = computed(() => {
    const r = this.erService.rates();
    return r.find(x => x.currencyName === this.value().transferCurrency)!;
  });

  readonly selectedToCurrency = computed(() => {
    const r = this.erService.rates();
    return r.find(x => x.currencyName === this.erService.toCurrency())!;
  });

  readonly exchangeRate = computed(() => {
    return `1 ${this.value()?.transferCurrency} = ${this.convertToValue(1)} EGP`;
  });

  readonly convertedAmount = computed(() => {
    return this.getConvertToValue(this.value().transferAmount);
  });

  private convertToValue(fromValue = 0, decimals = 2) {
    return this.erService.exchangeRate(fromValue, decimals, this.selectedFromCurrency(), this.selectedToCurrency());
  }
  private getConvertToValue(fromValue = 0, decimals = 4) {
    return this.erService.exchangeRate(fromValue, decimals, this.selectedFromCurrency(), this.selectedToCurrency());
  }
  readonly isFc = computed(() => this.value().transferCurrency !== 'EGP');
  continue() {
    this.step.emit('success');
  }

  constructor() {
    this.erService.callApi.set(computed(() => this.isFc()));
  }
}
