import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CurrencyView } from '@/core/components';
import { TranslocoDirective } from '@jsverse/transloco';
import { TransferRequestDTO } from '../../model';
import { TransferService } from '../../transfer.service';

@Component({
  selector: 'app-transaction-summary-outside',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyView, TranslocoDirective],
  template: `<div
    *transloco="let t; prefix: 'transfer.summary'"
    class="p-xl gap-2xl border-border-secondary grid grid-cols-1 rounded-2xl border md:grid-cols-2 2xl:grid-cols-3">
    <div class="gap-xs flex flex-col">
      <p class="mf-sm text-text-tertiary font-medium">{{ t('chargesPaidBy') }}</p>
      <p class="mf-md text-text-primary font-semibold">{{ transfer.chargeBearer() }}</p>
    </div>
    <div class="gap-xs flex flex-col">
      <p class="mf-sm text-text-tertiary font-medium">{{ t('fees') }}</p>
      <currency-view
        [amount]="value().fees"
        [currency]="value().feesCurrency" />
    </div>
    <div class="gap-xs flex flex-col">
      <p class="mf-sm text-text-tertiary font-medium">{{ t('totalAmount') }}</p>
      <currency-view [amount]="transfer.totalAmount()" />
    </div>
  </div>`,
})
export class TransactionSummaryOutside {
  readonly transfer = inject(TransferService);
  readonly value = input.required<TransferRequestDTO>();
}
