import { ChangeDetectionStrategy, Component, inject, model, OnDestroy } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { Icon } from '@scb/ui/icon';
import { DialogRef } from '@scb/ui/portal';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Icon, TranslocoDirective],
  template: `
    <div
      *transloco="let t; prefix: 'idle'"
      class="gap-lg relative flex flex-col items-center text-center">
      <div class="gap-md flex flex-col items-center">
        <icon
          class="text-brand w-14"
          name="warning-alert"
          data-testid="OTP_ICON_LOCK" />
        <h4 class="head-md-s 2xl:head-lg-s text-text-primary">{{ t('title') }}</h4>
        <p class="body-md text-text-secondary">{{ t('description') }}</p>
        <div
          class="head-xl font-bold"
          data-testid="IDLE_COUNTDOWN">
          {{ remainingSeconds() }}s
        </div>
      </div>

      <div class="gap-md flex w-full flex-col">
        <button
          scbButton
          type="button"
          (click)="onExtend()"
          data-testid="IDLE_BTN_EXTEND">
          {{ t('extend') }}
        </button>
        <button
          scbButton
          variant="ghost"
          type="button"
          (click)="onCancel()"
          data-testid="IDLE_BTN_CANCEL">
          {{ t('cancel') }}
        </button>
      </div>
    </div>
  `,
})
export class IdleAlert implements OnDestroy {
  readonly diaRef = inject<DialogRef<IdleAlertProps>>(DialogRef);
  readonly data = this.diaRef.options.data!;

  readonly remainingSeconds = model<number>(this.data.seconds ?? 30);
  private intervalId: number | undefined;

  constructor() {
    this.intervalId = setInterval(() => {
      const next = this.remainingSeconds() - 1;
      if (next <= 0) {
        this.clearTimer();
        this.data.onCancel();
        return;
      }
      this.remainingSeconds.set(next);
    }, 1000) as unknown as number;
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  onExtend(): void {
    this.clearTimer();
    this.data.onExtend();
    this.diaRef.close();
  }

  onCancel(): void {
    this.clearTimer();
    this.data.onCancel();
    this.diaRef.close();
  }

  private clearTimer(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined as unknown as number;
    }
  }
}

export type IdleAlertProps = {
  seconds: number;
  onExtend: () => void;
  onCancel: () => void;
};
