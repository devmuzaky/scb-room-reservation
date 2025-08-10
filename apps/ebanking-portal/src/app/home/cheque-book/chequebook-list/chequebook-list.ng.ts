import { NgClass } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, inject, signal, untracked, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DateView, SelectFooter, SelectValue, Skeleton } from '@/core/components';
import { RolePermissionDirective } from '@/core/directives/role-permission.directive';
import { apiStatus } from '@/core/models/api';
import { ChequeBookStore } from '@/home/cheque-book/chequebook.store';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Badge } from '@scb/ui/badge';
import { Button } from '@scb/ui/button';
import { Card } from '@scb/ui/card';
import { FormField } from '@scb/ui/form-field';
import { Icon } from '@scb/ui/icon';
import { Option, Select, SelectTrigger } from '@scb/ui/select';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { ChequebookApiResponse, ChequebookItem } from '../chequebook.model';
import { ChequeBookService } from '../request-chequebook/chequebook.service';

@Component({
  selector: 'app-chequebook-list',
  imports: [
    BreadcrumbModule,
    FormField,
    Card,
    Badge,
    Select,
    Option,
    SelectTrigger,
    SelectValue,
    SelectFooter,
    RadioButtonModule,
    Button,
    SelectModule,
    FormsModule,
    MultiSelectModule,
    Icon,
    TranslocoDirective,
    Icon,
    NgClass,
    Skeleton,
    DateView,
    RolePermissionDirective,
  ],
  templateUrl: './chequebook-list.ng.html',
})
export class ChequeBookListComponent {
  readonly chequeBookService = inject(ChequeBookService);
  readonly translocoService = inject(TranslocoService);
  readonly chequeBookStore = inject(ChequeBookStore);
  readonly router = inject(Router);
  statusValue = signal<string[]>([]);
  readonly searchTerm = signal('');

  readonly statusTypeSelect = viewChild<Select<string>>('statusTypeSelect');

  readonly refresh = signal(1);
  readonly chequeBookListResource = httpResource<ChequebookApiResponse>(() => {
    const _ = this.refresh();
    const params = untracked(() => {
      const queryParts = [
        `pageStart=0`,
        `pageSize=100`,
        ...this.statusValue()
          .filter(Boolean)
          .map(status => `status=${(status as string).trim().toUpperCase()}`),
      ];

      return queryParts.join('&');
    });

    return {
      url: `/api/product/chequebooks/list?${params}`,
    };
  });

  readonly chequeBookList = computed(() => this.chequeBookListResource.value()?.chequebooks || []);
  readonly status = apiStatus(this.chequeBookListResource.status);

  readonly isChequeBookListEmpty = computed(() => {
    return this.chequeBookListResource.value()?.chequebooks.length === 0;
  });

  readonly statusList = computed(() => {
    return this.statusListMap.map(item => ({
      value: item.en,
      label: item[this.lang()],
    }));
  });

  readonly isSearchApplied = computed(() => {
    const hasSearch = this.searchTerm().trim().length > 0;
    const hasStatusFilter = this.statusValue().length > 0;
    const isEmptyResult = this.filteredChequeBookList().length === 0;

    return (hasSearch || hasStatusFilter) && isEmptyResult;
  });

  readonly filteredChequeBookList = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const list = this.chequeBookList();

    return list.filter(item => {
      const matchesSearch =
        !term || item.accountNumber?.toLowerCase().includes(term) || item.accountNickname?.toLowerCase().includes(term);

      return matchesSearch;
    });
  });

  goToChequeBookDetail(data: ChequebookItem) {
    this.chequeBookStore.setChequeBookDetail(data);
    this.router.navigate(['/chequebook/chequebook-detail', data.accountNumber]);
  }

  addChequeBook() {
    this.router.navigate(['/chequebook/new-chequebook']);
  }

  applyFilter() {
    const selected = this.statusValue();
    const selectedStatus = selected.map(value => {
      const found = this.statusListMap.find(item => item.ar === value || item.en === value);
      return found?.en || value;
    });
    this.statusValue.set(selectedStatus);
    this.statusTypeSelect()?.close();
    this.reload();
  }

  resetFilter() {
    this.reload();
  }

  clearFilter() {
    this.statusValue.set([]);
    this.reload();
  }
  reload() {
    this.refresh.update(x => x + 1);
  }

  lang(): 'en' | 'ar' {
    return this.translocoService.getActiveLang() as 'en' | 'ar';
  }

  readonly statusListMap = [
    { en: 'Under Reviewing', ar: 'قيد المراجعة' },
    { en: 'Approved', ar: 'تمت الموافقة' },
    { en: 'Printed', ar: 'تم الطباعة' },
    { en: 'At Branch Side', ar: 'في الفرع' },
    { en: 'Received', ar: 'تم الاستلام' },
  ];
}
