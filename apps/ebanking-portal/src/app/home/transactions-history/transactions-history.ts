import { httpResource } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TransferLookupData } from './model';

@Injectable()
export class TransactionsHistoryData {
  private readonly layoutFacade = inject(LayoutFacadeService);
  private readonly lookupData = httpResource<TransferLookupData>(() => {
    const _ = this.layoutFacade.language();
    return {
      url: `/api/transfer/lookup/transfer-data`,
    };
  });

  readonly transferTypes = computed(() => this.lookupData.value()?.transferType || []);
  readonly transferStatus = computed(() => this.lookupData.value()?.transferStatus || []);
  readonly chargeBearer = computed(() => this.lookupData.value()?.chargeBearer || []);
  readonly frequencyType = computed(() => this.lookupData.value()?.frequencyType || []);
  readonly transferNetwork = computed(() => this.lookupData.value()?.transferNetwork || []);
}
