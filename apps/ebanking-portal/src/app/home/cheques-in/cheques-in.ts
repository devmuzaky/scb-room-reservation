import { httpResource } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { Bank } from '../dashboard/widgets/cheque-in/model';

@Injectable()
export class ChequesInData {
  private readonly layoutFacade = inject(LayoutFacadeService);
  private readonly bankData = httpResource<Bank[]>(() => {
    // We have to refetch the list on language change
    const _ = this.layoutFacade.language();
    return `/api/dashboard/lookups/banks/bank-list`;
  });

  readonly bankList = computed(() => this.bankData.value() || []);
}
