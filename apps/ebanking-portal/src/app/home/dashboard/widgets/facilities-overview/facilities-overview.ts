import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, ResourceStatus } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { CurrencyView, Skeleton } from '@/core/components';
import { MaskedPipe } from '@/core/pipes/masked.pipe';
import { ShortNumberPipe } from '@/core/pipes/short-number.pipe';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { ChartModule } from 'primeng/chart';
import { DashboardWidget } from '../../dashboard-widget/dashboard-widget.ng';
import { externalTooltip, FacilitiesOverviewList, FacilitiesOverviewRes } from './facilities.models';

@Component({
  selector: 'app-facilities-overview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ShortNumberPipe, MaskedPipe],
  imports: [RouterLink, DashboardWidget, Skeleton, Button, TranslocoDirective, ChartModule, CurrencyView],
  templateUrl: './facilities-overview.html',
})
export class FacilitiesOverview {
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly transloco = inject(TranslocoService);
  readonly shortNumber = inject(ShortNumberPipe);
  readonly masked = inject(MaskedPipe);

  readonly facilitiesData = httpResource<FacilitiesOverviewRes>(() => {
    return { url: `/api/dashboard/facilities-overview` };
  });
  readonly typesOfFacilities: Record<string, [string, string]> = {
    Overdraft: ['bg-blue-300', '--color-blue-300'],
    Cards: ['bg-brand-700', '--color-brand-700'],
    LCs: ['bg-green-400', '--color-green-400'],
    Loans: ['bg-amber-300', '--color-amber-300'],
    LGs: ['bg-purple-400', '--color-purple-400'],
    IDCs: ['bg-amber-600', '--color-amber-600'],
    Remaining: ['bg-overlay', '--color-overlay'],
  };

  readonly status = computed(() => {
    switch (this.facilitiesData.status()) {
      case ResourceStatus.Loading:
      case ResourceStatus.Reloading:
        return 'loading';
      case ResourceStatus.Error:
        return 'error';
      default:
        return 'default';
    }
  });

  readonly onLangLoaded = toSignal(this.transloco.events$.pipe(filter(x => x.type === 'translationLoadSuccess')));
  private localLang = this.layoutFacade.language();
  readonly lang = computed(() => {
    const _ = this.onLangLoaded();
    const lang = this.layoutFacade.language();
    const isLoaded = Object.keys(this.transloco.getTranslation(lang)).length;
    this.localLang = isLoaded ? lang : this.localLang;
    return this.localLang;
  });

  readonly facilities = computed(() => {
    const values = this.facilitiesData.value()?.facilities ?? [];
    return values.filter(x => this.typesOfFacilities[x.type]);
  });

  readonly data = computed(() => {
    const _ = this.layoutFacade.isDarkTheme();
    const __ = this.lang();
    const value = this.facilitiesData.value();
    if (!value) return value;
    const facilities = [
      ...this.facilities(),
      { type: 'Remaining', utilized: value.availableLimit, currency: 'EGP' } as FacilitiesOverviewList,
    ];
    const backgroundColor = facilities.map(x => this.documentStyle.getPropertyValue(this.typesOfFacilities[x.type][1]));
    return {
      labels: facilities.map(x => `${this.transloco.translate(`facilitiesOverview.${x.type}`)}#${x.currency}`),
      datasets: [
        {
          data: facilities.map(x => x.utilized),
          backgroundColor,
          hoverBackgroundColor: backgroundColor,
        },
      ],
    };
  });
  readonly documentStyle = getComputedStyle(document.documentElement);

  readonly options = {
    cutout: '80%',
    plugins: {
      legend: false,
      tooltip: externalTooltip(this.shortNumber, this.masked, this.layoutFacade),
    },
    parsing: false,
    borderColor: 'transparent',
  };
}
