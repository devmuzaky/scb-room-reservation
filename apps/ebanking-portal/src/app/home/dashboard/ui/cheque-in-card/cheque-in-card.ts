import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';
import { MaskedPipe } from '@/core/pipes/masked.pipe';
import { ShortNumberPipe } from '@/core/pipes/short-number.pipe';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective } from '@jsverse/transloco';
import { Icon } from '@scb/ui/icon';
import { TooltipModule } from 'primeng/tooltip';
import { ChequeIn, ChequesTypes } from '../../widgets/cheque-in/model';

@Component({
  selector: 'app-cheque-in-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, TranslocoDirective, DatePipe, ShortNumberPipe, TooltipModule, MaskedPipe],
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
            class="mf-md font-medium">
            {{ cheque()?.chequeSerial }}
          </p>
          <p
            data-testid="DASH_CHEQUE_OUT_CHEQUE_CARD_ACCOUNT_NO"
            class="text-text-tertiary truncate-force mf-sm">
            {{ cheque()?.draweeBank }}
          </p>
        </div>
      </div>
      <div class="flex flex-none items-center gap-2">
        <div class="value flex flex-col">
          <p class="ltr-force self-end">
            <span
              data-testid="DASH_CHEQUE_OUT_CHEQUE_CARD_VALUE"
              class="mf-sm font-semibold">
              {{ cheque()?.chequeValue | shortNumber | mask: layoutFacade.showBalances() }}
            </span>
            <span
              data-testid="DASH_CHEQUE_OUT_CHEQUE_CARD_CURRENCY"
              class="text-text-secondary mf-xs font-normal">
              {{ cheque()?.currency }}
            </span>
          </p>

          @if (isArabic()) {
            <p
              data-testid="DASH_CHEQUE_OUT_CHEQUE_CARD_DATE"
              class="text-text-tertiary mf-sm"
              pInputText
              [pTooltip]="downloadTooltip"
              tooltipPosition="bottom"
              placeholder="bottom">
              {{ cheque()?.eventDate | date: 'dd MMMM yyyy' : undefined : 'ar-EG' }}
            </p>
            <ng-template #downloadTooltip>
              <p class="mf-sm whitespace-nowrap">{{ dateText() }}</p>
            </ng-template>
          } @else {
            <p
              data-testid="DASH_CHEQUE_OUT_CHEQUE_CARD_DATE"
              class="text-text-tertiary mf-sm"
              pInputText
              [pTooltip]="downloadTooltip"
              tooltipPosition="bottom"
              placeholder="bottom">
              {{ cheque()?.eventDate | date: 'dd MMM yyyy' : undefined : 'en-US' }}
            </p>
            <ng-template #downloadTooltip>
              <p class="mf-sm whitespace-nowrap">{{ dateText() }}</p>
            </ng-template>
          }
        </div>
        <div class="details text-icon-tertiary">
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
    .image icon.inline-block {
      display: contents;
    }
  `,
})
export class ChequeInCard {
  readonly darkMode = computed(() => this.layoutFacade.isDarkTheme());
  readonly chequesTypesEnum = ChequesTypes;
  readonly cheque = input<ChequeIn>();
  readonly type = input<'returned' | 'collected' | 'postdated'>();
  readonly dateText = input('');
  layoutFacade = inject(LayoutFacadeService);
  readonly isArabic = computed(() => {
    const lang = this.layoutFacade.language();
    return lang === 'ar' ? true : false;
  });

  readonly chequeIcon = computed(() => {
    const isDarkMode = this.darkMode();

    const iconsMap = {
      returned: isDarkMode ? 'cheque-returned-dark' : 'cheque-returned',
      collected: isDarkMode ? 'cheque-collected-dark' : 'cheque-collected',
      postdated: isDarkMode ? 'cheque-postdated-dark' : 'cheque-postdated',
    };

    return this.type() ? iconsMap[this.type() as keyof typeof iconsMap] : '';
  });
}
