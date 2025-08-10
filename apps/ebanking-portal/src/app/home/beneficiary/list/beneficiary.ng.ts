import { CommonModule } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, inject, linkedSignal, signal, untracked, viewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SelectFooter, SelectValue, Skeleton, ToasterService } from '@/core/components';
import { RolePermissionDirective } from '@/core/directives/role-permission.directive';
import { apiStatus, Pagination } from '@/core/models/api';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { alertPortal } from '@scb/ui/alert-dialog';
import { Button } from '@scb/ui/button';
import { Card } from '@scb/ui/card';
import { dialogPortal } from '@scb/ui/dialog';
import { FormField } from '@scb/ui/form-field';
import { Icon } from '@scb/ui/icon';
import { Option, Select, SelectTrigger } from '@scb/ui/select';
import { MenuModule } from 'primeng/menu';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToastModule } from 'primeng/toast';
import { BeneficiaryData } from '../beneficiary.data';
import { UpdateBeneficiaryFormComponent } from '../edit-form/edit-form.ng';
import { BENEFICIARY_TRANSACTION_TYPE_OPTIONS, BENEFICIARY_TYPE_OPTIONS } from '../models/constants';
import { Beneficiary } from '../models/models';
import { BeneficiaryIcon } from './beneficiary-icon.ng';

@Component({
  selector: 'beneficiary',
  templateUrl: './beneficiary.ng.html',
  providers: [BeneficiaryData],
  imports: [
    CommonModule,
    Card,
    Skeleton,
    Icon,
    Button,
    TranslocoDirective,
    ToastModule,
    Select,
    SelectTrigger,
    Option,
    FormField,
    SelectFooter,
    SelectValue,
    RadioButtonModule,
    FormsModule,
    ReactiveFormsModule,
    BeneficiaryIcon,
    MenuModule,
    RolePermissionDirective,
  ],
  host: {
    class: `container-grid py-3xl px-3xl`,
  },
})
export default class BeneficiaryComponent {
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly router = inject(Router);
  readonly translate = inject(TranslocoService);
  readonly dialogPortal = dialogPortal();
  readonly alert = alertPortal();
  readonly transloco = inject(TranslocoService);
  readonly beneficiaryData = inject(BeneficiaryData);
  readonly toasterService = inject(ToasterService);

  readonly lang = computed(() => this.layoutFacade.language());
  readonly isDark = computed(() => this.layoutFacade.isDarkTheme());

  readonly transactionTypeValue = signal<string[]>([]);
  readonly _transactionTypeValue = linkedSignal(this.transactionTypeValue);

  readonly beneficiaryType = signal(BENEFICIARY_TYPE_OPTIONS[0]);

  readonly transactionFilterOptions = computed(() => BENEFICIARY_TRANSACTION_TYPE_OPTIONS);

  readonly beneficiaryTypeList = computed(() => BENEFICIARY_TYPE_OPTIONS);

  readonly transactionTypeSelect = viewChild<Select<string>>('transactionTypeSelect');

  readonly emptyState = computed(() => {
    return this.beneficiaries().length === 0 && this.pagination()?.totalSize === 0;
  });

  readonly activeFilter = computed(() => {
    return this.transactionTypeValue().length > 0 || this.beneficiaryType().key !== '';
  });

  readonly showFilters = computed(() => {
    return this.beneficiaries().length > 0 || this.activeFilter();
  });

  readonly showDefaultEmptyState = computed(() => this.emptyState() && !this.activeFilter());

  readonly beneficiaryOptions: BeneficiaryOption[] = [
    {
      icon: 'beneficiary-inside',
      iconDark: 'benef-inside-dark',
      title: 'inside',
    },
    {
      icon: 'beneficiary-outside',
      iconDark: 'benef-outside-dark',
      title: 'outside',
    },
  ];

  readonly refresh = signal(1);
  readonly resource = httpResource<BeneficiaryResponse>(() => {
    const beneficiaryType = this.beneficiaryType().key ?? '';
    const _ = this.refresh();
    const params = untracked(() => {
      const transactionMethod = this.transactionTypeValue().join(',');
      return {
        beneficiaryType,
        transactionMethod,
      };
    });

    return { url: `/api/transfer/beneficiary/list`, params };
  });

  readonly status = apiStatus(this.resource.status);

  readonly beneficiaries = computed(() => this.resource.value()?.data || []);

  readonly pagination = computed(() => this.resource.value()?.pagination);

  chooseAllTransactionType(ev: MouseEvent) {
    ev.preventDefault();
    ev.stopPropagation();

    if (this.transactionFilterOptions().length <= this.transactionTypeValue().length) {
      this.transactionTypeValue.set([]);
    } else {
      this.transactionTypeValue.set(this.transactionFilterOptions().map(x => x.key));
    }
  }

  applyFilter() {
    this.transactionTypeSelect()?.close();
    this.transactionTypeValue.set(this._transactionTypeValue());
    this.reload();
  }

  clearFilter() {
    this.transactionTypeValue.set([]);
    this.transactionTypeSelect()?.close();
    this.reload();
  }

  resetFilter() {
    this.transactionTypeValue.set([]);
    this.transactionTypeSelect()?.close();
    this.reload();
  }

  reload() {
    this.refresh.update(x => x + 1);
  }

  onBeneficiaryOptionClick(title: 'inside' | 'outside') {
    this.router.navigate(['/beneficiary/add', title]);
  }

  editBeneficiary(beneficiary: Beneficiary) {
    const d = this.dialogPortal.open(UpdateBeneficiaryFormComponent, {
      containerClassNames: ['bg-white h-full p-xl dark:bg-gray-850'],
      classNames: ['self-end mb-2xl 2xl:mb-0 2xl:self-center w-full! 2xl:w-[376px]!'],
      disableClose: true,
      fullWindow: false,
      data: {
        beneficiary: beneficiary,
      },
    });

    d.afterClosed.subscribe(res => {
      if (res) {
        this.reload();
      }
    });
  }

  deleteBeneficiary(beneficiary: Beneficiary) {
    const d = this.alert.open({
      title: this.transloco.translate('beneficiary.delete.title'),
      description: this.transloco.translate('beneficiary.delete.subTitle'),

      actions: [
        {
          text: this.transloco.translate('beneficiary.delete.confirm'),
          type: 'primary',
          handler: close => {
            this.beneficiaryData.deleteBeneficiary(beneficiary.beneficiaryId).subscribe(res => {
              d.close(true);
              this.toasterService.showSuccess({
                severity: 'success',
                summary: this.transloco.translate('beneficiary.delete.message'),
              });
            });
          },
        },
        {
          text: this.transloco.translate('beneficiary.delete.cancel'),
          type: 'ghost',
          handler: close => close(),
        },
      ],
    });

    d.afterClosed.subscribe(res => {
      if (res) {
        this.reload();
      }
    });
  }
}

export interface BeneficiaryResponse {
  data: Beneficiary[];
  pagination: Pagination;
}

type BeneficiaryOption = {
  icon: string;
  iconDark: string;
  title: 'inside' | 'outside';
};
