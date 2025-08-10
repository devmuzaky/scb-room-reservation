import { ChangeDetectionStrategy, Component, computed, linkedSignal, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectFooter, SelectValue } from '@/core/components';
import { isEqual } from '@/core/utils/utils';
import { TranslocoDirective } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { FormField } from '@scb/ui/form-field';
import { Option, Select, SelectTrigger } from '@scb/ui/select';
import { ScbDate } from '@scb/util/datepicker';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { StatusOptions } from '../cheques-in/cheques-in-filter.ng';
import { ChequesOutStatus } from '../dashboard/widgets/cheque-out/model';

@Component({
  selector: 'app-cheques-out-filter',
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
    FormsModule,
    Button,
    SelectModule,
    FormsModule,
    MultiSelectModule,
  ],
  templateUrl: './cheques-out-filter.ng.html',
})
export class ChequesOutFilter {
  readonly status = model<ChequesOutStatus[]>([]);
  readonly settlementDate = model<string>('');

  readonly _status = linkedSignal(this.status);
  readonly _settlementDate = linkedSignal(this.settlementDate);

  readonly statusList = signal<StatusOptions<ChequesOutStatus>[]>([
    { name: 'Deducted', value: 'Deducted' },
    { name: 'Returned', value: 'Returned' },
    { name: 'others', value: 'Unknown' },
  ]);
  readonly statusFn = (option: StatusOptions<ChequesOutStatus>) => option.name;
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
  readonly showClearFilter = computed(() => this.status().length || this.settlementDate());

  clearFilter() {
    this.status.set([]);
    this.settlementDate.set('');
  }

  apply() {
    this.status.set(this._status());
    this.settlementDate.set(this._settlementDate());
  }

  statusClosed() {
    if (!isEqual(this.status(), this._status())) {
      this._status.set([]);
    }
  }

  dateClosed() {
    if (this.settlementDate() !== this._settlementDate()) {
      this._settlementDate.set('');
    }
  }
}
