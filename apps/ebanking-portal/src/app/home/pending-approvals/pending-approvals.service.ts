import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ToasterService } from '@/core/components';
import { TranslocoService } from '@jsverse/transloco';
import { alertPortal } from '@scb/ui/alert-dialog';

@Injectable()
export class PendingRequestsApprovalsService {
  readonly http = inject(HttpClient);
  readonly toaster = inject(ToasterService);
  readonly transloco = inject(TranslocoService);
  readonly alert = alertPortal();
  readonly withdrawLoadingId = signal('');

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  private confirmation(callback: Function) {
    if (this.withdrawLoadingId()) return; // avoid calling api when inprogress

    this.alert.open({
      title: this.transloco.translate(`pendingApprovals.withdrawConfirmation.title`),
      description: this.transloco.translate(`pendingApprovals.withdrawConfirmation.desc`),
      icon: 'warning-alert',
      showClose: true,
      actions: [
        {
          text: this.transloco.translate('pendingApprovals.withdrawConfirmation.yes'),
          handler: cls => {
            cls();
            callback();
          },
        },
        {
          text: this.transloco.translate(`pendingApprovals.withdrawConfirmation.no`),
          type: 'secondary',
          handler: cls => cls(),
        },
      ],
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  withdraw(transactionId: string, callback: Function) {
    this.confirmation(() => this.withdrawProcess(transactionId, callback));
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  private withdrawProcess = (transactionId: string, callback: Function) => {
    this.withdrawLoadingId.set(transactionId);
    const url = `/api/delegation/withdraw`;
    this.http.post(url, { transactionId: transactionId }).subscribe({
      next: () => {
        this.withdrawLoadingId.set('');
        this.toaster.showSuccess({
          summary: this.transloco.translate('pendingApprovals.success.title'),
          detail: this.transloco.translate('pendingApprovals.success.subTitle'),
        });
        callback();
      },
      error: () => {
        this.toaster.showError({
          summary: '',
          detail: this.transloco.translate('pendingApprovals.error.apiErrorDetail'),
        });
        this.withdrawLoadingId.set('');
      },
    });
  };
}
