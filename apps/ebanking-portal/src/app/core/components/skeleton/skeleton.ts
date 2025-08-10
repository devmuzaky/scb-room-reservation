import { Component, input } from '@angular/core';

@Component({
  selector: 'scb-skeleton',
  template: ``,
  host: {
    class: 'block animate-pulse bg-overlay mb-xl',
    '[class]': `shape() === 'rectangle' ? 'rounded-lg' : 'rounded-full'`,
    '[style.width]': 'width()',
    '[style.height]': 'height()',
  },
})
export class Skeleton {
  readonly shape = input<'rectangle'>('rectangle');
  readonly width = input('100%');
  readonly height = input('20px');
}
