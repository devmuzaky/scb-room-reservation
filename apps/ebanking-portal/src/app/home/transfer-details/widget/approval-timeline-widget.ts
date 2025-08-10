import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { Icon } from '@scb/ui/icon';
import { UtcDatePipe } from '../../../core/pipes/utc-date-time.pipe';
import { TransferDetailsDTO } from '../Model/transfer-details.model';

@Component({
  selector: 'approval-timeline-widget',
  imports: [CommonModule, Icon, TranslocoDirective, UtcDatePipe],
  template: `
    <div
      *transloco="let t; prefix: 'transferDetails'"
      class="rounded-2xl border border-gray-200 p-4 dark:border-gray-700">
      <h2 class="mb-1 text-lg font-semibold">{{ t('approvalTimeline') }}</h2>
      <p class="text-text-tertiary text-md mb-3">{{ t('approvalDetails') }}</p>
      <div class="my-4 w-full border-t border-gray-300"></div>
      <div class="flex items-start gap-2">
        <div class="relative space-y-7">
          <!-- Step 1 -->
          <!-- <div class="relative ltr:pl-6 rtl:pr-6">
                                    <div
                                        class="absolute ltr:left-[6px] rtl:right-[6px] top-[14px] h-full w-px border-l-2 rtl:border-r-2 rtl:border-l-0 border-dashed mt-3 ml-[1px] border-gray-300 z-0">
                                    </div>
                                    <div
                                        class="absolute ltr:left-0 rtl:right-0 mt-1 w-4 h-4 bg-primary rounded-full z-10">
                                    </div>
                                    <div class="ltr:ml-3 rtl:mr-3 text-start">
                                        <div class="font-semibold text-color-text-primary">
                                            User Code <span class="text-blue-700">(Role)</span>
                                        </div>
                                        <div class="text-sm text-color-text-secondary mt-1">
                                            Status, date & time
                                        </div>
                                    </div>
                                </div> -->
          <!-- Step 2 -->
          <!-- <div class="relative ltr:pl-6 rtl:pr-6">
                                    <div
                                        class="absolute ltr:left-[6px] rtl:right-[6px] top-[14px] h-full w-px border-l-2 rtl:border-r-2 rtl:border-l-0 border-dashed mt-3 ml-[1px] border-gray-300 z-0">
                                    </div>
                                    
                                    <div
                                        class="absolute ltr:left-0 rtl:right-0 mt-1 w-4 h-4 bg-primary rounded-full z-10">
                                    </div>
                                    <div class="ltr:ml-3 rtl:mr-3 text-start">
                                        <div class="font-semibold text-color-text-primary">
                                            User Code <span class="text-blue-700">(Role)</span>
                                        </div>
                                        <div class="text-sm text-color-text-secondary mt-1">
                                            Status, date & time
                                        </div>
                                    </div>
                                </div> -->

          <!-- Step 3 (last one, no vertical line below) -->
          <div class="relative ltr:pl-6 rtl:pr-6">
            <!-- Dot only, no vertical line -->
            <icon
              class="text-success absolute z-10 mt-1 h-4 w-4 rounded-full ltr:left-0 rtl:right-0"
              name="check-filled" />
            <!-- Content -->
            <div class="text-start ltr:ml-3 rtl:mr-3">
              <div class="text-color-text-primary font-semibold">
                {{ data()?.username }} <span class="text-primary">(Authorizer)</span>
              </div>
              <div class="text-color-text-secondary text-md mt-1">
                {{ t('approved') }} {{ data()?.transactionDate | utcDateTime }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class ApprovalTimelineWidget {
  readonly data = signal<TransferDetailsDTO | null>(null);
  @Input()
  set dataInput(value: TransferDetailsDTO | null) {
    this.data.set(value);
  }
}
