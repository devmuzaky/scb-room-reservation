import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, ResourceStatus, signal } from '@angular/core';
import { AppBreadcrumbsComponent, CardSkeletonComponent } from '@/core/components';
import { TranslocoDirective } from '@jsverse/transloco';
import { Card } from '@scb/ui/card';
import { Icon } from '@scb/ui/icon';
import { Tab, TabLazy, Tabs } from '@scb/ui/tabs';
import { FacilitiesOverviewRes } from '../dashboard/widgets/facilities-overview/facilities.models';
import { FacilitiesBasicDetailsComponent } from './basic/basic-details';
import { CreditCard } from './credit-card/credit-card.ng';
import IDCTableComponent from './idc/idc-ng';
import { Lcs } from './lcs/lcs.ng';
import LGSTableComponent from './lgs/lgs-ng';
import { LoansTabComponent } from './loans/loans.ng';
import { OverdraftTabComponent } from './overdraft/overdraft.ng';

@Component({
  selector: 'facilities-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe, CurrencyPipe, DecimalPipe],
  imports: [
    FacilitiesBasicDetailsComponent,
    OverdraftTabComponent,
    LoansTabComponent,
    TranslocoDirective,
    Card,
    Icon,
    CardSkeletonComponent,
    Tabs,
    Tab,
    TabLazy,
    Lcs,
    AppBreadcrumbsComponent,
    LGSTableComponent,
    IDCTableComponent,
    CreditCard,
  ],
  templateUrl: './facilities.html',
  host: {
    class: `container-grid py-3xl px-3xl gap-2xl`,
  },
})
export default class FacilitiesPage {
  readonly selectedTab = signal<FacilitiesTabsEnum>(0);

  readonly FAresource = httpResource<FacilitiesOverviewRes>(() => {
    return { url: `/api/dashboard/facilities-overview` };
  });

  readonly status = computed(() => {
    switch (this.FAresource.status()) {
      case ResourceStatus.Loading:
      case ResourceStatus.Reloading:
        return 'loading';
      case ResourceStatus.Error:
        return 'error';
      default:
        return 'default';
    }
  });
}

export type FacilitiesTabs = 'OD' | 'LC' | 'LG' | 'CC' | 'Loans' | 'IDC';

export enum FacilitiesTabsEnum {
  OD = 0,
  Loans = 1,
  CC = 2,
  LG = 3,
  LC = 4,
  IDC = 5,
}
