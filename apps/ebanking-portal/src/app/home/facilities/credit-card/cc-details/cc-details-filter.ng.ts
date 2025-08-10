import { ChangeDetectionStrategy, Component, computed, input, linkedSignal, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { isEqual } from '@/core/utils/utils';
import { SelectFooter, SelectValue } from '@/home/cheques-in/cheques-in-filter.ng';
import { TranslocoDirective } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { FormField } from '@scb/ui/form-field';
import { Option, Select, SelectTrigger } from '@scb/ui/select';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TransactionStatus } from '../model';

@Component({
  selector: 'app-cc-details-filter',
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
    FormsModule,
    Button,
    FormsModule,
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
          <!-- Status -->
          <scb-form-field
            [variant]="_status().length ? 'primary' : 'ghost'"
            data-testid="LCS_FORM_FIELD_STATUS">
            <scb-select
              [(value)]="_status"
              multiple
              data-testid="LCS_SELECT_STATUS_VALUE"
              [searchPlaceholder]="t('searchOptions')"
              (closed)="lcTypeClosed()"
              noAutoClose>
              <app-select-value
                scbSelectTrigger
                [placeholder]="t('facilities.facilitiesCcTransactions.status')"
                [len]="_status().length" />
              @for (item of statusList(); track item) {
                <scb-option
                  [value]="item"
                  class="capitalize">
                  {{ item }}
                </scb-option>
              }
              <app-select-footer
                class="select-footer"
                (apply)="apply()"
                (resetValue)="_status.set([])" />
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
export class CcDetailsFilter {
  readonly status = model<TransactionStatus[]>([]);
  readonly statusList = input<TransactionStatus[]>([]);
  readonly isEmpty = input(false);

  readonly _status = linkedSignal(this.status);
  readonly showClearFilter = computed(() => this.status().length);

  clearFilter() {
    this.status.set([]);
  }

  apply() {
    this.status.set(this._status());
  }

  lcTypeClosed() {
    if (!isEqual(this.status(), this._status())) {
      this._status.set(this.status());
    }
  }
}
