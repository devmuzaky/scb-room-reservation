import { CommonModule } from '@angular/common';
import { Component, computed, inject, Input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective } from '@jsverse/transloco';
import { ProgressBarModule } from 'primeng/progressbar';
import { TransferDetailsDTO } from '../Model/transfer-details.model';

@Component({
  selector: 'recurring-details-widget',
  imports: [CommonModule, TranslocoDirective, ProgressBarModule],
  template: `
    <div
      *transloco="let t; prefix: 'transferDetails'"
      class="rounded-2xl border border-gray-200 p-4 dark:border-gray-700">
      <h2 class="mb-1 text-lg font-semibold">{{ t('recurringDetails') }}</h2>
      <div class="my-4 w-full border-t border-gray-300"></div>
      <div class="mf-md text-text-primary mb-1 flex justify-between">
        <span>{{ t('transferProcess') }}</span>
        <span>{{ completedFailed() }} {{ t('of') }} {{ total() }} </span>
      </div>
      <p-progressbar
        [value]="progressValue()"
        [color]="darkMode() ? '#4ADE80' : '#16A34A'"
        [showValue]="false"
        valueStyleClass="rounded-full"
        styleClass="!h-2 rounded-full" />
      <div class="flex items-center justify-center">
        <a
          class="text-primary mt-3 cursor-pointer p-2"
          (click)="scheduledTransfersDetail()"
          >{{ t('viewDetails') }}</a
        >
      </div>
    </div>
  `,
  styles: ``,
})
export class RecurringDetailsWidget {
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly router = inject(Router);
  readonly darkMode = computed(() => this.layoutFacade.isDarkTheme());

  readonly data = signal<TransferDetailsDTO | null>(null);
  @Input()
  set dataInput(value: TransferDetailsDTO | null) {
    this.data.set(value);
  }
  completedFailed = computed(() => {
    const stats = this.data()?.scheduleStats;
    return (stats?.numberOfSuccess ?? 0) + (stats?.numberOfFailed ?? 0);
  });
  total = computed(() => this.data()?.scheduleStats?.total ?? 0);
  progressValue = computed(() => {
    if (!this.data()?.scheduleStats) return 0;
    const completed = this.completedFailed();
    const total = this.total();
    return total > 0 ? (completed / total) * 100 : 0;
  });
  //    progressColor = computed(() => this.darkMode() ? '#4ADE80' : '#16A34A');

  scheduledTransfersDetail() {
    this.router.navigate(['/transfer/scheduled-transfers', this.data()?.scheduleId]);
  }
}
