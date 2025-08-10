import { NgClass } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, effect, inject, input, output, signal, ViewEncapsulation } from '@angular/core';
import { Skeleton } from '@/core/components';
import { apiStatus } from '@/core/models/api';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { Icon } from '@scb/ui/icon';
import { ChipModule } from 'primeng/chip';
import { CharityCategoriesResponse, CharityCategory, CharityTransferDto } from '../../model';

@Component({
  selector: 'charity-categories',
  template: `
    <div
      class="gap-lg flex flex-col"
      *transloco="let t; prefix: 'transfer.charity'">
      <p class="mf-lg font-semibold">{{ t('categories') }}</p>

      @if (status() === 'loading') {
        <div class="gap-sm flex flex-wrap">
          <scb-skeleton
            width="80px"
            height="32px" />
          <scb-skeleton
            width="120px"
            height="32px" />
          <scb-skeleton
            width="100px"
            height="32px" />
          <scb-skeleton
            width="90px"
            height="32px" />
        </div>
      } @else if (status() === 'error') {
        <div class="py-xl flex w-full flex-col items-center justify-center gap-3 text-center">
          <icon
            name="api-failure"
            class="text-3xl" />
          <h4 class="head-2xs-s text-text-primary">
            {{ t('categoriesError') }}
          </h4>
          <button
            scbButton
            variant="ghost"
            size="sm"
            icon="refresh"
            (click)="resource.reload()">
            {{ t('retry') }}
          </button>
        </div>
      } @else if (categories().length === 0) {
        <div class="py-xl flex w-full flex-col items-center justify-center gap-3 text-center">
          <icon
            name="not-found"
            class="text-xl" />
          <p class="text-text-tertiary text-sm">
            {{ t('noCategories') }}
          </p>
        </div>
      } @else {
        <div class="flex flex-wrap gap-3">
          @for (category of categories(); track category.accountId) {
            <p-chip
              [tabindex]="0"
              [attr.aria-pressed]="selectedCategory() === category"
              role="button"
              (keydown)="onKeyDown($event, category)"
              class="cursor-pointer"
              [ngClass]="{ active: selectedCategory() === category }"
              (click)="onCategorySelected(category)">
              <div class="mf-sm text-text-primary flex items-center">
                {{ getCategoryName(category) }}
              </div>
            </p-chip>
          }
        </div>
      }
    </div>
  `,
  imports: [ChipModule, TranslocoDirective, Skeleton, Icon, Button, NgClass],
  styles: `
    p-chip.p-component {
      border-radius: 35px;
    }
    p-chip.p-component.active,
    .dark p-chip.p-component.active {
      background: var(--color-primary);
    }
    .dark p-chip.p-component {
      background: var(--color-gray-850);
      color: var(--color-white);
      border: 1px solid var(--color-gray-700);
    }

    p-chip.p-component .text-text-primary {
      flex: 1;
      word-break: break-all;
      white-space: wrap;
    }
    p-chip.p-component.active .text-text-primary {
      color: var(--color-white);
    }
  `,
  encapsulation: ViewEncapsulation.None,
})
export class CharityCategories {
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly customerId = input.required<string>();
  readonly categorySelected = output<CharityCategory>();

  readonly selectedCategory = signal<CharityCategory | null>(null);
  readonly isArabic = computed(() => this.layoutFacade.language() === 'ar');

  readonly resource = httpResource<CharityCategoriesResponse>(() => ({
    url: `/api/transfer/charity/categories/${this.customerId()}`,
  }));

  readonly categories = computed(() => this.resource.value()?.accounts ?? []);
  readonly status = apiStatus(this.resource.status);
  readonly charityTransferDto = input<CharityTransferDto | null>(null);

  constructor() {
    effect(() => {
      const categories = this.categories();
      const dto = this.charityTransferDto();
      if (categories && dto && !this.selectedCategory()) {
        const matchingCategory = categories.find(cat => cat.accountId === dto.accountNumber);
        if (matchingCategory) {
          this.selectedCategory.set(matchingCategory);
        }
      }
    });
  }

  onCategorySelected(category: CharityCategory) {
    this.selectedCategory.set(category);
    this.categorySelected.emit(category);
  }

  getCategoryName(category: CharityCategory): string {
    const isArabic = this.isArabic();

    if (isArabic) {
      return category.accountTitleAR?.trim() || category.accountTitleEN || category.accountId;
    } else {
      return category.accountTitleEN?.trim() || category.accountTitleAR || category.accountId;
    }
  }

  onKeyDown(event: KeyboardEvent, category: CharityCategory) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onCategorySelected(category);
    }
  }
}
