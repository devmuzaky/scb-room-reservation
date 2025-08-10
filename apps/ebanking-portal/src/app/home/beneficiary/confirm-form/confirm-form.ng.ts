import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@/core/components';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Autofocus } from '@scb/ui/a11y';
import { Button } from '@scb/ui/button';
import { Icon } from '@scb/ui/icon';
import { DialogRef } from '@scb/ui/portal';
import { BeneficiaryData } from '../beneficiary.data';
import { AddBeneficiaryFormData, BankOfBeneficiary } from '../models/models';

@Component({
  selector: 'beneficiary-confirm-form',
  templateUrl: './confirm-form.ng.html',
  providers: [ToasterService],
  imports: [Button, Icon, TranslocoDirective, Autofocus],
  host: {
    class: 'flex flex-col',
  },
})
export class ConfirmAddBeneficiaryFormComponent {
  readonly diaRef = inject(DialogRef);
  readonly router = inject(Router);
  readonly toasterService = inject(ToasterService);
  readonly beneficiaryData = inject(BeneficiaryData);
  readonly layoutFacade = inject(LayoutFacadeService);

  readonly isArabic = computed(() => this.layoutFacade.isArabic());
  readonly data = this.diaRef.options.data.formData as AddBeneficiaryFormData;
  readonly inside = this.diaRef.options.data.inside as boolean;
  readonly outside = this.diaRef.options.data.outside as boolean;
  readonly foundBank = this.diaRef.options.data.foundBank as BankOfBeneficiary;
  readonly translateService = inject(TranslocoService);

  confirm() {
    this.beneficiaryData
      .validateAndAddBeneficiary(this.data, { outside: this.outside, validate: false })
      .subscribe(response => {
        if (response.status === 'success') {
          this.diaRef.closeAll();
          this.router.navigate(['/beneficiary']);
          this.toasterService.showSuccess({
            severity: 'success',
            summary: this.translateService.translate('beneficiary.addForm.success.title'),
            detail: this.translateService.translate('beneficiary.addForm.success.subTitle'),
          });
        } else {
          this.toasterService.showError({
            severity: 'error',
            summary: this.translateService.translate('beneficiary.addForm.error.title'),
            detail: this.translateService.translate('beneficiary.addForm.error.subTitle'),
          });
        }
      });
  }

  close() {
    this.diaRef.close();
  }
}
