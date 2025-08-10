import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ToasterService } from '@/core/components';
import { TranslocoService } from '@jsverse/transloco';
import { alertPortal } from '@scb/ui/alert-dialog';

@Injectable()
export class ScheduledTransferDetailsService {
  readonly http = inject(HttpClient);
  readonly toaster = inject(ToasterService);
  readonly transloco = inject(TranslocoService);
  readonly alert = alertPortal();
  readonly cancelLoadingId = signal('');

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  private confirmation(callback: Function, isAll = false) {
    if (this.cancelLoadingId()) return; // avoid calling api when inprogress

    this.alert.open({
      title: this.transloco.translate(`transfer.scheduledTransfers.confirmation.${isAll ? 'descAll' : 'desc'}`),
      description: '',
      icon: 'danger-alert',
      actions: [
        {
          text: this.transloco.translate('transfer.scheduledTransfers.confirmation.yes'),
          handler: cls => {
            cls();
            callback();
          },
        },
        {
          text: this.transloco.translate(`transfer.scheduledTransfers.confirmation.${isAll ? 'noAll' : 'no'}`),
          type: 'secondary',
          handler: cls => cls(),
        },
      ],
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  cancelAll(scheduleId: string, callback: Function) {
    this.confirmation(() => this.cancelAllProcess(scheduleId, callback), true);
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  private cancelAllProcess = (scheduleId: string, callback: Function) => {
    this.cancelLoadingId.set(scheduleId);
    const url = `/api/transfer/transfers/schedule/${scheduleId}/cancel-all`;
    this.http.put(url, {}).subscribe({
      next: () => {
        this.cancelLoadingId.set('');
        callback();
      },
      error: () => {
        this.toaster.showError({
          summary: '',
          detail: this.transloco.translate('transfer.scheduledTransfers.apiErrorDetail'),
        });
        this.cancelLoadingId.set('');
      },
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  cancelTransfer(transferId: string, callback: Function) {
    this.confirmation(() => this.cancelTransferProcess(transferId, callback));
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  private cancelTransferProcess = (transferId: string, callback: Function) => {
    this.cancelLoadingId.set(transferId);
    const url = `/api/transfer/transfers/cancel/${transferId}`;
    this.http.put(url, {}).subscribe({
      next: () => {
        this.cancelLoadingId.set('');
        callback();
      },
      error: () => {
        this.toaster.showError({
          summary: '',
          detail: this.transloco.translate('transfer.scheduledTransfers.apiErrorDetail'),
        });
        this.cancelLoadingId.set('');
      },
    });
  };
}
