import { CurrencyPipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  model,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Avatar } from '@scb/ui/avatar';
import { CurrencyInput, FormField } from '@scb/ui/form-field';
import { Option, Select } from '@scb/ui/select';
import { Separator } from '@scb/ui/separator';
import { ExchangeRateWithFlags } from './exchange-rate.service';

@Component({
  selector: 'app-currency-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CurrencyPipe],
  imports: [FormField, Select, Option, Avatar, Separator, NgClass, CurrencyInput, FormsModule],
  template: `<scb-form-field class="[&>.input-main]:h-[52px]">
    <div class="gap-md flex items-center">
      <input
        scbCurrencyInput
        [decimals]="decimals()"
        [maxLength]="length()"
        #inputEl
        [(ngModel)]="value"
        class="order-none flex-1"
        [ngClass]="readonly() ? 'text-input-text-disabled' : ''"
        [attr.readonly]="readonly() || undefined"
        [attr.data-testid]="valueTestId()" />
      <scb-separator class="h-2xl bg-border-primary w-[1px]" />
      <div class="flex flex-1 justify-end">
        <scb-select
          #select="scbSelect"
          [(value)]="selectedCurrency"
          [options]="rates()"
          [filterFn]="filterFn"
          searchPlaceholder="Search for..."
          [attr.data-testid]="testId()">
          <div
            scbSelectTrigger
            class="gap-sm body-sm-s text-input-text-field flex items-center">
            <scb-avatar
              [src]="selectedRate().flagSrc"
              class="!h-2xl !w-2xl" />{{ selectedRate().currencyName }}
          </div>
          @for (item of select.optionsFilter.filteredList(); track item) {
            @if (skipCurrency().currencyName !== item.currencyName) {
              <scb-option [value]="item.currencyName">
                <div class="gap-lg flex items-center">
                  <scb-avatar
                    [src]="item.flagSrc"
                    class="!h-xl !w-xl" />{{ item.currencyName }}
                </div>
              </scb-option>
            }
          }
        </scb-select>
      </div>
    </div>
  </scb-form-field>`,
})
export class CurrencyField {
  readonly currencyPipe = inject(CurrencyPipe);
  readonly inputEl = viewChild.required<ElementRef<HTMLInputElement>>('inputEl');
  readonly rates = input.required<ExchangeRateWithFlags[]>();
  readonly selectedCurrency = model.required<string>();
  readonly skipCurrency = input.required<ExchangeRateWithFlags>();
  readonly value = model.required<number>();
  readonly readonly = input(false);
  readonly testId = input.required<string>();
  readonly valueTestId = input.required<string>();
  readonly decimals = input<number>(2);
  readonly length = input<number>();

  readonly selectedRate = computed(() => {
    return this.rates().find(x => x.currencyName === this.selectedCurrency())!;
  });

  readonly filterFn = (option: ExchangeRateWithFlags) => option.currencyName;
}
