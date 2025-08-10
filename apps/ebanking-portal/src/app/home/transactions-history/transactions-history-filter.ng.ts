import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  model,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectFooter, SelectValue } from '@/core/components';
import {
  DateRangeOption,
  StatusOptions,
  TransactionsStatusTypes,
  TransactionsTransferTypes,
} from '@/home/transactions-history/model';
import { isEqual } from '@/utils/utils';
import { TranslocoDirective } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { ScbDatepickerComponent } from '@scb/ui/datepicker';
import { FormField, ScbInput } from '@scb/ui/form-field';
import { Icon } from '@scb/ui/icon';
import { Option, Select, SelectTrigger } from '@scb/ui/select';
import { ScbDate } from '@scb/util/datepicker';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { TransactionsHistoryData } from './transactions-history';

@Component({
  selector: 'app-transactions-history-filter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BreadcrumbModule,
    FormField,
    Select,
    Option,
    SelectTrigger,
    SelectValue,
    SelectFooter,
    TranslocoDirective,
    RadioButtonModule,
    Button,
    SelectModule,
    FormsModule,
    MultiSelectModule,
    Icon,
    ScbInput,
    ScbDatepickerComponent,
  ],
  templateUrl: './transactions-history-filter.ng.html',
})
export class TransactionsHistoryFilter {
  /* ─────────────────────────── signals & state ─────────────────────────── */

  readonly transactionsData = inject(TransactionsHistoryData);

  readonly status = model<TransactionsStatusTypes[]>([]);
  readonly settlementDate = model<string>('');
  readonly transferType = model<TransactionsTransferTypes[]>([]);
  readonly searchTerm = model<string>('');

  readonly _status = linkedSignal(this.status);
  readonly _settlementDate = linkedSignal(this.settlementDate);
  readonly _transferType = linkedSignal(this.transferType);
  readonly _searchTerm = linkedSignal(this.searchTerm);

  /* custom-range picker state */
  readonly isCustomRange = computed(() => this._settlementDate() === 'custom');
  readonly customFromDate = signal<Date | null>(null);
  readonly customToDate = signal<Date | null>(null);
  readonly minDate = computed(() => {
    const currentDate = new Date();
    const threeYearsAgo = new Date(currentDate.getFullYear() - 3, 0, 1);
    return threeYearsAgo;
  });
  readonly maxDate = signal<Date>(new Date());

  /* option lists */
  readonly statusList = signal<StatusOptions<TransactionsStatusTypes>[]>([
    { name: 'completed', value: 'SUCCESS' },
    { name: 'pending', value: 'PENDING' },
    { name: 'failed', value: 'FAILED' },
  ]);

  readonly transferTypeList = computed(() => {
    return this.transactionsData.transferTypes().map(item => ({
      name: item.value,
      value: item.key as TransactionsTransferTypes,
    }));
  });

  readonly statusFn = (o: StatusOptions<TransactionsStatusTypes>) => o.name;
  readonly transferTypeFn = (o: StatusOptions<TransactionsTransferTypes>) => o.name;

  /* date range helper fns */
  private getLastMonthRange(): string {
    const today = ScbDate.cairo();
    const last = today.subtract(1, 'months');
    const firstDay = new Date(last.date().getFullYear(), last.date().getMonth(), 1);
    const lastDay = new Date(last.date().getFullYear(), last.date().getMonth() + 1, 0);
    return [ScbDate.fromDate(firstDay).format('DD-MM-YYYY'), ScbDate.fromDate(lastDay).format('DD-MM-YYYY')].join(',');
  }

  private getLastThreeMonthsRange(): string {
    const today = ScbDate.cairo();
    const older = today.subtract(3, 'months');
    const last = today.subtract(1, 'months');
    const firstDay = new Date(older.date().getFullYear(), older.date().getMonth(), 1);
    const lastDay = new Date(last.date().getFullYear(), last.date().getMonth() + 1, 0);
    return [ScbDate.fromDate(firstDay).format('DD-MM-YYYY'), ScbDate.fromDate(lastDay).format('DD-MM-YYYY')].join(',');
  }

  readonly settlementDateList: DateRangeOption[] = [
    {
      name: 'Last 7 Days',
      value: [ScbDate.cairo().subtract(7, 'days').format('DD-MM-YYYY'), ScbDate.cairo().format('DD-MM-YYYY')].join(','),
    },
    { name: 'Last Month', value: this.getLastMonthRange() },
    { name: 'Last 3 Months', value: this.getLastThreeMonthsRange() },
    { name: 'Custom Range', value: 'custom' },
  ];

  readonly showClearFilter = computed(
    () => this.status().length || this.settlementDate() || this.transferType().length,
  );

  /* ─────────────────────────── UI actions ─────────────────────────── */

  clearFilter(): void {
    this.status.set([]);
    this.settlementDate.set('');
    this.transferType.set([]);
    this.searchTerm.set('');
    this.customFromDate.set(null);
    this.customToDate.set(null);
  }

  apply(): void {
    if (this.isCustomRange() && this.customFromDate() && this.customToDate()) {
      const from = ScbDate.fromDate(this.customFromDate()!).format('DD-MM-YYYY');
      const to = ScbDate.fromDate(this.customToDate()!).format('DD-MM-YYYY');
      this.settlementDate.set(`${from},${to}`);
    } else if (this._settlementDate() !== 'custom') {
      this.settlementDate.set(this._settlementDate());
    }

    this.status.set(this._status());
    this.transferType.set(this._transferType());
    this.searchTerm.set(this._searchTerm());
  }

  statusClosed(): void {
    if (!isEqual(this._status(), this.status())) {
      this._status.set(this.status());
    }
  }

  dateOpened(): void {
    const currentDate = this.settlementDate();
    const isCustomRange =
      currentDate.includes(',') && !this.settlementDateList.some(option => option.value === currentDate);

    if (isCustomRange) {
      this._settlementDate.set('custom');

      const [fromDateStr, toDateStr] = currentDate.split(',');
      if (fromDateStr && toDateStr) {
        try {
          const [fromDay, fromMonth, fromYear] = fromDateStr.split('-').map(str => parseInt(str));
          const [toDay, toMonth, toYear] = toDateStr.split('-').map(str => parseInt(str));

          this.customFromDate.set(new Date(fromYear, fromMonth - 1, fromDay));
          this.customToDate.set(new Date(toYear, toMonth - 1, toDay));
        } catch (error) {
          console.warn('Error parsing custom date range:', error);
          this.customFromDate.set(null);
          this.customToDate.set(null);
        }
      }
    } else {
      this._settlementDate.set(this.settlementDate());
    }
  }

  dateClosed(): void {
    if (this.settlementDate() !== this._settlementDate()) {
      this._settlementDate.set(this.settlementDate());
    }
  }

  transferTypeClosed(): void {
    if (!isEqual(this._transferType(), this.transferType())) {
      this._transferType.set(this.transferType());
    }
  }

  onCustomDateChange(): void {
    if (this.customFromDate() && this.customToDate()) {
      const from = this.customFromDate()!;
      const to = this.customToDate()!;
      if (from > to) {
        this.customFromDate.set(to);
        this.customToDate.set(from);
      }
    }
  }

  resetDateSelection(): void {
    this._settlementDate.set('');
    this.customFromDate.set(null);
    this.customToDate.set(null);
  }
}
