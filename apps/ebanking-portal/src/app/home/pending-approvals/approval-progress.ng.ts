import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { ProgressBar } from 'primeng/progressbar';

@Component({
  selector: 'approval-progress',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProgressBar],
  template: ` <p-progressbar
    [value]="100"
    [showValue]="false"
    valueStyleClass="{{
      'rounded-full ' + (status() === 'success' ? '!bg-success' : status() === 'reject' ? '!bg-danger' : '!bg-elevated')
    }}"
    styleClass="!h-1 rounded-full w-[45px]" />`,
})
export class ApprovalProgress {
  readonly darkMode = signal(false);
  readonly status = input<'success' | 'reject' | 'default'>('default');
}
