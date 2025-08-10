import { Injectable, Signal } from '@angular/core';
import { dialogPortal } from '@scb/ui/dialog';
import { SoftTokenAlert } from './soft-token-alert.ng';

@Injectable({ providedIn: 'root' })
export class SoftTokenService {
  private readonly dialog = dialogPortal();

  open(loading: Signal<boolean>, save: (token: string) => void) {
    this.dialog.open(SoftTokenAlert, {
      width: '440px',
      maxWidth: '95vw',
      disableClose: true,
      header: true,
      focusTrap: true,
      classNames: ['!w-[343px] sm:!w-[388px]'],
      containerClassNames: ['p-xl 2xl:p-3xl h-full'],
      data: {
        showClose: true,
        loading: loading,
        save,
      },
    });
  }

  closeAll() {
    this.dialog.closeAll();
  }
}
