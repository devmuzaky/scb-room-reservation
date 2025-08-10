import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { dialogPortal } from '@scb/ui/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { TermsAndConditionsContent } from './term-and-conditions-content.ng';

export enum TERMS_AND_CONDITIONS_ID {
  CHEQUE_BOOK = 'CHEQUE_BOOK',
  CORPORATE_CDS_3_YEARS_USD_FIXED_INTEREST = 'CORPORATE_CDS_3_YEARS_USD_FIXED_INTEREST',
  CORPORATE_CDS_5_YEARS_USD = 'CORPORATE_CDS_5_YEARS_USD',
  CORPORATE_FIXED_INTEREST_TD = 'CORPORATE_FIXED_INTEREST_TD',
  CORPORATE_FLOATING_INTEREST_TD = 'CORPORATE_FLOATING_INTEREST_TD',
  SUB_ACCOUNT_TNC = 'SUB_ACCOUNT_TNC',
}

@Component({
  selector: 'app-terms-and-conditions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CheckboxModule, ReactiveFormsModule, TranslocoPipe],
  template: `<p-checkbox
      inputId="size_normal"
      name="size"
      size="large"
      binary="true"
      variant="filled"
      [formControl]="field()"
      (click)="handledTermClick($event)" />
    <span>
      {{ 'termsAndConditions.Iagree' | transloco }}
      <button
        (click)="open($event)"
        class="cursor-pointer underline">
        {{ 'termsAndConditions.termsAndConditions' | transloco }}.
      </button>
    </span>`,
  host: {
    class: 'body-md gap-lg flex',
  },
})
export class TermsAndConditions {
  readonly dialog = dialogPortal();
  readonly type = input.required<TERMS_AND_CONDITIONS_ID>();
  readonly field = model.required<FormControl>();

  handledTermClick(ev: MouseEvent) {
    const isAccepted = this.field().value;
    if (!isAccepted) {
      this.open(ev);
    } else {
      // this is required because primeng not tracking immediate update
      setTimeout(() => {
        this.field().setValue(false);
      });
    }
  }

  open(ev: MouseEvent) {
    ev.stopPropagation();
    const ref = this.dialog.open(TermsAndConditionsContent, {
      header: false,
      maxWidth: '90vw',
      width: '1000px',
      maxHeight: '75svh',
      height: '600px',
      data: { type: this.type() },
      containerClassNames: ['tnc_custom_class'],
    });

    ref.afterClosed.subscribe(res => {
      this.field().setValue(res ? true : false);
    });
  }
}
