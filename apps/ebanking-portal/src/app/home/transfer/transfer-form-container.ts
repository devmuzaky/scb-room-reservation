import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppBreadcrumbsComponent } from '@/core/components';
import { CanDeactivateComponent } from '@/core/guards/can-deactivate-leave.guard';
import { CharityTransferForm } from '@/home/transfer/views/charity-transfer/charity-form';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { TransferType } from './model';
import { TransferService } from './transfer.service';
import { OwnAccountTransferForm } from './views/between-form/between-form';
import { InsideTransferForm } from './views/inside-transfer/inside-transfer';
import { OutsideTransferForm } from './views/outside-transfer/outside-transfer.ng';

@Component({
  selector: 'app-transfer-form-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TransferService],
  imports: [
    OwnAccountTransferForm,
    InsideTransferForm,
    OutsideTransferForm,
    CharityTransferForm,
    AppBreadcrumbsComponent,
    TranslocoDirective,
  ],
  template: `
    <section class="col-span-12 max-sm:hidden">
      <app-breadcrumbs
        *transloco="let t; prefix: 'breadcrumbs'"
        [routes]="[
          { label: t('transfer'), path: '/transfer' },
          {
            label:
              type === 'OWN'
                ? t('transferBetweenOwnAccounts')
                : type === 'INSIDE'
                  ? t('transferInside')
                  : type === 'OUTSIDE'
                    ? t('transferOutside')
                    : t('charityTransfer'),
          },
        ]"></app-breadcrumbs>
    </section>

    @if (type === 'OWN') {
      <between-form />
    } @else if (type === 'INSIDE') {
      <inside-transfer />
    } @else if (type === 'OUTSIDE') {
      <outside-transfer-form />
    } @else if (type === 'CHARITY') {
      <charity-form />
    }
  `,
  host: {
    class: `container-grid px-3xl pt-3xl `,
  },
})
export default class TransferFormContainer implements CanDeactivateComponent {
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly translateService = inject(TranslocoService);
  readonly type = this.route.snapshot.params['type'].toUpperCase() as TransferType;

  canDeactivate(): boolean {
    if (!this.layoutFacade.getCanLeave()) {
      const message = this.translateService.translate('beneficiary.addForm.confirmCloseBeneficiaryForm');
      return window.confirm(message);
    }
    return true;
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent) {
    if (!this.layoutFacade.getCanLeave()) {
      event.preventDefault();
      event.returnValue = '';
    }
  }
}
