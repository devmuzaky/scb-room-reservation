import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ScbMaxLengthDirective } from '@/core/directives/max-length.directive';
import { CURRENCY_FLAG } from '@/home/dashboard/model/constants';
import { TranslocoDirective } from '@jsverse/transloco';
import { Avatar } from '@scb/ui/avatar';
import { CurrencyInput, Error, FormField, Hint, Label } from '@scb/ui/form-field';
import { Icon } from '@scb/ui/icon';

@Component({
  selector: 'app-currency-input-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormField,
    Icon,
    CurrencyInput,
    ScbMaxLengthDirective,
    Error,
    ReactiveFormsModule,
    Avatar,
    Label,
    Hint,
    TranslocoDirective,
  ],
  template: ` <scb-form-field
    *transloco="let t; prefix: 'transfer.currencyField'"
    class="[&>.input-main]:gap-md w-full">
    <div class="prefix gap-sm flex items-center">
      <scb-avatar
        [src]="flag()"
        size="16" />
      <span class="text-input-text-supporting body-label-md">{{ currency() }}</span>
      <div class="bg-border-primary h-2xl w-[1px] flex-none ltr:ml-1 rtl:mr-1"></div>
    </div>
    <label scbLabel>{{ placeholder() }}</label>
    <input
      scbCurrencyInput
      [decimals]="2"
      [formControl]="control()"
      [scbMaxLength]="20"
      (focus)="focused.emit('focus')"
      [readOnly]="isReadonly()" />
    @if (hint(); as h) {
      <p scbHint>
        {{ t('hint') }} <span class="ltr-force font-semibold"> {{ h }}</span>
      </p>
    } @else if (mainHint()) {
      <p scbHint>{{ mainHint() }}</p>
    }
    <icon
      name="info-circle"
      data-testid="beneficiary_icon_empty"
      class="suffix text-input-icon-enabled w-5" />
    <p scbError="required">{{ t('required') }}</p>
    <p scbError="!required && min">{{ minError() || t('minAmountError') }}</p>
    <p scbError="!required && !min && max">{{ t('insufficientBalance') }}</p>
    <p scbError="insufficientBalance">{{ t('insufficientBalance') }}</p>
  </scb-form-field>`,
  host: {
    class: 'block w-full',
  },
})
export class CurrencyInputField {
  readonly control = input.required<FormControl>();
  readonly currency = input.required<string>();
  readonly hint = input<string>();
  readonly mainHint = input<string>();
  readonly placeholder = input<string>();
  readonly isReadonly = input(false);
  readonly minError = input<string>();

  readonly focused = output<string>();

  readonly flag = computed(() => `icons/countries/${CURRENCY_FLAG[this.currency()]}.svg`);
}
