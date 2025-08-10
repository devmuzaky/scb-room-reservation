import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-cc-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="py-md px-lg text-text-always-light ltr-force relative h-[193px] w-[308px] rounded-[12.897px] bg-[#092644]">
      <img
        src="/cc-left-pattern.svg"
        alt="cc-right"
        class="absolute bottom-[17px] left-0" />
      <img
        src="/cc-right-pattern.svg"
        alt="cc-right"
        class="absolute top-0 right-0" />
      <img
        src="/mastercard-logo.svg"
        alt="mastercard-logo"
        class="absolute right-[15.72px] bottom-[10px]" />
      <div class="flex items-center justify-between">
        <img
          src="/card-logo.svg"
          alt="card logo" />
        <h4 class="body-label-sm-m">{{ las8Digit() }}</h4>
      </div>
      <div class="right-xl body-sm absolute top-[90px] flex items-center gap-1.5">
        <div class="caption">{{ expMonthYear() }}</div>
        <img
          src="/cc-valid-thru.svg"
          alt="valid-thru"
          class="h-[9.177px] w-[15.585px]" />
      </div>
      <div class="bottom-xl left-xl body-sm absolute w-[178px]">
        <div>{{ name() }}</div>
        <div class="line-clamp-1">{{ company() }}</div>
      </div>
    </div>
  `,
})
export class CcCard {
  readonly cardNumber = input.required<string>();
  readonly expires = input.required<string>();
  readonly name = input.required<string>();
  readonly company = input.required<string>();

  readonly las8Digit = computed(() => {
    const len = this.cardNumber().length;
    return this.cardNumber().substring(len - 8, len);
  });

  readonly expMonthYear = computed(() => {
    const [year, mon] = this.expires().split('-');
    return `${mon}/${year.substring(2, 4)}`;
  });
}
