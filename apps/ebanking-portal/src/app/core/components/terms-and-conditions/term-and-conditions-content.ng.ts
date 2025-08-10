import { DOCUMENT } from '@angular/common';
import { httpResource } from '@angular/common/http';
import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { Skeleton } from '@/core/components';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { Card } from '@scb/ui/card';
import { DialogRef } from '@scb/ui/portal';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-terms-and-conditions-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Card, Skeleton, TranslocoDirective, NgxExtendedPdfViewerModule],
  template: `
    <ng-container *transloco="let t; prefix: 'termsAndConditions'">
      <h4 class="head-sm-s text-center">{{ t('title') }}</h4>
      <div
        #scrollContent
        class="{{ 'gap-lg grid h-full flex-1 ' + (pdfSource.isLoading() ? 'overflow-hidden' : 'overflow-auto') }}">
        @if (pdfSource.isLoading()) {
          <scb-card>
            <scb-skeleton width="70%" />
            <scb-skeleton />
            <scb-skeleton />
            <scb-skeleton />
            <scb-skeleton />
            <scb-skeleton />
            <scb-skeleton />
            <scb-skeleton />
            <scb-skeleton />
          </scb-card>
        } @else {
          <ngx-extended-pdf-viewer
            [src]="pdfSrc()"
            [language]="layoutFacade.isArabic() ? 'ar-EG' : 'en-US'"
            [showSidebarButton]="false"
            [showToolbar]="false"
            [textLayer]="true">
          </ngx-extended-pdf-viewer>
        }
      </div>
      <button
        scbButton
        size="md"
        [disabled]="!enableButton()"
        (click)="close(true)">
        {{ t('acceptButton') }}
      </button>
    </ng-container>
  `,
  styles: `
    ::ng-deep .tnc_custom_class {
      height: inherit;
    }
  `,
  host: {
    class: 'p-3xl flex flex-col gap-xl max-h-[inherit] h-[inherit]',
  },
})
export class TermsAndConditionsContent {
  readonly dialogRef = inject<DialogRef<{ type: string }>>(DialogRef);
  readonly doc = inject(DOCUMENT);
  readonly enableButton = signal(false);
  readonly layoutFacade = inject(LayoutFacadeService);

  readonly scrollContent = viewChild.required<ElementRef<HTMLDivElement>>('scrollContent');
  readonly pdfSource = httpResource<{ status: 'success'; pdfBase64: string }>(
    () => `/api/dashboard/lookup/tnc?tncFile=${this.dialogRef.data?.type}`,
  );
  readonly base64PDF = computed(() => this.pdfSource.value()?.pdfBase64 || '');
  readonly pdfSrc = computed(() => (this.base64PDF() ? `data:application/pdf;base64,${this.base64PDF()}` : ''));

  constructor() {
    afterRenderEffect({
      read: cleanup => {
        if (!this.pdfSrc()) return;
        setTimeout(() => {
          const el = this.doc.querySelector<HTMLDivElement>('#viewerContainer')!;
          const listen = () => {
            const totalHeight = el.scrollTop + el.offsetHeight;
            if (el.scrollHeight - 5 < totalHeight && !untracked(this.enableButton)) {
              this.enableButton.set(true);
            }
          };
          el.addEventListener('scroll', listen);
          cleanup(() => el.removeEventListener('scroll', listen));
        }, 100);
      },
    });
  }

  close(accepted = false) {
    this.dialogRef.close(accepted);
  }
}
