import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective } from '@jsverse/transloco';
import { ProgressBar } from 'primeng/progressbar';

@Component({
  selector: 'app-transfer-progress',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProgressBar, TranslocoDirective],
  template: `<div
    class="progress-container mt-2 flex flex-col gap-1"
    *transloco="let t; prefix: 'transfer.scheduledTransfers'">
    <div class="mf-sm text-text-secondary flex justify-between">
      <span>
        {{ t('executedTransfers') }}
      </span>

      <span class="mf-sm text-text-primary font-semibold"> {{ executedCount() }} {{ t('of') }} {{ totalCount() }}</span>
    </div>
    <p-progressbar
      [value]="value()"
      [color]="darkMode() ? '#4ADE80' : '#16A34A'"
      [showValue]="false"
      valueStyleClass="rounded-full"
      styleClass="!h-2 rounded-full" />
  </div>`,
})
export class TransferProgress {
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly darkMode = computed(() => this.layoutFacade.isDarkTheme());

  readonly totalCount = input.required<number>();
  readonly successCount = input.required<number>();
  readonly executedCount = computed(() => (this.successCount() || 0) + (this.failedCount() || 0));
  readonly failedCount = input<number>(0);
  readonly value = computed(() => {
    const totalTransferCount = this.totalCount() || 1;
    const executedTransferCount = this.executedCount();
    return (executedTransferCount / totalTransferCount) * 100;
  });
}
