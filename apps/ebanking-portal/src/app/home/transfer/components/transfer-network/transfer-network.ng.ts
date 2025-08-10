import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { CurrencyView, Skeleton } from '@/core/components';
import { TranslocoDirective } from '@jsverse/transloco';
import { TransferService } from '../../transfer.service';

@Component({
  selector: 'app-transfer-network-fee',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, CurrencyView, Skeleton],
  template: `<div
    class="flex flex-col"
    *transloco="let t">
    <div class="{{ selectedNetwork() === networkData().key ? 'body-md-s' : 'body-md' }}">{{ networkData().value }}</div>
    <div class="body-sm text-text-secondary gap-xs flex">
      {{ t('transfer.form.fees') }}
      @if (feeSource.isLoading()) {
        <scb-skeleton class="!h-xl !mb-0" />
      } @else {
        <currency-view
          [amount]="fee()"
          size="m" />
      }
    </div>
  </div>`,
})
export class TransferNetworkFee {
  readonly transfer = inject(TransferService);

  readonly networkData = input.required<{ key: string; value: string }>();
  readonly amount = input.required<number>();
  readonly selectedNetwork = input.required<string>();

  readonly feeSource = httpResource<{ fees: 0 }>(() => {
    const amount = this.amount() ? +this.amount().toString().replace(/,/g, '') : 0;
    if (amount <= 0) return undefined;
    return {
      url: `/api/transfer/fees/calculate`,
      method: 'POST',
      body: {
        transferType: 'outside',
        transferNetwork: this.networkData().key,
        transferAmount: amount,
      },
    };
  });
  readonly fee = computed(() => this.feeSource.value()?.fees || 0);

  _ = effect(() => {
    this.transfer.feesAmount.update(x => ({ ...x, [this.networkData().key]: this.fee() }));
  });
}
