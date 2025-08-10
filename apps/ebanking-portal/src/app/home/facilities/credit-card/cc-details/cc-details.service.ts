import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CreditCardDetails } from '../model';

@Injectable()
export class CcDetailsService {
  readonly route = inject(ActivatedRoute);

  readonly data = signal<Signal<CreditCardDetails | undefined>>(signal(undefined));
  readonly date = computed(() => this.data()()?.lastUpdated);
  readonly refresh = signal(0, { equal: () => false });
  readonly cardNumber: string = this.route.snapshot.params['ccNumber'];
  readonly apiStatus = signal(signal('loading').asReadonly());
  readonly hideRefresh = computed(() => ['error', 'loading'].includes(this.apiStatus()()));

  reload() {
    this.refresh.set(1);
  }
}
