import { inject, Injectable } from '@angular/core';
import { MessageService, ToastMessageOptions } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class ToasterService {
  private readonly messageService = inject(MessageService);

  showSuccess(options: ToastMessageOptions) {
    this.messageService.add({
      ...options,
      key: 'scb-toaster',
      severity: options.severity ?? 'success',
      summary: options.summary,
      detail: options.detail,
      life: 5000,
    });
  }

  showError(options: ToastMessageOptions) {
    this.messageService.add({
      ...options,
      key: 'scb-toaster',
      severity: options.severity ?? 'error',
      summary: options.summary,
      detail: options.detail,
      closable: true,
      life: 5000,
    });
  }

  closeFn(key: string) {
    this.messageService.clear(key);
  }
}
