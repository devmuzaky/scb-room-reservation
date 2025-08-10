import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { Card } from '@scb/ui/card';
import { Icon } from '@scb/ui/icon';

@Component({
  selector: 'app-banner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card, Button, TranslocoDirective, Icon, RouterLink],
  template: `
    <scb-card
      class="p-xl banner-bg rtl:banner-bg-rtl flex flex-col rounded-lg"
      *transloco="let t; prefix: 'dashboard'">
      <div class="gap-lg flex w-full justify-between">
        <div class="gap-lg relative flex flex-1 flex-col">
          <div>
            <h4 class="head-2xs-s 2xl:head-lg-sm text-text-always-light">{{ t('banner.bannerTitle') }}</h4>
            <p class="body-sm 2xl:body-lg text-brand-50">
              {{ t('banner.bannerDesc') }}
            </p>
          </div>

          <button
            routerLink="{{ routerLink() }}"
            scbButton
            type="button"
            size="xs"
            variant="secondary"
            class="w-[132px]"
            data-testid="AU_BTN_CONTINUE">
            {{ t('banner.applyNow') }}
          </button>
        </div>

        <img
          [src]="'icons/line-pattern.svg'"
          class="absolute -bottom-1 sm:bottom-0 ltr:right-6 ltr:sm:right-[142px] rtl:left-6 rtl:sm:left-[142px]"
          alt="No Image" />
        <div>
          <icon
            name="banner-badge"
            class="text-icon-disabled 2xl:w-9xl w-[72px]" />
        </div>
      </div>
    </scb-card>
  `,
})
export class Banner {
  readonly routerLink = input.required<string>();
}
