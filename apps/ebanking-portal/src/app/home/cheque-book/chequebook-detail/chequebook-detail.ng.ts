import { CommonModule } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppBreadcrumbsComponent, CurrencyView, DateView, Skeleton } from '@/core/components';
import { RolePermissionDirective } from '@/core/directives/role-permission.directive';
import { apiStatus } from '@/core/models/api';
import { ChequeBookStore } from '@/home/cheque-book/chequebook.store';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Card } from '@scb/ui/card';
import { Icon } from '@scb/ui/icon';
import { Separator } from '@scb/ui/separator';
import { ChequebookDetail, ChequeBookInfo } from '../chequebook.model';
import { ChequeBookService } from '../request-chequebook/chequebook.service';
import { ChequeBookCollectionInstruction } from '../request-chequebook/components/cheque-collection-instructions.ng';

@Component({
  selector: 'chequebook-detail',
  imports: [
    CommonModule,
    AppBreadcrumbsComponent,
    TranslocoDirective,
    Card,
    Icon,
    Separator,
    CurrencyView,
    DateView,
    ChequeBookCollectionInstruction,
    Skeleton,
    RolePermissionDirective,
  ],
  templateUrl: './chequebook-detail.ng.html',
})
export class ChequeBookDetail {
  readonly chequeBookService = inject(ChequeBookService);

  readonly inputDetail = input<ChequeBookInfo | undefined>();
  readonly detail = signal<ChequeBookInfo | undefined>(undefined);
  readonly chequeBookStore = inject(ChequeBookStore);
  readonly route = inject(ActivatedRoute);
  readonly translocoService = inject(TranslocoService);
  readonly accountId = computed(() => this.route.snapshot.paramMap.get('id') || '');

  isRequestSubmitted = input<boolean>(false);

  readonly chequebookDetailResource = httpResource<ChequebookDetail>(() => {
    const accountNumber = this.accountId();
    if (!accountNumber) return undefined;

    return {
      url: `/api/product/chequebooks/detail`,
      params: {
        accountId: this.accountId(),
      },
    };
  });
  readonly status = apiStatus(this.chequebookDetailResource.status);
  readonly data = this.chequeBookService.chequeBookInfo;
  readonly chequebookDetail = computed(() => this.chequebookDetailResource.value());

  readonly statusKeys = ['UNDER_REVIEW', 'APPROVED', 'PRINTING', 'AT_BRANCH', 'RECEIVED'] as const;

  readonly statusMap = {
    en: {
      UNDER_REVIEW: 'Under Reviewing',
      APPROVED: 'Approved',
      PRINTING: 'Printed',
      AT_BRANCH: 'At Branch Side',
      RECEIVED: 'Received',
    },
    ar: {
      UNDER_REVIEW: 'قيد المراجعة',
      APPROVED: 'تمت الموافقة',
      PRINTING: 'تم الطباعة',
      AT_BRANCH: 'في الفرع',
      RECEIVED: 'تم الاستلام',
    },
  };

  getStatusHistory(): { status: string; date: string }[] {
    const detail = this.detail();
    const history = detail?.statusHistory ?? [];
    if (history.length === 0 && detail?.requestDate && !this.chequeBookService.isError()) {
      return [{ status: 'UNDER_REVIEW', date: detail.requestDate }];
    }
    return history;
  }

  getStatusDate(status: string): string | null {
    const history = this.getStatusHistory();
    const match = history.find(item => item.status === status);
    return match?.date ?? null;
  }

  get lang(): 'en' | 'ar' {
    return this.translocoService.getActiveLang() as 'en' | 'ar';
  }

  constructor() {
    effect(() => {
      const detailData = this.data() ?? this.chequebookDetail();
      if (detailData) {
        this.detail.set(detailData);
      }
    });
  }
}
