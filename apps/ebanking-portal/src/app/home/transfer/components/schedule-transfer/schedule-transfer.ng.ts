import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ScbMaxLengthDirective } from '@/core/directives/max-length.directive';
import { ScheduleDto } from '@/home/transfer-details/Model/transfer-details.model';
import { TranslocoDirective } from '@jsverse/transloco';
import { Alert } from '@scb/ui/alert';
import { Button } from '@scb/ui/button';
import { Card } from '@scb/ui/card';
import { ScbDatepickerComponent } from '@scb/ui/datepicker';
import { Error, FormField, Hint, Label, ScbInput } from '@scb/ui/form-field';
import { Icon } from '@scb/ui/icon';
import { Radio, RadioGroup } from '@scb/ui/radio';
import { Option, Select, SelectTrigger } from '@scb/ui/select';
import { Switch } from '@scb/ui/switch';
import { ScbDate } from '@scb/util/datepicker';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FREQUENCY_TYPE_OPTIONS, FrequencyType, TRANSFER_TIMES_OPTIONS } from '../../model';
import { TransferService } from '../../transfer.service';
import { RecurringDrawer } from '../recurring-drawer/recurring-drawer.ng';

@Component({
  selector: 'app-schedule-transfer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Card,
    Icon,
    Switch,
    TranslocoDirective,
    ReactiveFormsModule,
    FloatLabelModule,
    DatePickerModule,
    FormField,
    Label,
    ScbInput,
    Hint,
    Error,
    Button,
    RadioGroup,
    Radio,
    ScbMaxLengthDirective,
    Select,
    SelectTrigger,
    Option,
    RecurringDrawer,
    ScbDatepickerComponent,
    Alert,
  ],
  template: `<scb-card
    class="p-xl gap-2xl flex flex-col"
    *transloco="let t; prefix: 'transfer.schedule'">
    <section class="gap-lg flex justify-between">
      <div class="gap-lg flex items-center">
        <icon
          class="h-5xl flex w-5xl rounded-full"
          name="schedule" />
        <p class="mf-lg font-semibold">{{ t('scheduleTransfer') }}</p>
      </div>
      <scb-switch
        class="py-sm !gap-0"
        [formControl]="isSchedule" />
    </section>

    @if (isSchedule.value) {
      <ng-container [formGroup]="scheduleForm">
        <section>
          <scb-form-field>
            <label
              scbLabel
              [class]="!!scheduleForm.get('submitDate')?.value ? 'red label-sm translate-y-0!' : ''"
              >{{ t('transferDate') }}</label
            >
            <scb-datepicker
              inputId="submitDate"
              [minDate]="minDate"
              formControlName="submitDate"
              dateFormat="dd-mm-yy" />
            <icon
              name="calendar"
              class="suffix text-text-info w-[24px] flex-none" />
            <p scbError="required">
              {{ t('endDateRequired') }}
            </p>
          </scb-form-field>
        </section>

        @if (scheduleForm.value.submitDate) {
          <section>
            <scb-form-field>
              <label scbLabel>{{ t('frequencyType') }}</label>
              <scb-select
                [searchPlaceholder]="t('frequencyType')"
                [withLabel]="true"
                formControlName="frequencyType">
                <div
                  scbSelectTrigger
                  class="text-text-primary body-md-s">
                  {{ t('frequencyTypeOptions.' + scheduleForm.value.frequencyType) }}
                </div>
                <div class="select-header body-md-s px-md">{{ t('frequencyType') }}</div>
                @for (item of frequencyTypeList; track item.key) {
                  <scb-option [value]="item.key">
                    {{ item.value === '' ? t('frequencyTypeOptions.ALL') : t(item.value) }}
                  </scb-option>
                }
              </scb-select>
            </scb-form-field>
          </section>
        }

        @if (scheduleForm.value.frequencyType !== 'ONCE') {
          <section>
            <scb-radio-group
              class="gap-5xl"
              [(value)]="transferTimes">
              @for (cb of transferTimesOptions; track cb.key) {
                <scb-radio
                  [value]="cb.key"
                  class="body-md">
                  {{ t(cb.key) }}
                </scb-radio>
              }
            </scb-radio-group>
          </section>

          @if (transferTimes() === 'numberOfTransfers') {
            <section class="flex flex-col">
              <scb-form-field>
                <label scbLabel>{{ t('numberOfTransfers') }}</label>
                <input
                  scbInput
                  type="number"
                  min="1"
                  [max]="max()"
                  formControlName="numberOfTransfers"
                  [scbMaxLength]="3"
                  (keypress)="
                    $event.key === 'e' || $event.key === '-' || $event.key === '+' || $event.key === '.'
                      ? $event.preventDefault()
                      : null
                  " />

                @if (scheduleForm.value.numberOfTransfers) {
                  <p scbHint>
                    {{ t('endDateHint') }}
                    <span class="body-label-md-m text-input-text-field">{{ calculatedEndDate() }}</span>
                  </p>
                }

                <p scbError="required">
                  {{ t('numberOfTransfersRequired') }}
                </p>
                <p scbError="pattern">
                  {{ t('numberOfTransfersRequired') }}
                </p>
                <p scbError="max">
                  {{ t('maxTransferExceed') }}
                </p>
              </scb-form-field>

              <button
                scbButton
                variant="secondary"
                size="sm"
                class="self-end"
                (click)="viewRecurringDrawer()">
                {{ t('recurringDetail') }}
                <icon
                  class="text-button-icon-hover-ghost h-4 w-4 rtl:rotate-180"
                  name="chevron-right" />
              </button>
            </section>
          } @else if (transferTimes() === 'endDate') {
            <section class="flex flex-col">
              <scb-form-field>
                <label
                  scbLabel
                  [class]="!!scheduleForm.get('endDate')?.value ? 'red label-sm translate-y-0!' : ''"
                  >{{ t('endDate') }}</label
                >

                <scb-datepicker
                  class="block w-full"
                  inputId="endDate"
                  [minDate]="minEndDate()"
                  [maxDate]="maxDate()"
                  dateFormat="dd-mm-yy"
                  formControlName="endDate" />

                <icon
                  name="calendar"
                  class="suffix text-text-info w-[24px] flex-none" />

                @if (scheduleForm.value.endDate) {
                  <p scbHint>
                    {{ t('numberOfTransfersHint') }}
                    <span class="body-label-md-m text-input-text-field">{{ calculateTransferTimes() }}</span>
                  </p>
                }

                <p scbError="required">
                  {{ t('endDateRequired') }}
                </p>
                <p scbError="pattern">
                  {{ t('endDateRequired') }}
                </p>
              </scb-form-field>

              <button
                scbButton
                size="sm"
                class="self-end"
                variant="secondary"
                (click)="viewRecurringDrawer()">
                {{ t('recurringDetail') }}
                <icon
                  class="text-button-icon-hover-ghost h-4 w-4 rtl:rotate-180"
                  name="chevron-right" />
              </button>
            </section>
          }

          @if (showWeekendAlert() && friday()) {
            <scb-alert
              [desc]="t('scheduledInfo')"
              [hideClose]="true"
              class="flex flex-col"
              type="info" />
          }
        }
      </ng-container>
    }

    @if (viewRecurringDetail()) {
      <recurring-drawer
        [(open)]="open"
        [startDate]="scheduleForm.get('submitDate')?.value"
        [frequencyType]="scheduleForm.get('frequencyType')?.value"
        [occurrences]="scheduleForm.get('numberOfTransfers')?.value"
        [showWeekendAlert]="showWeekendAlert()" />
    }
  </scb-card>`,
})
export class ScheduleTransfer {
  readonly transfer = inject(TransferService);
  readonly isSchedule = this.transfer.isSchedule;
  readonly scheduleForm = this.transfer.scheduleDto;
  readonly viewRecurringDetail = signal(false);
  readonly isScheduleChange = toSignal(this.isSchedule.valueChanges);
  readonly scheduleValueChanges = toSignal(this.scheduleForm.valueChanges);
  readonly submitDateChange = toSignal(this.scheduleForm.controls.submitDate.valueChanges);
  readonly numberOfTransfersChange = toSignal(this.scheduleForm.controls.numberOfTransfers.valueChanges);
  readonly frequencyTypeChange = toSignal(this.scheduleForm.controls.frequencyType.valueChanges);
  readonly endDateChange = toSignal(this.scheduleForm.controls.endDate.valueChanges);
  readonly open = signal(false);
  readonly transferTimes = signal<'numberOfTransfers' | 'endDate'>('numberOfTransfers');
  readonly minDate = (() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  })();
  readonly frequencyTypeList = FREQUENCY_TYPE_OPTIONS;
  readonly transferTimesOptions = TRANSFER_TIMES_OPTIONS;
  readonly friday = signal<boolean>(false);
  readonly scheduleFormChanges = toSignal(this.scheduleForm.valueChanges);
  readonly setData = input<ScheduleDto | null | undefined>(null);

  readonly showWeekendAlert = input<boolean>(false);

  readonly maxDate = computed(() => {
    // one year from the
    const value = this.scheduleFormChanges();
    const v = value?.submitDate ? new Date(value.submitDate.split('-').reverse().join('-')) : new Date();
    const d = new ScbDate(v);
    const n = d.add(1, 'years').subtract(1, 'days');
    return n.date();
  });

  readonly max = computed(() =>
    this.getNumberOfTransfers(this.submitDateChange(), this.getDateStr(this.maxDate()), this.frequencyTypeChange()),
  );

  readonly minEndDate = computed(() => {
    const value = this.submitDateChange();
    if (value) {
      // Parse DD-MM-YYYY to Date object
      const [day, month, year] = value.split('-').map(Number);
      const date = new Date(year, month - 1, day); // month is 0-based in JavaScript Date
      return date;
    }
    return undefined;
  });

  calculatedEndDate = computed(() => {
    const submitDate = this.submitDateChange();
    const numberOfTransfers = this.numberOfTransfersChange();
    const frequencyType = this.frequencyTypeChange();
    if (!submitDate || !numberOfTransfers || !frequencyType) {
      return '';
    }

    // Parse DD-MM-YYYY to Date object
    const [day, month, year] = submitDate.split('-').map(Number);
    const startDate = new Date(year, month - 1, day); // month is 0-based in JavaScript Date
    let endDate = new Date(startDate);

    switch (frequencyType) {
      case 'WEEKLY':
        endDate.setDate(startDate.getDate() + (numberOfTransfers - 1) * 7);
        break;
      case 'DAILY':
        endDate.setDate(startDate.getDate() + (numberOfTransfers - 1));
        break;
      case 'MONTHLY':
        endDate.setMonth(startDate.getMonth() + (numberOfTransfers - 1));
        break;
      case 'QUARTERLY':
        endDate.setMonth(startDate.getMonth() + (numberOfTransfers - 1) * 3);
        break;
      case 'SEMI_ANNUALLY':
        endDate.setMonth(startDate.getMonth() + (numberOfTransfers - 1) * 6);
        break;
      // case 'YEARLY':
      //   endDate.setFullYear(startDate.getFullYear() + (numberOfTransfers - 1));
      //   break;
      default:
        return '';
    }

    endDate = this.getMinDate(endDate, this.maxDate());

    return this.getDateStr(endDate);
  });

  calculateTransferTimes = computed(() => {
    const submitDate = this.submitDateChange();
    const endDate = this.endDateChange();
    const frequencyType = this.frequencyTypeChange();
    return this.getNumberOfTransfers(submitDate, endDate, frequencyType);
  });

  _ = effect(() => {
    if (this.transferTimes() === 'numberOfTransfers' || this.scheduleForm.value.frequencyType === 'ONCE') {
      this.scheduleForm.controls.endDate.setValue(this.calculatedEndDate());
    }
  });

  ___ = effect(() => {
    const startDate = this.submitDateChange();
    const maxDate = this.maxDate();
    untracked(() => {
      if (this.dateGreater(this.scheduleForm.controls.endDate.value, maxDate)) {
        this.scheduleForm.controls.endDate.setValue(this.calculatedEndDate());
        this.scheduleForm.controls.numberOfTransfers.setValue(this.calculateTransferTimes());
      } else if (startDate && this.dateGreater(startDate, this.scheduleForm.controls.endDate.value)) {
        this.scheduleForm.controls.endDate.setValue(startDate);
        this.scheduleForm.controls.numberOfTransfers.setValue(this.calculateTransferTimes());
      }
    });
  });

  __ = effect(() => {
    if (this.transferTimes() === 'endDate' || this.scheduleForm.value.frequencyType === 'ONCE') {
      this.scheduleForm.controls.numberOfTransfers.setValue(this.calculateTransferTimes());
    }
  });

  constructor() {
    effect(() => {
      const required = this.isScheduleChange() && this.transferTimes() === 'endDate';
      this.checkTransferDates();
      this.updateValidators(this.scheduleForm.controls.endDate, required, [Validators.required]);
    });

    effect(() => {
      const scheduled = this.isScheduleChange();

      this.updateValidators(this.scheduleForm.controls.submitDate, scheduled, [Validators.required]);
    });

    effect(() => {
      const scheduled = this.isScheduleChange();
      const m = this.max();
      this.updateValidators(this.scheduleForm.controls.numberOfTransfers, scheduled, [
        Validators.required,
        Validators.min(1),
        Validators.pattern('^[1-9][0-9]*$'),
        Validators.max(m),
      ]);
    });

    effect(() => {
      const data = this.setData();
      if (data) {
        this.scheduleForm.patchValue({
          submitDate: (data.submitDate ?? '').trim(),
          frequencyType: (data.frequencyType ?? 'ONCE') as FrequencyType,
          endDate: data.endDate || '',
          numberOfTransfers: data.numberOfTransfers || 1,
        });
      }
    });
  }

  checkTransferDates(): boolean {
    const submitDate = this.submitDateChange();
    const numberOfTransfers = this.numberOfTransfersChange();
    const frequencyType = this.frequencyTypeChange();
    let foundFriday = false;
    if (!submitDate || !numberOfTransfers || !frequencyType) {
      return false;
    }

    const [day, month, year] = submitDate.split('-').map(Number);
    const startDate = new Date(year, month - 1, day);
    const current = new Date(startDate);

    for (let count = 0; count < numberOfTransfers!; count++) {
      const newDate = new Date(current);
      if (newDate.getDay() === 5 || newDate.getDay() === 6) {
        foundFriday = true;
      }

      switch (frequencyType) {
        case 'DAILY':
          current.setDate(current.getDate() + 1);
          break;
        case 'WEEKLY':
          current.setDate(current.getDate() + 7);
          break;
        case 'MONTHLY':
          current.setMonth(current.getMonth() + 1);
          break;
        case 'QUARTERLY':
          current.setMonth(current.getMonth() + 3);
          break;
        case 'SEMI_ANNUALLY':
          current.setMonth(current.getMonth() + 6);
          break;
        // case 'YEARLY':
        //   current.setFullYear(current.getFullYear() + 1);
        //   break;
      }
    }

    this.friday.set(foundFriday);
    return false;
  }

  // Format the date back to DD-MM-YYYY
  private getDateStr(endDate: Date) {
    const formattedDay = String(endDate.getDate()).padStart(2, '0');
    const formattedMonth = String(endDate.getMonth() + 1).padStart(2, '0');
    const formattedYear = endDate.getFullYear();

    return `${formattedDay}-${formattedMonth}-${formattedYear}`;
  }

  getNumberOfTransfers(submitDate?: string, endDate?: string, frequencyType?: FrequencyType) {
    if (!submitDate || !endDate || !frequencyType) {
      return 1; // Default to 1 transfer if any required value is missing
    }

    // Parse DD-MM-YYYY to Date object
    const [startDay, startMonth, startYear] = submitDate.split('-').map(Number);
    const [endDay, endMonth, endYear] = endDate.split('-').map(Number);

    const start = new Date(startYear, startMonth - 1, startDay);
    const end = new Date(endYear, endMonth - 1, endDay);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return 1; // Return 1 if dates are invalid
    }

    if (end < start) {
      return 1; // Return 1 if end date is before start date
    }

    let numberOfTransfers = 1; // At least one transfer
    let monthsDiff = 0;
    let weeksDiff = 0;
    // let yearsDiff = 0;
    let daysDiff = 0;

    switch (frequencyType) {
      case 'WEEKLY':
        weeksDiff = Math.floor((end.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000));
        numberOfTransfers = Math.max(1, weeksDiff + 1);
        break;
      case 'DAILY':
        daysDiff = Math.floor((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
        numberOfTransfers = Math.max(1, daysDiff + 1);
        break;
      case 'MONTHLY':
        monthsDiff = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        numberOfTransfers = Math.min(12, Math.max(1, monthsDiff + 1));
        break;
      case 'QUARTERLY':
        monthsDiff = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        numberOfTransfers = Math.min(4, Math.max(1, Math.floor(monthsDiff / 3) + 1));
        break;
      case 'SEMI_ANNUALLY':
        monthsDiff = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        numberOfTransfers = Math.min(2, Math.max(1, Math.floor(monthsDiff / 6) + 1));
        break;
      // case 'YEARLY':
      //   yearsDiff = end.getFullYear() - start.getFullYear();
      //   numberOfTransfers = Math.max(1, yearsDiff + 1);
      //   break;
    }

    return numberOfTransfers;
  }

  updateValidators(control: FormControl, required: boolean | undefined, validators: any[]) {
    control.setValidators(required ? validators : []);
    control.updateValueAndValidity();
  }

  viewRecurringDrawer() {
    this.viewRecurringDetail.set(true);
    this.open.set(true);
  }

  dateGreater(date1: string, date2: string | Date) {
    if (!date1 || !date2) return false;

    const d1 = new Date(date1.split('-').reverse().join('-'));
    const d2 = date2 instanceof Date ? date2 : new Date(date2.split('-').reverse().join('-'));
    return d1 > d2;
  }

  getMinDate(date1: Date, date2: Date) {
    if (date1 < date2) {
      return date1;
    } else {
      return date2;
    }
  }
}

export type ScheduleTransferForm = FormGroup<{
  submitDate: FormControl<string>;
  frequencyType: FormControl<FrequencyType>;
  endDate: FormControl<string>;
  numberOfTransfers: FormControl<number>;
}>;
