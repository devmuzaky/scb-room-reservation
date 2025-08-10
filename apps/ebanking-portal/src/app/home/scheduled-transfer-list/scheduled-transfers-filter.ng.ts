import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal, model, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectFooter, SelectValue } from '@/core/components';
import { TransactionsStatusTypes, TransactionsTransferTypes } from '@/home/transactions-history/model';
import { isEqual } from '@/utils/utils';
import { TranslocoDirective } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { FormField, ScbInput } from '@scb/ui/form-field';
import { Icon } from '@scb/ui/icon';
import { Option, Select, SelectTrigger } from '@scb/ui/select';
import { ScbDate } from '@scb/util/datepicker';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { TransactionsHistoryData } from '../transactions-history/transactions-history';

export interface StatusOptions<T> {
  name: string;
  value: T;
}

@Component({
  selector: 'scheduled-transfers-filter',
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
  ],
  templateUrl: './scheduled-transfers-filter.ng.html',
})
export class ScheduledTransfersFilter {
  readonly scheduledTransfersData = inject(TransactionsHistoryData);
  readonly status = model<TransactionsStatusTypes[]>([]);
  readonly settlementDate = model<string>('');
  readonly transferType = model<TransactionsTransferTypes[]>([]);
  readonly searchTerm = model<string>('');
  readonly transferTypeSelect = viewChild<Select<string>>('transferTypeSelect');
  readonly _status = linkedSignal(this.status);
  readonly _settlementDate = linkedSignal(this.settlementDate);
  readonly _transferType = linkedSignal(this.transferType);
  readonly _searchTerm = linkedSignal(this.searchTerm);

  readonly transferTypeList = computed(() => {
    return this.scheduledTransfersData
      .transferTypes()
      .filter(item => item.key !== 'CHARITY')
      .map(item => ({
        name: item.value,
        value: item.key as TransactionsTransferTypes,
      }));
  });

  readonly statusFn = (option: StatusOptions<TransactionsStatusTypes>) => option.name;
  readonly transferTypeFn = (option: StatusOptions<TransactionsTransferTypes>) => option.name;

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

  readonly showClearFilter = computed(
    () => this.status().length || this.settlementDate() || this.transferType().length,
  );

  clearFilter() {
    this.status.set([]);
    this.settlementDate.set('');
    this.transferType.set([]);
    this.searchTerm.set('');
    this.transferTypeSelect()?.close();
  }

  apply() {
    this.status.set(this._status());
    this.settlementDate.set(this._settlementDate());
    this.transferType.set(this._transferType());
    this.searchTerm.set(this._searchTerm());
    this.transferTypeSelect()?.close();
  }

  statusClosed() {
    if (!isEqual(this._status(), this.status())) {
      this._status.set(this.status());
    }
  }

  dateClosed() {
    if (this.settlementDate() !== this._settlementDate()) {
      this._settlementDate.set(this.settlementDate());
    }
  }

  transferTypeClosed() {
    if (!isEqual(this._transferType(), this.transferType())) {
      this._transferType.set(this.transferType());
    }
  }
}
