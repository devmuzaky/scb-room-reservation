import { MaskedPipe } from '@/core/pipes/masked.pipe';
import { ShortNumberPipe } from '@/core/pipes/short-number.pipe';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { Chart, ChartTypeRegistry, TooltipModel } from 'chart.js';

export type ChartTooltipContext = { chart: Chart; tooltip: TooltipModel<keyof ChartTypeRegistry> };

export interface FacilitiesOverviewList {
  type: string;
  utilized: string;
  authorized: string;
  currency: string;
}

export interface FacilitiesOverviewRes {
  lastUpdated: string;
  totalAuthorizedLimit: string;
  totalUtilizedLimit: string;
  availableLimit: string;
  maturityDate?: string;
  facilities: FacilitiesOverviewList[];
}

export const externalTooltip = (
  shortNumber: ShortNumberPipe,
  masked: MaskedPipe,
  layoutFacade: LayoutFacadeService,
) => {
  return {
    enabled: false,
    external: (context: ChartTooltipContext) => {
      let tooltipEl = document.getElementById('chartjs-tooltip');

      if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.id = 'chartjs-tooltip';
        tooltipEl.innerHTML =
          '<div id="tooltip-content" class="bg-black-inverted text-text-inverted py-md px-lg rounded-lg body-label-sm-m"></div>';
        document.body.appendChild(tooltipEl);
      }

      const tooltipModal = context.tooltip;
      if (tooltipModal.opacity === 0) {
        tooltipEl.style.opacity = '0';
        return;
      }

      if (tooltipModal.body) {
        const titleLines = tooltipModal.title || [];
        const bodyLines = tooltipModal.body.flatMap(b => b.lines);

        const tooltipContent = document.getElementById('tooltip-content')!;
        const [title, currency = ''] = titleLines[0].split('#');
        tooltipContent.innerHTML = `${title}: ${masked.transform(shortNumber.transform(bodyLines[0]), layoutFacade.showBalances())} ${currency}`;
      }

      const position = context.chart.canvas.getBoundingClientRect();
      tooltipEl.style.opacity = '1';
      tooltipEl.style.position = 'absolute';
      let left = position.left + window.pageXOffset + tooltipModal.caretX;
      tooltipEl.style.top = position.top + window.pageYOffset + tooltipModal.caretY + 'px';
      tooltipEl.style.pointerEvents = 'none';

      const tRect = tooltipEl.getBoundingClientRect();
      if (left < position.left + position.width / 3) {
        left = left - tRect.width - 8;
      } else {
        left += 8;
      }
      tooltipEl.style.left = `${left}px`;
    },
  };
};
