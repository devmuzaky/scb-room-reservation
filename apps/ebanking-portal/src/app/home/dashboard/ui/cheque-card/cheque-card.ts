import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DateView } from '@/core/components';
import { MaskedPipe } from '@/core/pipes/masked.pipe';
import { ShortNumberPipe } from '@/core/pipes/short-number.pipe';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective } from '@jsverse/transloco';
import { Icon } from '@scb/ui/icon';
import { TooltipModule } from 'primeng/tooltip';
import { ChequesTypes } from '../../widgets/cheque-in/model';
import { Cheque } from '../../widgets/cheque-out/model';

@Component({
  selector: 'app-cheque-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, TranslocoDirective, ShortNumberPipe, TooltipModule, MaskedPipe, DateView],
  template: `
    <div
      *transloco="let t; prefix: 'dashboard'"
      data-testid="DASH_CHEQUE_OUT_CHEQUE_CARD"
      class="flex w-full items-center justify-between gap-2 px-1 py-2">
      <div class="flex items-center gap-3">
        <div class="image flex-none">
          <icon
            data-testid="DASH_CHEQUE_OUT_CHEQUE_CARD_ICON"
            [class.dark-mode]="darkMode()"
            [name]="chequeIcon()">
          </icon>
        </div>

        <div class="content flex flex-col">
          <p
            data-testid="DASH_CHEQUE_OUT_CHEQUE_CARD_SERIAL_NUMBER"
            class="text-md font-medium">
            {{ cheque()?.chequeSerialNumber }}
          </p>
          <p
            data-testid="DASH_CHEQUE_OUT_CHEQUE_CARD_ACCOUNT_NO"
            pInputText
            [pTooltip]="t('chequeOut.accountNumber') + ' ' + cheque()?.debitAccountNumber"
            tooltipPosition="bottom"
            placeholder="bottom"
            class="text-text-tertiary truncate-force text-sm">
            {{ t('chequeOut.accountNumber') }} {{ cheque()?.debitAccountNumber }}
          </p>
        </div>
      </div>
      <div class="flex flex-none items-center gap-2">
        <div class="value flex flex-col">
          <p class="ltr-force self-end">
            <span
              data-testid="DASH_CHEQUE_OUT_CHEQUE_CARD_VALUE"
              class="text-sm font-semibold">
              {{ cheque()?.chequeValue | shortNumber | mask: layoutFacade.showBalances() }}
            </span>
            <span
              data-testid="DASH_CHEQUE_OUT_CHEQUE_CARD_CURRENCY"
              class="text-text-secondary text-xs font-normal">
              {{ cheque()?.currency }}
            </span>
          </p>
          <date-view
            data-testid="DASH_CERTIFICATE_BASIC_DETAIL_TITLE"
            [value]="cheque()?.date"
            class="text-text-tertiary text-sm"
            [pTooltip]="dateText()"
            tooltipPosition="bottom"
            variant="sm" />
        </div>
        <div class="details">
          @if (isArabic()) {
            <icon
              data-testid="DASH_CHEQUE_OUT_CHEQUE_NEXT_ICON"
              name="chevron-left" />
          } @else {
            <icon
              data-testid="DASH_CHEQUE_OUT_CHEQUE_NEXT_ICON"
              name="chevron-right" />
          }
        </div>
      </div>
    </div>
  `,
  styles: `
    .dark-img {
      display: none;
    }
    .dark .dark-img {
      display: block;
    }
    .dark .light-img {
      display: none;
    }
  `,
})
export class ChequeCard {
  readonly darkMode = computed(() => this.layoutFacade.isDarkTheme());
  readonly chequesTypesEnum = ChequesTypes;
  readonly cheque = input<Cheque>();
  readonly type = input<'deducted' | 'returned' | 'collected' | 'postdated'>();
  layoutFacade = inject(LayoutFacadeService);
  dateText = input<string>('');
  readonly isArabic = computed(() => {
    const lang = this.layoutFacade.language();
    return lang === 'ar' ? true : false;
  });

  readonly chequeIcon = computed(() => {
    const isDarkMode = this.darkMode();

    const iconsMap = {
      deducted: isDarkMode ? 'cheque-deducted-dark' : 'cheque-deducted',
      returned: isDarkMode ? 'cheque-returned-dark' : 'cheque-returned',
    };

    return this.type() ? iconsMap[this.type() as keyof typeof iconsMap] : '';
  });
}
