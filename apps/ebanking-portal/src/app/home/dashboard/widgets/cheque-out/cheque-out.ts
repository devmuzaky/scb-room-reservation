import { SlicePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, ResourceStatus } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Skeleton } from '@/core/components';
import { TranslocoDirective } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { Icon } from '@scb/ui/icon';
import { Selectable, SelectableItem } from '@scb/ui/selectable';
import { DashboardWidget } from '../../dashboard-widget/dashboard-widget.ng';
import { ChequeCard } from '../../ui/cheque-card/cheque-card';
import { ChequeOutResponse, Tabs } from './model';

@Component({
  selector: 'app-cheque-out',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DashboardWidget,
    Skeleton,
    SlicePipe,
    TranslocoDirective,
    ChequeCard,
    Selectable,
    SelectableItem,
    Button,
    Icon,
    RouterLink,
  ],
  templateUrl: './cheque-out.html',
})
export class ChequeOut {
  readonly activeIndex = 'deducted';

  readonly tabs = Tabs;
  readonly list = httpResource<ChequeOutResponse>(() => {
    return `/api/dashboard/cheques/overview/cheques-out`;
  });

  readonly deductedList = computed(() => this.list.value()?.deductedCheques);

  readonly returnedList = computed(() => this.list.value()?.returnedCheques);

  readonly showSeeAll = computed(() => this.deductedList()?.length || this.returnedList()?.length);

  readonly status = computed(() => {
    switch (this.list.status()) {
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
