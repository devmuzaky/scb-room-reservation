import { CommonModule } from '@angular/common';
import { Component, computed, Input, signal } from '@angular/core';
import { UtcDatePipe } from '@/core/pipes/utc-date-time.pipe';
import { Beneficiary } from '@/home/beneficiary/models/models';
import { AccountSelectedView } from '@/home/transfer/components/account-selected/account-selected-view.ng';
import { BeneficiarySelectedView } from '@/home/transfer/components/beneficiary-selected/beneficiary-selected-view.ng';
import { CharitySelectedView } from '@/home/transfer/components/charity-selected/charity-selected';
import { TranslocoDirective } from '@jsverse/transloco';
import { Icon } from '@scb/ui/icon';
import { TransferDetailsDTO } from '../Model/transfer-details.model';

@Component({
  selector: 'transfer-additional-detail-widget',
  imports: [
    CommonModule,
    Icon,
    TranslocoDirective,
    UtcDatePipe,
    AccountSelectedView,
    BeneficiarySelectedView,
    CharitySelectedView,
  ],
  template: `
    <div *transloco="let t; prefix: 'transferDetails'">
      <!-- From Section -->
      <div class="mx-4">
        <p class="mt-4 mb-0">{{ t('from') }}</p>
        <div class="mt-1 rounded-2xl border border-gray-200 p-4 dark:border-gray-700">
          <div class="flex items-center gap-4">
            <div class="bg-icon-container-blue h-12 w-12 rounded-full">
              <icon
                class="h-4xl text-text-brand m-2 inline-block w-4xl rounded-full"
                name="bank" />
            </div>
            <div>
              <p class="font-semibold">{{ data()?.fromAccount?.accountNickname }}</p>
              <p class="font-semibold">{{ data()?.fromAccount?.accountType }}</p>
              <p class="text-text-tertiary text-sm">{{ data()?.fromAccount?.accountNumber }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- To Section -->
      <div class="mx-4">
        <p class="mt-3 mb-0">{{ t('to') }}</p>

        @let transferData = data();
        @if (transferData?.transferType === 'OWN') {
          <app-account-selected-view
            [nickname]="transferData?.toAccount?.accountNickname || ''"
            [accountNumber]="transferData?.toAccount?.accountNumber || ''" />
        } @else if (transferData?.transferType === 'CHARITY') {
          <app-charity-selected-view
            [charity]="{
              charityName: transferData?.toAccount?.accountNickname ?? '',
              charityType: transferData?.toAccount?.accountType ?? '',
              accountNumber: transferData?.toAccount?.accountNumber ?? '',
            }" />
        } @else {
          @if (beneficiary()) {
            <app-beneficiary-selected-view [beneficiary]="beneficiary()" />
          }
        }
      </div>

      <div class="flex flex-col gap-5 p-4">
        <!-- if transfer failed Reason of Failure  -->
        <!-- @if (data()?.transferStatus === 'FAILED') {
          <div class="flex justify-between text-sm">
            <span class="text-text-secondary flex">
              <icon
                class="mr-1 h-4 w-4 rtl:ml-1"
                name="document-text" />
              {{ t('failureReason') }}
            </span>
            <span class="text-md font-semibold">{{ data()?.failureReason }} </span>
          </div>
        } -->
        <!-- Only if it’s outside SCB -->
        @if (data()?.transferType === 'OUTSIDE') {
          <div class="flex justify-between text-sm">
            <span class="text-text-secondary flex">
              <icon
                class="mr-1 h-4 w-4 rtl:ml-1"
                name="money" />
              {{ t('applied') }}
            </span>
            <span class="text-md font-semibold"
              >{{ data()?.fees }} <span class="text-text-secondary text-xs">{{ data()?.feesCurrency }}</span></span
            >
          </div>

          <div class="flex justify-between text-sm">
            <span class="text-text-secondary flex">
              <icon
                class="mr-1 h-4 w-4 rtl:ml-1"
                name="frame" />
              {{ t('charges') }}
            </span>
            <span class="text-md font-semibold">{{ data()?.chargeBearer | titlecase }}</span>
          </div>
        }

        <div class="flex w-full items-center justify-between gap-x-2 text-sm whitespace-nowrap">
          <span class="text-text-secondary flex items-center">
            <icon
              class="mr-1 h-4 w-4 rtl:ml-1"
              name="transferCalendar" />
            {{ t('transaction') }}
          </span>
          <span class="text-md font-semibold">
            {{ data()?.transactionDate | utcDateTime }}
          </span>
        </div>
        <!-- show when transfer type is SUCCESS  -->
        <!-- @if (data()?.transferStatus === 'SUCCESS') {
          <div class="flex justify-between text-sm">
            <span class="text-text-secondary flex">
              <icon
                class="mr-1 h-4 w-4 rtl:ml-1"
                name="document-text" />
              {{ t('achTransferID') }}
            </span>
            <span class="text-md font-semibold">
              {{ data()?.achTransactionId }}
            </span>
          </div>
        } -->
        <!-- show when transfer type is SUCCESS -->
        @if (data()?.transferStatus === 'SUCCESS') {
          <div class="flex justify-between text-sm">
            <span class="text-text-secondary flex">
              <icon
                class="mr-1 h-4 w-4 rtl:ml-1"
                name="transferCalendar" />
              {{ t('valueDate') }}
            </span>
            <span class="text-md font-semibold">
              {{ data()?.valueDate | utcDateTime }}
            </span>
          </div>
        }
        @if (data()?.transferType !== 'OWN' && data()?.transferType !== 'CHARITY') {
          <div class="flex justify-between text-sm">
            <span class="text-text-secondary flex">
              <icon
                class="mr-1 h-4 w-4 rtl:ml-1"
                name="document-text" />
              {{ t('reason') }}
            </span>
            <span class="text-md font-semibold">
              {{ data()?.transferReason }}
            </span>
          </div>
        }
        <!-- hide when description is empty -->
        @if (data()?.description?.trim()) {
          <div class="gap-xl flex justify-between text-sm">
            <span class="text-text-secondary flex">
              <icon
                class="mr-1 h-4 w-4 rtl:ml-1"
                name="note" />
              {{ t('description') }}
            </span>
            <span class="text-md break-words-force font-semibold break-all whitespace-pre-wrap">
              {{ data()?.description }}
            </span>
          </div>
        }
      </div>
    </div>
  `,
  styles: ``,
})
export class TransferAdditionalDetailWidget {
  readonly data = signal<TransferDetailsDTO | null>(null);
  @Input()
  set dataInput(value: TransferDetailsDTO | null) {
    this.data.set(value);
  }
  readonly beneficiary = computed(() => {
    const beneficiary = this.data()?.beneficiary;
    if (beneficiary && 'beneficiaryId' in beneficiary && beneficiary.beneficiaryId) {
      return beneficiary as Beneficiary;
    }
    return {} as Beneficiary;
  });
}
