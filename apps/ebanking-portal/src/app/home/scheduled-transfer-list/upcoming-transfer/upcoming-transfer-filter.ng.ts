import { ChangeDetectionStrategy, Component, computed, input, linkedSignal, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectFooter, SelectValue } from '@/core/components';
import { TranslocoDirective } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { FormField } from '@scb/ui/form-field';
import { Option, Select } from '@scb/ui/select';
import { ScbDate } from '@scb/util/datepicker';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-upcoming-transfer-filter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BreadcrumbModule,
    FormField,
    TranslocoDirective,
    FormsModule,
    Button,
    Select,
    Option,
    RadioButtonModule,
    SelectValue,
    SelectFooter,
  ],
  template: `
    @if (!isEmpty() || showClearFilter()) {
      <div
        class="gap-md flex flex-row items-center overflow-auto px-4 py-0.5 whitespace-nowrap"
        data-testid="LCS_FILTER_CONTAINER"
        *transloco="let t">
        <div>
          <p
            class="mf-md flex-1"
            data-testid="LCS_FILTER_BY">
            {{ t('filterBy') }}:
          </p>
        </div>

        <div class="gap-md flex">
          <!-- date -->
          <scb-form-field
            [variant]="_date() ? 'primary' : 'ghost'"
            class="bg-white-custom [&>.input-main]:w-max"
            data-testid="CHEQUES_IN_FORMFIELD_DATE">
            <scb-select
              [(value)]="_date"
              data-testid="CHEQUES_IN_SELECT_DATE_VALUE"
              [searchPlaceholder]="t('searchOptions')"
              (closed)="dateClosed()"
              noAutoClose>
              <div class="select-header body-md-s px-md">{{ t('datepicker.durations') }}</div>
              <app-select-value
                scbSelectTrigger
                [placeholder]="t('date')"
                [len]="_date() ? 1 : 0" />

              @for (item of settlementDateList; track item.name) {
                <scb-option [value]="item.value">
                  <div class="gap-lg flex items-center">
                    <p-radiobutton
                      name="pizza"
                      [value]="item.value"
                      [(ngModel)]="_date"
                      inputId="ingredient{{ $index }}" />
                    <label
                      for="ingredient{{ $index }}"
                      class="body-md cursor-pointer">
                      {{ t('datepicker.' + item.name) }}
                    </label>
                  </div>
                </scb-option>
              }
              <app-select-footer
                class="select-footer"
                (apply)="apply()"
                (resetValue)="_date.set('')" />
            </scb-select>
          </scb-form-field>
          @if (showClearFilter()) {
            <button
              scbButton
              size="md"
              variant="secondary"
              (click)="clearFilter()">
              {{ t('clearFilter') }}
            </button>
          }
        </div>
      </div>
    }
  `,
})
export class UpcomingTransferFilter {
  readonly date = model<string>('');
  readonly isEmpty = input(false);

  readonly _date = linkedSignal(this.date);
  readonly showClearFilter = computed(() => this.date());
  readonly settlementDateList = [
    {
      name: 'Next 7 days',
      value: [ScbDate.cairo().format('DD-MM-YYYY'), ScbDate.cairo().add(7, 'days').format('DD-MM-YYYY')].join(','),
    },
    {
      name: 'Next Month',
      value: [ScbDate.cairo().format('DD-MM-YYYY'), ScbDate.cairo().add(30, 'days').format('DD-MM-YYYY')].join(','),
    },
    {
      name: 'Next 3 Months',
      value: [ScbDate.cairo().format('DD-MM-YYYY'), ScbDate.cairo().add(90, 'days').format('DD-MM-YYYY')].join(','),
    },
  ];

  clearFilter() {
    this.date.set('');
  }

  apply() {
    this.date.set(this._date());
  }

  dateClosed() {
    if (this.date() !== this._date()) {
      this._date.set('');
    }
  }
}
