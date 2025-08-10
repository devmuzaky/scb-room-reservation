import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { Icon } from '@scb/ui/icon';
import { NumberCommaFormatPipe } from '../../../core/pipes/format-number.pipe';
import { TransferDetailsDTO } from '../Model/transfer-details.model';

@Component({
  selector: 'transfer-summary-widget',
  imports: [CommonModule, Icon, TranslocoDirective, NumberCommaFormatPipe],
  template: `
    <div
      *transloco="let t; prefix: 'transferDetails'"
      class="bg-color-background-container flex w-full flex-col items-center gap-2 rounded-2xl border border-gray-200 p-4 dark:border-gray-700">
      <!-- Avatar -->
      <div>
        @switch (data()?.transferStatus) {
          @case ('SUCCESS') {
            <icon
              class="h-[46] w-[56] text-white"
              name="transfersucces">
            </icon>
          }

          @case ('FAILED') {
            <icon
              class="h-[46] w-[56] text-white"
              name="transferfailed">
            </icon>
          }

          @case ('PENDING') {
            <icon
              class="h-[46] w-[56] text-white"
              name="transferpending">
            </icon>
          }
        }
      </div>

      <!-- Amount and Currency -->
      <div class="flex flex-col items-center gap-1 text-center">
        <div class="flex items-end gap-1">
          <!-- <span
            [ngClass]="data?.transferStatus === 'FAILED' ? 'text-red-700' : 'text-primary'"
            class="text-color-text-brand text-2xl font-semibold">
            {{ data?.transferAmount }}</span> -->
          <!-- <currency-view
            [ngClass]="data()?.transferStatus === 'FAILED' ? 'text-red-700' : 'text-primary'"
            class="text-color-text-brand text-2xl font-semibold"
            [amount]="data()?.transferAmount"
            [short]="true" /> -->
          <div class="gap-sm ltr-force flex items-center justify-center">
            <p
              [ngClass]="data()?.transferStatus === 'FAILED' ? 'text-red-700' : 'text-primary'"
              class="mf-3xl font-semibold">
              {{ data()?.transferAmount | numberCommaFormat }}
            </p>
            <p class="to-text-secondary mf-md">{{ data()?.transferCurrency }}</p>
          </div>
        </div>

        <!-- Reference Number show only when transfer type is OWN -->
        @if (data()?.referenceId) {
          <div class="mf-md text-text-secondary text-xs">
            {{ t('referenceNumber') }}
            <span class="text-color-text-brand text-base font-semibold">
              {{ data()?.referenceId }}
            </span>
          </div>
        }
      </div>

      <!-- Transfer Type -->
      <div class="text-color-text-primary text-center text-base leading-tight font-semibold">
        @switch (data()?.transferType) {
          @case ('OUTSIDE') {
            {{ t('outside') }} -
            @if (data()?.transferNetwork === 'IPN') {
              <span>{{ t('instant') }}</span>
            }
            @if (data()?.transferNetwork === 'ACH') {
              <span>{{ t('ach') }}</span>
            }
          }

          @case ('INSIDE') {
            {{ t('inside') }}
          }

          @case ('OWN') {
            {{ t('own') }}
          }
        }
      </div>
    </div>
  `,
  styles: [
    `
      ::ng-deep currency-view.text-2xl span {
        font-size: 1.5rem;
      }

      ::ng-deep currency-view.font-semibold span {
        font-weight: 600;
      }
    `,
  ],
})
export class TransferSummaryWidget {
  readonly data = signal<TransferDetailsDTO | null>(null);
  @Input()
  set dataInput(value: TransferDetailsDTO | null) {
    this.data.set(value);
  }
}
