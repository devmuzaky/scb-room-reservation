import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppBreadcrumbsComponent } from '@/core/components';
import { CanDeactivateComponent } from '@/core/guards/can-deactivate-leave.guard';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Card } from '@scb/ui/card';
import { AddBeneficiaryFormComponent } from './add-form.ng';

@Component({
  selector: 'app-add-form-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AddBeneficiaryFormComponent, AppBreadcrumbsComponent, Card, TranslocoDirective],
  template: `
    <section class="col-span-12 max-sm:hidden">
      <app-breadcrumbs
        *transloco="let t; prefix: 'breadcrumbs'"
        [routes]="[
          { label: t('beneficiary'), path: '/beneficiary' },
          { label: this.type === 'inside' ? t('addBeneficiaryInside') : t('addBeneficiaryOutside') },
        ]"></app-breadcrumbs>
    </section>

    <scb-card class="py-3xl px-xl col-span-12 2xl:col-span-10 2xl:col-start-2">
      <beneficiary-add-form [type]="type" />
    </scb-card>
  `,
  host: {
    class: `container-grid px-3xl pt-3xl `,
  },
})
export default class AddBeneficiaryFormContainer implements CanDeactivateComponent {
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly translateService = inject(TranslocoService);
  readonly type = this.route.snapshot.params['type'] as 'inside' | 'outside';

  closed(result: boolean | any) {
    if (result === false) {
      this.router.navigate(['/beneficiary']);
    }
  }

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
