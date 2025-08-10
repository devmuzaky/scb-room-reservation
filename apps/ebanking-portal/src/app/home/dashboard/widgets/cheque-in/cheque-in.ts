import { NgClass, SlicePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Skeleton } from '@/core/components';
import { apiStatus } from '@/core/models/api';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { Icon } from '@scb/ui/icon';
import { Selectable, SelectableItem } from '@scb/ui/selectable';
import { DashboardWidget } from '../../dashboard-widget/dashboard-widget.ng';
import { ChequeInCard } from '../../ui/cheque-in-card/cheque-in-card';
import { ChequeInResponse, Tabs } from './model';

@Component({
  selector: 'app-cheque-in',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DashboardWidget,
    Skeleton,
    SlicePipe,
    TranslocoDirective,
    ChequeInCard,
    Selectable,
    SelectableItem,
    Button,
    Icon,
    ChequeInCard,
    NgClass,
    RouterLink,
  ],
  templateUrl: './cheque-in.html',
})
export class ChequeIn {
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly activeIndex = 'collected';

  readonly darkMode = computed(() => this.layoutFacade.isDarkTheme());
  readonly tabs = Tabs;
  readonly list = httpResource<ChequeInResponse>(() => {
    return { url: `/api/dashboard/cheques/overview/cheques-In` };
  });

  readonly collectedList = computed(() => this.list.value()?.collected);

  readonly returnedList = computed(() => this.list.value()?.returned);

  readonly postDatedList = computed(() => this.list.value()?.postDated);

  readonly showSeeAll = computed(
    () => this.collectedList()?.length || this.returnedList()?.length || this.postDatedList()?.length,
  );

  readonly status = apiStatus(this.list.status);
}
