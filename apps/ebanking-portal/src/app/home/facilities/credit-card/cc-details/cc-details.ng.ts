import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CardSkeletonComponent, CurrencyView, DateView } from '@/core/components';
import { RolePermissionDirective } from '@/core/directives/role-permission.directive';
import { apiStatus } from '@/core/models/api';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { Card } from '@scb/ui/card';
import { Icon } from '@scb/ui/icon';
import { Separator } from '@scb/ui/separator';
import { ChartModule } from 'primeng/chart';
import { CreditCardDetails } from '../model';
import { CcCard } from './cc-card';
import { CcDetailsService } from './cc-details.service';

@Component({
  selector: 'app-cc-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CcCard,
    Separator,
    CurrencyView,
    Button,
    Icon,
    Card,
    CardSkeletonComponent,
    TranslocoDirective,
    ChartModule,
    CurrencyView,
    DateView,
    RolePermissionDirective,
  ],
  templateUrl: './cc-details.ng.html',
})
export class CcDetails {
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly ccDetails = inject(CcDetailsService);

  readonly typesOfFacilities: Record<string, [string, string]> = {
    'Utilized Amount': ['bg-brand-700', '--color-brand-700'],
    'Held Amount': ['bg-amber-300', '--color-amber-300'],
    'Card Limit': ['bg-overlay', '--color-overlay'],
  };
  readonly creditCardData = httpResource<CreditCardDetails>(() => {
    const _ = this.ccDetails.refresh();
    return { url: `/api/dashboard/credit-cards/${this.ccDetails.cardNumber}/details` };
  });
  readonly data = computed(() => {
    const _ = this.layoutFacade.isDarkTheme();
    const __ = this.layoutFacade.language();
    const value = this.creditCardData.value();
    if (!value) return value;
    const facilities = [
      { type: 'Utilized Amount', amount: value.utilizedAmount },
      // { type: 'Held Amount', amount: value.heldAmount },
      { type: 'Card Limit', amount: value.availableBalance },
    ];
    const backgroundColor = facilities.map(x => this.documentStyle.getPropertyValue(this.typesOfFacilities[x.type][1]));
    return {
      labels: facilities.map(x => `${x.type} ${value.currency}`),
      datasets: [
        {
          data: facilities.map(x => x.amount),
          backgroundColor,
          hoverBackgroundColor: backgroundColor,
        },
      ],
    };
  });
  readonly status = apiStatus(this.creditCardData.status);

  readonly documentStyle = getComputedStyle(document.documentElement);

  readonly options = {
    cutout: '80%',
    plugins: {
      legend: false,
      tooltip: { enabled: false },
    },
    parsing: false,
    borderColor: 'transparent',
  };

  constructor() {
    this.ccDetails.apiStatus.set(this.status);
    this.ccDetails.data.set(this.creditCardData.value);
  }
}
