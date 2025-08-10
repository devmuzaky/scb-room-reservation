import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectFooter, SelectValue } from '@/core/components';
import { isEqual } from '@/utils/utils';
import { TranslocoDirective } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { FormField } from '@scb/ui/form-field';
import { Option, Select, SelectTrigger } from '@scb/ui/select';
import { ScbDate } from '@scb/util/datepicker';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { Bank, ChequesInTypes } from '../dashboard/widgets/cheque-in/model';
import { ChequesInData } from './cheques-in';

export interface StatusOptions<T> {
  name: string;
  value: T;
}

@Component({
  selector: 'app-cheques-in-filter',
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
    SelectValue,
  ],
  templateUrl: './cheques-in-filter.ng.html',
})
export class ChequesInFilter {
  readonly chequesIn = inject(ChequesInData);
  readonly status = model<ChequesInTypes[]>([]);
  readonly settlementDate = model<string>('');
  readonly draweeBank = model<string[]>([]);

  readonly _status = linkedSignal(this.status);
  readonly _settlementDate = linkedSignal(this.settlementDate);
  readonly _draweeBank = linkedSignal(this.draweeBank);

  readonly statusList = signal<StatusOptions<ChequesInTypes>[]>([
    { name: 'collected', value: 'collected' },
    { name: 'returned', value: 'returned' },
    { name: 'postdated', value: 'postdated' },
    { name: 'others', value: 'unknown' },
  ]);
  readonly statusFn = (option: StatusOptions<ChequesInTypes>) => option.name;
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
  readonly showClearFilter = computed(() => this.status().length || this.settlementDate() || this.draweeBank().length);
  readonly bankFn = (option: Bank) => option.name;

  clearFilter() {
    this.status.set([]);
    this.settlementDate.set('');
    this.draweeBank.set([]);
  }

  apply() {
    this.status.set(this._status());
    this.settlementDate.set(this._settlementDate());
    this.draweeBank.set(this._draweeBank());
  }

  statusClosed() {
    if (!isEqual(this._status(), this.status())) {
      this._status.set(this.status());
    }
  }

  dateClosed() {
    if (this.settlementDate() !== this._settlementDate()) {
      this._settlementDate.set('');
    }
  }

  bankClosed() {
    if (!isEqual(this._draweeBank(), this.draweeBank())) {
      this._draweeBank.set(this.draweeBank());
    }
  }
}
