import { Component, input } from '@angular/core';
import { Skeleton } from '../skeleton/skeleton';

@Component({
  selector: 'scb-table-skeleton',
  standalone: true,
  imports: [Skeleton],
  template: `
    <div class="p-xl">
      <!-- Filter Section -->
      <div class="mb-4 flex justify-between gap-6">
        <scb-skeleton
          width="25%"
          height="40px" />

        <scb-skeleton
          width="15%"
          height="40px" />
      </div>

      <!-- Header -->
      <div class="mb-4 flex gap-6">
        @for (column of getColumnArray(); track column) {
          <scb-skeleton
            class="flex-1"
            width="100%"
            [height]="headerHeight()" />
        }
      </div>

      <!-- Rows -->
      <div class="flex flex-col gap-3">
        @for (row of getRowArray(); track row) {
          <div class="flex gap-6">
            @for (column of getColumnArray(); track column) {
              <scb-skeleton
                class="flex-1"
                width="100%"
                [height]="rowHeight()" />
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class TableSkeletonComponent {
  readonly rows = input.required<number>();
  readonly columns = input.required<number>();
  readonly headerHeight = input<string>('30px');
  readonly rowHeight = input<string>('20px');

  getRowArray(): number[] {
    return Array.from({ length: this.rows() }, (_, i) => i);
  }

  getColumnArray(): number[] {
    return Array.from({ length: this.columns() }, (_, i) => i);
  }
}
