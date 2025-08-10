import { Component, inject, input } from '@angular/core';
import { Alert, AlertTypes } from '@scb/ui/alert';
import { ToastModule, ToastPositionType } from 'primeng/toast';
import { ToasterService } from './toaster.service';

@Component({
  selector: 'toaster-component',
  imports: [ToastModule, Alert],
  template: `
    <p-toast
      [position]="position()"
      (onClose)="closeFn($event)"
      key="scb-toaster">
      <ng-template
        let-message
        #headless
        let-closeFn="closeFn"
        #message>
        <scb-alert
          [title]="message.summary"
          [type]="message.severity"
          size="sm"
          (closeAlert)="closeFn($event)"
          [desc]="message.detail" />
      </ng-template>
    </p-toast>
  `,
})
export class ToasterComponent {
  readonly position = input<ToastPositionType>('bottom-right');
  readonly type = input<AlertTypes>('info');

  readonly toaster = inject(ToasterService);

  closeFn(event: any) {
    this.toaster.closeFn('scb-toaster');
  }
}
