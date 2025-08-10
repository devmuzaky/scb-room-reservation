import { signal } from '@angular/core';
import { MaskedPipe } from '@/core/pipes/masked.pipe';
import { ShortNumberPipe } from '@/core/pipes/short-number.pipe';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { externalTooltip } from './facilities.models';

describe('Facilities Utils', () => {
  it('should call the external on tooltip', () => {
    const tooltip = externalTooltip(
      { transform: value => value } as ShortNumberPipe,
      { transform: value => value } as MaskedPipe,
      { showBalances: signal(true) } as LayoutFacadeService,
    );
    const context = {
      tooltip: {
        opacity: 1,
        body: [{ lines: '' }],
        title: [''],
        caretX: 0,
        caretY: 0,
      },
      chart: {
        canvas: {
          getBoundingClientRect: () => ({
            left: 0,
            top: 0,
            width: 0,
          }),
        },
      },
    };

    tooltip.external(context as any);
    const el = document.getElementById('chartjs-tooltip');
    expect(el).toBeTruthy();
    expect(el?.style.opacity).toBe('1');

    context.tooltip.opacity = 0;
    tooltip.external(context as any);
    expect(el?.style.opacity).toBe('0');
  });
});
