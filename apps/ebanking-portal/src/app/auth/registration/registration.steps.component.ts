import { ChangeDetectionStrategy, Component, inject, signal, TemplateRef, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiError } from '@/models/api';
import { TranslocoDirective } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { Card } from '@scb/ui/card';
import { dialogPortal } from '@scb/ui/dialog';
import { Icon } from '@scb/ui/icon';
import { ForgetPassword } from '../forget-password/forget-password';
import { ForgetPasswordService } from '../forget-password/forget-password.service';
import { Registration } from './registration';
import { RegistrationService } from './registration.service';

@Component({
  selector: 'app-registration-steps',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ForgetPassword, ForgetPasswordService],
  imports: [Card, Icon, Button, TranslocoDirective, RouterLink],
  template: `
    <scb-card
      class="px-xl py-3xl sm:p-6"
      *transloco="let t; prefix: 'registration'">
      <h4
        class="head-lg-s mb-4 px-6 text-center"
        data-testid="REG_STEPS_DESC">
        {{ t('registrationStepDesc') }}
      </h4>
      <div class="gap-2xl flex flex-col"></div>

      <div class="gap-2xl body-label-md-m flex flex-col">
        <div class="gap-lg flex items-center">
          <div class="p-md bg-icon-container text-icon-brand h-5xl w-5xl flex-none rounded-full">
            <icon
              [name]="'print'"
              data-testid="REG_STEPS_PRINT_ICON" />
          </div>
          <div class="flex flex-col 2xl:flex-row">
            <h4
              class="body-label-md-m items-center"
              data-testid="REG_STEPS_PRINT_FORM_H4_DESC">
              {{ t('printForm') }}
            </h4>
            <div class="body-sm-s items-center justify-center">
              <button
                scbButton
                variant="ghost"
                size="xs"
                icon="download"
                (click)="generatePDF()"
                data-testid="REG_STEPS_PRINT_BUTTON">
                {{ t('download') }}
              </button>
            </div>
          </div>
        </div>

        <div class="gap-lg flex items-center">
          <div class="p-md bg-icon-container text-icon-brand h-5xl w-5xl flex-none rounded-full">
            <icon
              [name]="'form'"
              data-testid="REG_STEPS_FORM_ICON" />
          </div>

          <h4
            class="text-text-primary flex flex-col items-start gap-1 md:flex-row md:items-center"
            data-testid="REG_STEPS_FORM_H4_DESC">
            {{ t('fillForm') }}
          </h4>
        </div>

        <div class="gap-lg flex items-center">
          <div class="p-md bg-icon-container text-icon-brand h-5xl w-5xl flex-none rounded-full">
            <icon
              [name]="'signature'"
              data-testid="REG_STEPS_SIGNATURE_ICON" />
          </div>
          <div class="flex flex-col 2xl:flex-row">
            <h4
              class="text-text-primary"
              data-testid="REG_STEPS_SIGNATURE_H4_DESC">
              {{ t('signature') }}
            </h4>
            <button
              scbButton
              variant="ghost"
              size="xs"
              class="gap-md justify-start"
              (click)="openDialog()"
              data-testid="REG_STEPS_OPEN_DIALOG_BUTTON">
              {{ t('needHelp') }}
            </button>
          </div>
        </div>

        <div class="gap-lg flex items-center">
          <div class="p-md bg-icon-container text-icon-brand h-5xl w-5xl flex-none rounded-full">
            <icon
              [name]="'building'"
              data-testid="REG_STEPS_BUILDING_ICON" />
          </div>
          <div class="flex flex-col 2xl:flex-row">
            <h4
              class="text-text-primary"
              data-testid="REG_STEPS_SEND_FORM_H4_DESC">
              {{ t('sendForm') }}
            </h4>
            <a
              scbButton
              variant="ghost"
              size="xs"
              class="gap-md justify-start"
              routerLink="/locate-us"
              data-testid="REG_STEPS_NEAR_BRANCH_DESC">
              {{ t('nearestBranch') }}
            </a>
          </div>
        </div>

        <div class="body-lg text-text-secondary test-alert-body"></div>
      </div>
    </scb-card>
    <ng-template #imageTemp>
      <div
        class="flex flex-1 items-center justify-center"
        *transloco="let t; prefix: 'registration'">
        <h4
          class="head-xs-s 2xl:head-sm-s gap-lg mb-4 pr-6 text-center"
          data-testid="REG_STEPS_FORM_HINT_DESC">
          {{ t('signDoc') }}
        </h4>
      </div>
      <img
        [src]="'icons/signature-container.svg'"
        alt="No Image"
        data-testid="REG_STEPS_NO_IMAGE" />
    </ng-template>
  `,
})
export class RegistrationStepsComponent {
  readonly reg = inject(Registration);
  private readonly alert = dialogPortal();
  private imageTemp = viewChild.required('imageTemp', { read: TemplateRef });
  readonly regService = inject(RegistrationService);
  readonly loading = signal(false);
  private readonly fileName = 'RegistrationForm.pdf';

  openDialog(): void {
    this.alert.open(this.imageTemp(), {
      width: '598px',
      maxHeight: '275px',
    });
  }

  downloadPDF(base64: string): void {
    const byteArray = new Uint8Array(
      window
        .atob(base64)
        .split('')
        .map(char => char.charCodeAt(0)),
    );
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = this.fileName;
    a.click();
  }

  generatePDF(): void {
    this.loading.set(true);
    this.regService.generatePDF({ companyId: this.reg.companyId(), token: this.reg.otpToken }).subscribe({
      next: ({ file }) => {
        this.loading.set(false);
        this.downloadPDF(file);
      },
      error: (error: ApiError) => {
        this.loading.set(false);
      },
    });
  }
}
