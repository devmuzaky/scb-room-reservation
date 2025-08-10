import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  model,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectFooter, SelectValue } from '@/core/components';
import { isEqual } from '@/core/utils/utils';
import { TranslocoDirective } from '@jsverse/transloco';
import { FormField, ScbInput } from '@scb/ui/form-field';
import { Icon } from '@scb/ui/icon';
import { Option, Select, SelectTrigger } from '@scb/ui/select';
import { ScbDate } from '@scb/util/datepicker';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TransactionsHistoryData } from '../transactions-history/transactions-history';

@Component({
  selector: 'app-pending-approval-filter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TransactionsHistoryData],
  imports: [
    BreadcrumbModule,
    FormField,
    Select,
    Option,
    ScbInput,
    SelectTrigger,
    SelectValue,
    SelectFooter,
    TranslocoDirective,
    FormsModule,
    FormsModule,
    RadioButtonModule,
    Icon,
  ],
  template: `
    @if (!isEmpty() || showClearFilter()) {
      <div
        class="gap-md flex flex-row items-center overflow-auto px-4 py-0.5 whitespace-nowrap"
        data-testid="APPROVALS_FILTER_CONTAINER"
        *transloco="let t">
        <div>
          <p
            class="mf-md flex-1"
            data-testid="APPROVALS_FILTER_BY">
            {{ t('filterBy') }}:
          </p>
        </div>

        <div class="gap-md flex flex-1">
          <!-- Settlement Date -->
          <scb-form-field
            [variant]="_dateRange() ? 'primary' : 'ghost'"
            class="bg-white-custom [&>.input-main]:w-max"
            data-testid="CHEQUES_OUT_FORMFIELD_DATE">
            <scb-select
              [(value)]="_dateRange"
              data-testid="CHEQUES_OUT_SELECT_DATE_VALUE"
              [searchPlaceholder]="t('searchOptions')"
              (closed)="dateClosed()"
              noAutoClose>
              <div class="select-header body-md-s px-md">{{ t('datepicker.durations') }}</div>
              <app-select-value
                scbSelectTrigger
                [placeholder]="t('date')"
                [len]="_dateRange() ? 1 : 0" />

              @for (item of settlementDateList; track item.name) {
                <scb-option [value]="item.value">
                  <div class="gap-lg flex items-center">
                    <p-radiobutton
                      name="pizza"
                      [value]="item.value"
                      [(ngModel)]="_dateRange"
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
                (resetValue)="_dateRange.set('')" />
            </scb-select>
          </scb-form-field>

          <!-- Status -->
          <scb-form-field
            [variant]="_transferType().length ? 'primary' : 'ghost'"
            class="bg-white-custom [&>.input-main]:w-max"
            data-testid="APPROVALS_FORMFIELD_STATUS">
            <scb-select
              #transferTypeSelect
              [options]="transferTypeList()"
              [filterFn]="transferTypeFn"
              [(value)]="_transferType"
              multiple
              data-testid="TRANSACTIONS_HISTORY_SELECT_TRANSFER_TYPE_VALUE"
              [searchPlaceholder]="t('searchOptions')"
              (closed)="transferTypeClosed()"
              noAutoClose>
              <app-select-value
                scbSelectTrigger
                [placeholder]="t('transferType')"
                [len]="_transferType().length" />
              @for (item of transferTypeSelect.optionsFilter.filteredList(); track item) {
                <scb-option [value]="item.value">
                  {{ item.name }}
                </scb-option>
              }
              <app-select-footer
                class="select-footer"
                (apply)="apply()"
                (resetValue)="_transferType.set([])" />
            </scb-select>
          </scb-form-field>
          <div class="flex-1"></div>
          <scb-form-field mode="search">
            <icon
              name="search-normal"
              class="prefix text-input-icon-enabled" />
            <input
              scbInput
              placeholder="Search for..." />
          </scb-form-field>
        </div>
      </div>
    }
  `,
})
export class PendingApprovalFilter {
  readonly transferType = model<any[]>([]);
  // readonly transferTypeList = input<any[]>([]);
  readonly scheduledTransfersData = inject(TransactionsHistoryData);
  readonly dateRange = model<string>('');
  readonly isEmpty = input(false);
  readonly _dateRange = linkedSignal(this.dateRange);
  readonly transferTypeFn = (option: StatusOptions<TransactionsTransferTypes>) => option.name;

  readonly _transferType = linkedSignal(this.transferType);
  readonly transferTypeSelect = viewChild<Select<string>>('transferTypeSelect');
  readonly showClearFilter = computed(() => this.transferType().length);

  readonly transferTypeList = computed(() => {
    return this.scheduledTransfersData
      .transferTypes()
      .filter(item => item.key !== 'CHARITY')
      .map(item => ({
        name: item.value,
        value: item.key as TransactionsTransferTypes,
      }));
  });

  readonly settlementDateList = [
    {
      name: 'Last 7 days',
      value: [ScbDate.cairo().subtract(7, 'days').format('YYYY-MM-DD'), ScbDate.cairo().format('YYYY-MM-DD')].join(','),
    },
    {
      name: 'Last 30 days',
      value: [ScbDate.cairo().subtract(30, 'days').format('YYYY-MM-DD'), ScbDate.cairo().format('YYYY-MM-DD')].join(
        ',',
      ),
    },
    {
      name: 'Last 90 days',
      value: [ScbDate.cairo().subtract(90, 'days').format('YYYY-MM-DD'), ScbDate.cairo().format('YYYY-MM-DD')].join(
        ',',
      ),
    },
  ];

  readonly filterLCType = (option: any) => option.value;

  clearFilter() {
    this.transferType.set([]);
  }

  apply() {
    this.transferType.set(this._transferType());
  }

  transferTypeClosed() {
    if (!isEqual(this.transferType(), this._transferType())) {
      this._transferType.set(this.transferType());
    }
  }

  dateClosed() {
    if (this.dateRange() !== this._dateRange()) {
      this._dateRange.set('');
    }
  }
}
export type TransactionsTransferTypes = 'OWN' | 'INSIDE' | 'OUTSIDE';

export interface StatusOptions<T> {
  name: string;
  value: T;
}
