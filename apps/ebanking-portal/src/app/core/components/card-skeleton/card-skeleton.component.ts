import { Component } from '@angular/core';
import { Skeleton } from '../skeleton/skeleton';

@Component({
  selector: 'scb-card-skeleton',
  standalone: true,
  imports: [Skeleton],
  template: `
    <div class="p-xl">
      <scb-skeleton
        width="20%"
        height="60px" />
      <scb-skeleton width="40%" />
      <scb-skeleton width="50%" />
      <scb-skeleton width="60%" />
      <scb-skeleton width="70%" />
      <scb-skeleton width="90%" />
      <scb-skeleton width="95%" />
    </div>
  `,
})
export class CardSkeletonComponent {}
