import { Injectable } from '@angular/core';
import { dialogPortal } from '@scb/ui/dialog';
import { IdleAlert, IdleAlertProps } from './idle-alert.ng';

@Injectable({ providedIn: 'root' })
export class IdleAlertService {
  private readonly dialog = dialogPortal();

  open(props: IdleAlertProps) {
    this.dialog.open(IdleAlert, {
      width: '440px',
      maxWidth: '95vw',
      disableClose: true,
      header: true,
      focusTrap: true,
      classNames: ['!w-[343px] sm:!w-[388px]'],
      containerClassNames: ['p-xl 2xl:p-3xl h-full'],
      data: props,
    });
  }

  closeAll() {
    this.dialog.closeAll();
  }
}
