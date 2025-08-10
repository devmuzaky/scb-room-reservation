import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { Icon } from '@scb/ui/icon';
import { Registration } from './registration';

@Component({
  selector: 'app-registration-feature',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [],
  imports: [Button, Icon, TranslocoDirective],
  template: ` <!-- Page -->
    <div
      class="leading-4xl gap-2xl mb-2xl flex flex-col items-center justify-center"
      *transloco="let t; prefix: 'registration'">
      <div class="gap-md mb-2 flex flex-col items-center">
        <icon
          class="w-full max-w-[164px] min-w-[72px] sm:w-[164px] 2xl:w-[72px]"
          name="bankbuilding"
          data-testid="REG_FEATURE_BUILDING_ICON" />
      </div>
      <p
        data-testid="REG_H4_FEATURE_TEXT"
        class="mf-2xl sm:mf-3xl text-center font-semibold">
        {{ t('bankFeaturesTitle') }}
      </p>
    </div>

    <div
      class="gap-2xl sm:px-4xl sm:py-2xl mb-12 flex flex-col"
      *transloco="let t; prefix: 'registration'">
      <!-- lower section -->
      <div class="flex items-center gap-3">
        <div class="p-md bg-icon-container text-icon-brand h-5xl w-5xl flex-none rounded-full">
          <icon
            [name]="'people'"
            data-testid="REG_PEOPLE_ICON" />
        </div>
        <div class="flex flex-col">
          <p
            class="text-text-primary mf-md font-semibold"
            data-testid="REG_ACCOUNT_FEATURE_H4_TEXT">
            {{ t('regAccountTitle') }}
          </p>
          <p
            data-testid="REG_ACCOUNT_FEATURE_P_TEXT"
            class="text-text-secondary mf-md mt-1 flex flex-col font-normal">
            {{ t('regAccountDesc') }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <div class="p-md bg-icon-container text-icon-brand h-5xl w-5xl flex-none rounded-full">
          <icon
            [name]="'cheque'"
            data-testid="REG_CHEQUE_ICON" />
        </div>
        <div class="flex flex-col">
          <p
            class="text-text-primary mf-md flex flex-col font-semibold"
            data-testid="REG_CHEQUE_FEATURE_H4_TEXT">
            {{ t('chequeTitle') }}
          </p>
          <p
            class="text-text-secondary mf-md mt-1 flex flex-col font-normal"
            data-testid="REG_CHEQUE_FEATURE_P_TEXT">
            {{ t('chequeDesc') }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <div class="p-md bg-icon-container text-icon-brand h-5xl w-5xl flex-none rounded-full">
          <icon
            [name]="'creditcard'"
            data-testid="REG_CREDIT_CARD_ICON" />
        </div>
        <div class="flex flex-col">
          <p
            class="text-text-primary mf-md flex flex-col font-semibold"
            data-testid="REG_CREDIT_FEATURE_H4_TEXT">
            {{ t('creditCardTitle') }}
          </p>
          <p
            class="text-text-secondary mf-md mt-1 flex flex-col font-normal"
            data-testid="REG_CREDIT_FEATURE_P_TEXT">
            {{ t('creditCardDesc') }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <div class="p-md bg-icon-container text-icon-brand h-5xl w-5xl flex-none rounded-full">
          <icon
            [name]="'users'"
            data-testid="REG_USERS_ICON" />
        </div>
        <div class="flex flex-col">
          <p
            class="text-text-primary mf-md flex flex-col font-semibold"
            data-testid="REG_APPROVAL_FEATURE_H4_TEXT">
            {{ t('userApprovalTitle') }}
          </p>
          <p
            class="text-text-secondary mf-md mt-1 flex flex-col font-normal"
            data-testid="REG_APPROVAL_FEATURE_P_TEXT">
            {{ t('userApprovalDesc') }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <div class="p-md bg-icon-container text-icon-brand h-5xl w-5xl flex-none rounded-full">
          <icon
            [name]="'statement'"
            data-testid="REG_STATEMENT_ICON" />
        </div>
        <div class="flex flex-col">
          <p
            class="text-text-primary mf-md flex flex-col font-semibold"
            data-testid="REG_STATEMENT_FEATURE_H4_TEXT">
            {{ t('accountStatementTitle') }}
          </p>
          <p
            class="text-text-secondary mf-md mt-1 flex flex-col font-normal"
            data-testid="REG_STATEMENT_FEATURE_P_TEXT">
            {{ t('accountStatementDesc') }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <div class="p-md bg-icon-container text-icon-brand h-5xl w-5xl flex-none rounded-full">
          <icon
            [name]="'24hours'"
            data-testid="REG_24HOURS_ICON" />
        </div>
        <div class="flex flex-col">
          <p
            class="text-text-primary mf-md flex flex-col font-semibold"
            data-testid="REG_ACCESS_FEATURE_H4_TEXT">
            {{ t('accountAccessTitle') }}
          </p>
          <p
            class="text-text-secondary mf-md mt-1 flex flex-col font-normal"
            data-testid="REG_ACCESS_FEATURE_P_TEXT">
            {{ t('accountAccessDesc') }}
          </p>
        </div>
      </div>

      <div class="pt-lg pb-2xl fixed bottom-0 left-0 flex w-full bg-gray-50 dark:bg-gray-950">
        <div class="page-grid">
          <button
            scbButton
            size="lg"
            type="button"
            class="col-span-4 sm:col-start-2 2xl:col-start-5"
            data-testid="REG_GET_STARTED"
            (click)="getStarted()">
            {{ t('getStartedNow') }}
          </button>
        </div>
        <div></div>
      </div>
    </div>`,
})
export class RegistrationFeatureComponent {
  readonly reg = inject(Registration);

  getStarted(): void {
    this.reg.next();
  }
}
