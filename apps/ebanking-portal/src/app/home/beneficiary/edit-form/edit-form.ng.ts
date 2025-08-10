import { NgClass } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToasterService } from '@/core/components';
import { ScbMaxLengthDirective } from '@/core/directives/max-length.directive';
import { maxLengthValidator, noScriptsOrHtmlTagsValidator } from '@/core/validators/custom-validators';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Autofocus } from '@scb/ui/a11y';
import { Button } from '@scb/ui/button';
import { Error, FormField, Hint, Label, ScbInput } from '@scb/ui/form-field';
import { Icon } from '@scb/ui/icon';
import { DialogRef } from '@scb/ui/portal';
import { BeneficiaryData, UpdateBeneficiaryRequest } from '../beneficiary.data';
import { Beneficiary, TransactionMethod } from '../models/models';

@Component({
  selector: 'update-beneficiary-form',
  templateUrl: './edit-form.ng.html',
  providers: [BeneficiaryData, ToasterService],
  imports: [
    TranslocoDirective,
    Icon,
    Hint,
    Error,
    Label,
    Button,
    ScbInput,
    ScbMaxLengthDirective,
    ReactiveFormsModule,
    FormField,
    NgClass,
    Autofocus,
  ],
})
export class UpdateBeneficiaryFormComponent {
  readonly diaRef = inject(DialogRef);
  readonly router = inject(Router);
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly toasterService = inject(ToasterService);

  readonly beneficiaryData = inject(BeneficiaryData);
  readonly data = this.diaRef.options.data.beneficiary as Beneficiary;
  readonly translateService = inject(TranslocoService);
  readonly lang = computed(() => this.layoutFacade.language());

  // Form to manage the form fields
  readonly form = new FormGroup({
    name: new FormControl<string>(
      {
        value: this.data.beneficiaryName,
        disabled: true,
      },
      {
        nonNullable: true,
        validators: [Validators.required, maxLengthValidator(), noScriptsOrHtmlTagsValidator()],
      },
    ),
    nickname: new FormControl<string>(this.data.beneficiaryNickname, {
      nonNullable: true,
      validators: [Validators.required, maxLengthValidator(), noScriptsOrHtmlTagsValidator()],
    }),

    // Non editable fields
    paymentMethod: new FormControl<TransactionMethod>({
      value: this.translateService.translate(
        'beneficiary.editForm.transactionTypeOptions.' + this.data.transactionMethod,
      ),
      disabled: true,
    }),
    beneficiaryNumber: new FormControl({
      value: this.data.beneficiaryNumber,
      disabled: true,
    }),
    bank: new FormControl<string | undefined>(
      {
        value: this.lang() === 'ar' ? this.data.bank?.bankNameAr : this.data.bank?.bankNameEn,
        disabled: true,
      },
      {
        nonNullable: false,
      },
    ),
  });

  confirm() {
    if (this.form.valid) {
      const body: UpdateBeneficiaryRequest = {
        beneficiaryNickname: this.form.value.nickname || '',
      };
      this.beneficiaryData.updateBeneficiary(this.data.beneficiaryId, body).subscribe(
        response => {
          this.diaRef.close(true);
          this.toasterService.showSuccess({
            summary: this.translateService.translate('beneficiary.editForm.success'),
          });
        },
        err => {
          if (err.status === 400) {
            const control = this.form.controls.nickname;
            if (control) {
              control.setErrors({ unique: true, message: err.error.message });
              control.markAsTouched();
            }
          }
        },
      );
    }
  }

  close() {
    this.diaRef.close(false);
  }
}
