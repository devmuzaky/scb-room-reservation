import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  output,
  Signal,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective } from '@jsverse/transloco';
import { Icon } from '@scb/ui/icon';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { SelectModule } from 'primeng/select';

export class PaginationData {
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly rows = signal(10);
  readonly reset = linkedSignal(() => [this.externalReset?.(), this.rows(), this.layoutFacade.language()].join());
  readonly first = linkedSignal({ source: this.reset, computation: () => 0 });
  readonly pageNumber = linkedSignal({ source: this.reset, computation: () => 1 });
  readonly reqPageNumber = linkedSignal({ source: this.pageNumber, computation: p => p - this.minusPage });

  constructor(
    public externalReset?: Signal<any>,
    public minusPage = 1,
    rows = 10,
  ) {
    this.rows.set(rows);
  }

  updatePage(e: PaginatorState) {
    this.first.set(e.first!);
    this.rows.set(e.rows!);
    this.pageNumber.set(e.page! + 1);
  }

  resetPagination() {
    this.reset.set(Date.now().toString());
  }
}

@Component({
  selector: 'app-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, PaginatorModule, SelectModule, FormsModule, Icon],
  template: `<div
    class="table-footer pt-2xl flex items-center justify-between max-sm:justify-center"
    data-testid="PAGINATION_CONTAINER"
    *transloco="let t">
    @if (!onlyPagination()) {
      <div class="page-info-container">
        <span class="mf-sm text-text-secondary hidden font-normal sm:block">
          {{ t('page') }} {{ page().pageNumber() }} {{ t('pageOf') }} {{ totalPages() }}
        </span>
      </div>
    }
    <div class="pagination-container">
      <p-paginator
        [first]="page().first()"
        [rows]="page().rows()"
        [totalRecords]="totalRecords()"
        [showCurrentPageReport]="false"
        [showFirstLastIcon]="!layoutFacade.mobileMode()"
        (onPageChange)="onPageChange($event)">
        <ng-template #firstpagelinkicon>
          <icon
            class="h-3xl w-3xl"
            name="arrow-left-double"
            data-testid="OVERDRAFT_PAGINATOR_FIRST_ICON" />
        </ng-template>
        <ng-template #previouspagelinkicon>
          <icon
            class="h-3xl w-3xl"
            name="arrow-left"
            data-testid="OVERDRAFT_PAGINATOR_PREVIOUS_ICON" />
        </ng-template>
        <ng-template #lastpagelinkicon>
          <icon
            class="h-3xl w-3xl"
            name="arrow-right-double"
            data-testid="OVERDRAFT_PAGINATOR_LAST_ICON" />
        </ng-template>
        <ng-template #nextpagelinkicon>
          <icon
            class="h-3xl w-3xl"
            name="arrow-right"
            data-testid="OVERDRAFT_PAGINATOR_NEXT_ICON" />
        </ng-template>
      </p-paginator>
    </div>
    @if (!layoutFacade.mobileMode() && !onlyPagination()) {
      <div class="mf-md text-text-secondary hidden sm:block">
        <p-select
          [options]="dropdownOptions"
          optionLabel="label"
          optionValue="value"
          [appendTo]="lang() === 'ar' ? null : 'body'"
          [(ngModel)]="page().rows"
          class="[&_chevrondownicon>svg]:text-text-secondary !bg-transparent">
          <ng-template pTemplate="selectedItem">
            <div class="align-items-center text-text-secondary flex gap-2">
              <div>{{ page().rows() }} {{ t('perPage') }}</div>
            </div>
          </ng-template>

          <ng-template
            let-country
            pTemplate="item">
            <div class="align-items-center flex gap-2">
              <div>{{ country.label }} {{ t('perPage') }}</div>
            </div>
          </ng-template>
        </p-select>
      </div>
    }
  </div>`,
})
export class TablePagination {
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly lang = computed(() => this.layoutFacade.language());
  readonly totalRecords = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly page = input.required<PaginationData>();
  readonly onlyPagination = input(false, { transform: booleanAttribute });

  readonly reload = output();

  readonly dropdownOptions = [
    { label: '10', value: 10 },
    { label: '20', value: 20 },
    { label: '50', value: 50 },
    { label: '100', value: 100 },
  ];

  onPageChange(e: PaginatorState) {
    this.page().updatePage(e);
    this.reload.emit();
  }
}

@Component({
  selector: 'app-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ``,
})
export class FakeTablePagination {}
