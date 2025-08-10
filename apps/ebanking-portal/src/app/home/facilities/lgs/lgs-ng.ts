import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CurrencyView,
  DateView,
  DownloadButton,
  DownloadOptions,
  SelectFooter,
  SelectValue,
  TableSkeletonComponent,
} from '@/core/components';
import { apiStatus, Pagination } from '@/core/models/api';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective } from '@jsverse/transloco';
import { Breadcrumbs } from '@scb/ui/breadcrumb';
import { Button } from '@scb/ui/button';
import { FormField } from '@scb/ui/form-field';
import { Icon } from '@scb/ui/icon';
import { Option, Select, SelectTrigger } from '@scb/ui/select';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'lgs-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [Breadcrumbs, TranslocoDirective],
  imports: [
    BreadcrumbModule,
    TableModule,
    Select,
    SelectTrigger,
    Option,
    FormField,
    TranslocoDirective,
    Button,
    TableSkeletonComponent,
    Icon,
    PaginatorModule,
    DropdownModule,
    FormsModule,
    SelectModule,
    SelectFooter,
    SelectValue,
    DateView,
    CurrencyView,
    DownloadButton,
  ],
  templateUrl: './lgs-ng.html',
  host: {
    class: 'block rounded-4xl bg-foreground px-xl sm:px-3xl 2xl:px-xl py-3xl',
  },
})
export default class LGSTableComponent {
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly route = inject(ActivatedRoute);

  readonly darkMode = computed(() => this.layoutFacade.isDarkTheme());
  readonly lgsTypeValue = signal([]);
  readonly lang = computed(() => this.layoutFacade.language());
  readonly pageNumber = linkedSignal({ source: this.lang, computation: () => 0 });
  readonly totalPage = linkedSignal({ source: this.lang, computation: () => 1 });
  readonly first = signal(0);
  readonly rows = signal(10);
  readonly router = inject(Router);

  readonly isEmpty = computed(() => this.lgList().length === 0);
  readonly lgType = signal<lgsType[]>(['Advance payment', 'Performance', 'Bid']);

  readonly paginationSizeOptions = signal([
    { label: '10', value: 10 },
    { label: '20', value: 20 },
    { label: '50', value: 50 },
    { label: '100', value: 100 },
  ]);

  readonly downloadOption: DownloadOptions = {
    filename: 'facilities.facilitiesLgs.title',
    url: ext => {
      const queryParams = new URLSearchParams({
        page: this.pageNumber().toString(),
        size: this.rows().toString(),
      });
      return `/api/dashboard/files/export/lg/user/format/${ext}?${queryParams.toString()}`;
    },
  };

  readonly filterLgsType = (option: IgsType) => option.value;

  readonly idcLookUpTypes = httpResource<IgsTypeResponse>(() => {
    const _ = this.lang();
    return `/api/dashboard/lookup/static-data?listId=3`;
  });

  readonly lgTypes = httpResource<lgsTypes>(() => {
    const _ = this.lang();
    return `/api/dashboard/facilities-overview/getLgTypes`;
  });

  readonly refresh = signal(1);
  readonly lgsResource = httpResource<LGSResponse>(() => {
    const _ = this.refresh();
    const params = untracked(() => {
      const queryParts = [
        `pageStart=${this.pageNumber()}`,
        `pageSize=${this.rows()}`,
        ...this.lgsTypeValue()
          .filter(Boolean)
          .map(type => `lgType=${type}`),
      ];
      return queryParts.join('&');
    });

    return {
      url: `/api/dashboard/facilities-overview/lgList?${params}`,
    };
  });

  readonly status = apiStatus(this.lgsResource.status);

  readonly lgList = computed(() => this.lgsResource.value()?.lgList || []);
  readonly totalPages = computed(() => this.lgsResource.value()?.pagination.totalPages || 0);
  readonly totalSize = computed(() => this.lgsResource.value()?.pagination.totalSize || 0);
  readonly lgsLookupTypes = computed(() => {
    return (this.lgTypes.value()?.types || []).map(type => ({
      key: type,
      value: type,
    }));
  });

  onPageChange(e: PaginatorState) {
    this.first.set(e.first as number);
    this.pageNumber.set(e.page as number);
    this.rows.set(e.rows as number);
    this.reload();
  }

  applyFilter() {
    this.first.set(0);
    this.rows.set(10);
    this.reload();
  }

  resetFilter() {
    this.first.set(0);
    this.rows.set(10);
    this.reload();
  }

  clearFilter() {
    this.lgsTypeValue.set([]);
    this.reload();
  }

  onPageSizeChange(e: DropdownChangeEvent) {
    this.rows.set(e.value as number);
    this.reload();
  }

  reload() {
    this.refresh.update(x => x + 1);
  }

  navigateToDetails(lgNumber: string) {
    this.router.navigate(['/dashboard/lgs-details', lgNumber]);
  }
}

export type lgsType = 'Advance payment' | 'Performance' | 'Bid';
export interface LGS {
  lgNumber: string;
  oldNumber: string;
  lgType: string;
  lgAmount: number;
  currency: string;
  interestRate: number;
  maturityDate: string;
  tenor: string;
  interestFrequency?: string;
}

export interface LGSResponse {
  pagination: Pagination;
  lgList: LGS[];
}
export interface IgsTypeResponse {
  LG_TYPES: IgsType[];
}
export interface IgsType {
  key: string;
  value: string;
}

export interface lgsTypes {
  types: string[];
}
