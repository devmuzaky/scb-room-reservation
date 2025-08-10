import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { Icon } from '@scb/ui/icon';
import { SafeHtmlPipe } from 'primeng/menu';

@Component({
  selector: 'cheque-collection-instruction',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, TranslocoDirective, Icon, SafeHtmlPipe],
  template: `
    <div
      *transloco="let t; prefix: 'chequeBook'"
      class="bg-info-tint mt-4 flex w-full flex-col items-start overflow-hidden rounded-2xl p-4 md:flex-row">
      <!-- Icon -->
      <icon
        class="w-3xl"
        name="info-circle"></icon>

      <!-- Content -->
      <div class="mt-2 flex w-full flex-col gap-4 md:mt-0 md:ml-4">
        <!-- Title -->
        <h2 class="text-text-primary body-lg-s">{{ t('chequeBookDetails.infoTitle') }}</h2>

        <!-- Collection Period -->
        <div class="flex flex-col gap-1">
          <h3 class="body-md-s text-text-primary">{{ t('chequeBookDetails.collectionPeriodTitle') }}</h3>
          <p
            class="body-md text-text-primary"
            [innerHTML]="t('chequeBookDetails.collectionPeriodText') | safeHtml"></p>
        </div>

        <!-- Required Documents -->
        <div class="flex flex-col gap-1">
          <h3 class="body-md font-semibold">{{ t('chequeBookDetails.requiredDocsTitle') }}</h3>
          <ul class="body-md text-text-primary list-inside list-disc space-y-1">
            @for (doc of t('chequeBookDetails.requiredDocs', { returnObjects: true }); track $index) {
              <li>{{ doc }}</li>
            }
          </ul>
        </div>
      </div>
    </div>
  `,
})
export class ChequeBookCollectionInstruction {}
