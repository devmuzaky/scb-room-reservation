import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NumberCommaFormatPipe } from '@/core/pipes/format-number.pipe';
import { MaskedPipe } from '@/core/pipes/masked.pipe';
import { ShortNumberPipe } from '@/core/pipes/short-number.pipe';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective } from '@jsverse/transloco';
import { Avatar } from '@scb/ui/avatar';
import { Button } from '@scb/ui/button';
import { Card } from '@scb/ui/card';
import { Tooltip } from 'primeng/tooltip';
import { Currencies, CURRENCY_FLAG } from '../../model/constants';

export enum AccountType {
  ACCOUNTS = 'Accounts',
  CERTIFICATES = 'Certificates',
  DEPOSITS = 'Deposits',
}

@Component({
  selector: 'app-balance-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Card,
    Avatar,
    Button,
    TranslocoDirective,
    ShortNumberPipe,
    MaskedPipe,
    RouterLink,
    Tooltip,
    NumberCommaFormatPipe,
  ],
  template: `
    <scb-card
      class="bg-page gap-md p-lg flex h-full flex-col"
      *transloco="let t; prefix: 'dashboard'">
      <div class="gap-sm flex flex-col">
        <div
          class="gap-md body-md text-text-secondary flex items-center"
          *transloco="let t">
          <scb-avatar
            [src]="'icons/countries/' + currencyMap[currency()] + '.svg'"
            [name]="currency()"
            size="16" />
          <span
            data-testid="DASH_LABEL_CURRENCY"
            class="text-md font-normal"
            >{{ currency() }}</span
          >
        </div>
        <h4 class="head-2xs-s">{{ accountDetail().totalAmount | shortNumber | mask: layoutFacade.showBalances() }}</h4>
        <p class="body-sm gap-sm text-text-tertiary flex items-center">
          @if (accountDetail().equivalentInEGP && accountDetail().currency !== currencyEnum.EGYPTIAN_POUND) {
            <span>{{ t('accountOverview.equivalent') }}:</span>
            @if (isArabic()) {
              <span class="text-text-secondary body-md">EGP</span>
              <span
                [pTooltip]="equivalentInEGPTooltip"
                tooltipPosition="top"
                class="body-sm-s text-text-primary"
                >{{ accountDetail().equivalentInEGP | shortNumber | mask: layoutFacade.showBalances() }}</span
              >
              <ng-template #equivalentInEGPTooltip>
                <p class="mf-sm whitespace-nowrap">
                  {{ accountDetail().equivalentInEGP | numberCommaFormat }}
                  <span class="text-text-white font-normal">EGP</span>
                </p>
              </ng-template>
            } @else {
              <span
                [pTooltip]="equivalentInEGPTooltip"
                tooltipPosition="top"
                class="body-sm-s text-text-primary"
                >{{ accountDetail().equivalentInEGP | shortNumber | mask: layoutFacade.showBalances() }}</span
              >
              <span class="text-text-secondary body-md">EGP</span>

              <ng-template #equivalentInEGPTooltip>
                <p class="mf-sm whitespace-nowrap">
                  {{ accountDetail().equivalentInEGP | numberCommaFormat }}
                  <span class="text-text-white font-normal">EGP</span>
                </p>
              </ng-template>
            }
          }
        </p>
      </div>
      <div class="body-sm text-text-secondary mt-auto flex items-center justify-between">
        @if (accountOverviewType.ACCOUNTS === accountType()) {
          {{ accountDetail().totalAccounts + ' ' + t('accounts.accounts') }}
        }
        @if (accountOverviewType.CERTIFICATES === accountType()) {
          {{ accountDetail().certificatesCount + ' ' + t('certificates.certificates') }}
        }
        @if (accountOverviewType.DEPOSITS === accountType()) {
          {{ accountDetail().timeDepositsCount + ' ' + t('timeDeposits.timeDeposits') }}
        }
        <a
          scbButton
          variant="ghost"
          id="NEW"
          suffixIcon="arrow-right"
          [routerLink]="href()"
          [queryParams]="{ currency: currency() }"
          size="xs">
          {{ t('seeAll') }}
        </a>
      </div>
    </scb-card>
  `,
})
export class BalanceCardComponent {
  layoutFacade = inject(LayoutFacadeService);
  currency = input.required<keyof typeof CURRENCY_FLAG>();
  accountType = input.required<string>();
  currencyMap = CURRENCY_FLAG;
  currencyEnum = Currencies;
  accountOverviewType = AccountType;
  accountDetail = input.required<any>();
  readonly href = input.required<string>();
  readonly isArabic = computed(() => {
    return this.layoutFacade.language() === 'ar' ? true : false;
  });
}
