import { DatePipe } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { LayoutFacadeService } from '@/layout/layout.facade.service';

@Component({
  selector: 'date-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe],
  template: `{{ output() }}`,
  host: {
    '[class]': `variant() === 'sm' ?  'mf-sm' : 'mf-md text-text-primary font-semibold'`,
  },
})
export class DateView {
  readonly datePipe = inject(DatePipe);
  readonly layoutFace = inject(LayoutFacadeService);

  readonly value = input.required<string | number | undefined>();
  readonly variant = input<'sm' | 'md'>('sm');
  readonly format = input('dd MMM yyyy');
  readonly istFormat = input(false, { transform: booleanAttribute });

  readonly output = computed(() => {
    const locale = this.layoutFace.language() === 'ar' ? 'ar-EG' : 'en-US';
    let value = this.value();
    if (this.istFormat() && value) {
      value = this.convertToDate(value.toString());
    }
    return value ? this.datePipe.transform(value, this.format(), undefined, locale) : '';
  });

  // Convert DD-MM-YYYY to Date object
  convertToDate(dateStr: string | undefined): string | undefined {
    if (!dateStr) return undefined;
    const [day, month, year] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toISOString();
  }
}
