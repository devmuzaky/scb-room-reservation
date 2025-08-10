import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MaskValue } from '@/core/pipes/masked.pipe';
import { ShortNumber } from '@/core/pipes/short-number.pipe';

function isNullOrUndefined(val: any) {
  return val === undefined || val === null;
}

@Component({
  selector: 'currency-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="{{
        (size() === 'lg'
          ? 'head-2xs-s'
          : size() === 'xs'
            ? 'head-xs-s'
            : size() === 'm'
              ? 'body-sm'
              : size() === 'xl'
                ? 'head-xl-s'
                : 'body-sm-s') + (variant() === 'primary' ? ' text-brand' : '')
      }}">
      {{ viewAmount() || emptyValue() }}
    </span>
    @if (viewCurrency(); as c) {
      <span
        class="{{
          'text-text-secondary uppercase ' + (size() === 'sm' ? 'caption' : size() === 'm' ? 'body-sm' : 'body-md')
        }}"
        >{{ c }}</span
      >
    }
  `,
  host: {
    class: 'flex gap-sm ltr-force rtl:justify-end items-center',
  },
})
export class CurrencyView {
  readonly amount = input.required<string | number | undefined | null>();
  readonly currency = input<string | undefined | null>('EGP');
  readonly emptyValue = input('');
  readonly show = input(true);
  readonly short = input(false, { transform: booleanAttribute });
  readonly size = input<'sm' | 'lg' | 'xs' | 'm' | 'xl'>('lg');
  readonly variant = input<'primary' | 'default'>('default');
  readonly nonZero = input(false, { transform: booleanAttribute });
  readonly decimalPlaces = input<number | undefined>(undefined);

  readonly shortAmount = computed(() => ShortNumber.convert(this.amount(), this.short(), this.decimalPlaces()));

  readonly viewAmount = computed(() => {
    const v = MaskValue.convert(this.shortAmount(), this.show());
    return this.nonZero() && v === '0' ? undefined : v;
  });
  readonly viewCurrency = computed(() =>
    !this.viewAmount() || isNullOrUndefined(this.viewAmount()) ? undefined : this.currency(),
  );
}
