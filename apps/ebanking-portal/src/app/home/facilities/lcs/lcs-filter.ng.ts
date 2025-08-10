import { ChangeDetectionStrategy, Component, computed, input, linkedSignal, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectFooter, SelectValue } from '@/core/components';
import { isEqual } from '@/core/utils/utils';
import { TranslocoDirective } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { FormField } from '@scb/ui/form-field';
import { Option, Select, SelectTrigger } from '@scb/ui/select';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { LcsType, LcType } from './model';

@Component({
  selector: 'app-lcs-filter',
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
            [variant]="_lcType().length ? 'primary' : 'ghost'"
            data-testid="LCS_FORMFIELD_STATUS">
            <scb-select
              #lcTypeSelect
              [(value)]="_lcType"
              multiple
              [options]="lcTypeList()"
              [filterFn]="filterLCType"
              data-testid="LCS_SELECT_STATUS_VALUE"
              [searchPlaceholder]="t('searchOptions')"
              (closed)="lcTypeClosed()"
              noAutoClose>
              <app-select-value
                scbSelectTrigger
                [placeholder]="t('facilities.facilitiesLcs.lcType')"
                [len]="_lcType().length" />
              @for (item of lcTypeSelect.optionsFilter.filteredList(); track item.key) {
                <scb-option
                  [value]="item.key"
                  class="capitalize">
                  {{ item.value }}
                </scb-option>
              }
              <app-select-footer
                class="select-footer"
                (apply)="apply()"
                (resetValue)="_lcType.set([])" />
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
export class LcsFilter {
  readonly lcType = model<LcsType[]>([]);
  readonly lcTypeList = input<LcType[]>([]);
  readonly isEmpty = input(false);

  readonly _lcType = linkedSignal(this.lcType);
  readonly showClearFilter = computed(() => this.lcType().length);

  readonly filterLCType = (option: LcType) => option.value;

  clearFilter() {
    this.lcType.set([]);
  }

  apply() {
    this.lcType.set(this._lcType());
  }

  lcTypeClosed() {
    if (!isEqual(this.lcType(), this._lcType())) {
      this._lcType.set(this.lcType());
    }
  }
}
