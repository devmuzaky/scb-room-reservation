import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { BeneficiaryIcon } from '@/home/beneficiary/list/beneficiary-icon.ng';
import { Beneficiary } from '@/home/beneficiary/models/models';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective } from '@jsverse/transloco';
import { Badge } from '@scb/ui/badge';

@Component({
  selector: 'app-beneficiary-selected-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Badge, TranslocoDirective, BeneficiaryIcon],
  template: `<div class="">
    <div class="gap-lg flex flex-1 items-center">
      <beneficiary-icon [tMethod]="beneficiary().transactionMethod" />
      <div class="gap-sm flex flex-1 flex-col">
        <div class="head-xs-s truncate-force">{{ beneficiary().beneficiaryName }}</div>
        <div class="text-text-secondary body-md">{{ beneficiary().beneficiaryNickname }}</div>
        <div class="text-text-tertiary body-md">{{ bankName() }}</div>
        <div
          class="gap-sm flex items-center"
          *transloco="let t; prefix: 'transfer'">
          <scb-badge
            class="whitespace-nowrap"
            size="xs">
            {{ t(beneficiary().transactionMethod) }}
          </scb-badge>
          <div class="text-text-tertiary body-sm truncate-force">{{ beneficiary().beneficiaryNumber }}</div>
        </div>
      </div>
    </div>
  </div>`,
  host: {
    class: 'border-border-secondary p-xl flex flex-1 rounded-lg border',
  },
})
export class BeneficiarySelectedView {
  readonly beneficiary = input.required<Beneficiary>();
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly bankName = computed(() =>
    this.layoutFacade.isArabic() ? this.beneficiary().bank?.bankNameAr : this.beneficiary().bank?.bankNameEn,
  );
}
