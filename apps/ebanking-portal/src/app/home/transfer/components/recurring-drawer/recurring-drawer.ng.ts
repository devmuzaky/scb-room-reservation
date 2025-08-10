import { NgClass } from '@angular/common';
import { Component, computed, effect, inject, input, model, signal, ViewEncapsulation } from '@angular/core';
import { DateView } from '@/core/components';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective } from '@jsverse/transloco';
import { Alert } from '@scb/ui/alert';
import { IconButton } from '@scb/ui/button';
import { Card } from '@scb/ui/card';
import { ChipModule } from 'primeng/chip';
import { DrawerModule } from 'primeng/drawer';
import { TableModule } from 'primeng/table';
import { FrequencyType } from '../../model';

@Component({
  selector: 'recurring-drawer',
  templateUrl: './recurring-drawer.ng.html',
  imports: [ChipModule, DrawerModule, Alert, IconButton, TranslocoDirective, NgClass, Card, TableModule, DateView],
  styles: `
    .p-drawer-header {
      display: block !important;
    }
    .dark .mobile-full {
      background: var(--color-gray-850) !important;
    }
    .mobile-full {
      width: 33rem !important;
    }

    .overflow-none .p-drawer-content {
      overflow: hidden !important;
    }

    @media screen and (max-width: 1680px) {
      .mobile-full {
        width: 35rem !important;
      }
    }
    @media screen and (max-width: 640px) {
      .mobile-full {
        width: 100% !important;
        margin-top: 20vh;
        height: 80vh !important;
        justify-content: end;
        border-radius: 28px 28px 0px 0px;
      }
    }
  `,
  encapsulation: ViewEncapsulation.None,
})
export class RecurringDrawer {
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly startDate = input<string | null | undefined>(null);
  readonly frequencyType = input<FrequencyType | null>();
  readonly occurrences = input<number | null | undefined>(null);
  readonly open = model(false);
  readonly showWeekendAlert = input<boolean>(false);
  readonly lang = computed(() => this.layoutFacade.language());
  readonly currenciesFilter = signal<string[]>([]);
  readonly friday = signal<boolean>(false);
  transferDates: Date[] = [];

  constructor() {
    history.pushState(null, '', window.location.href);
    effect(() => {
      if (this.startDate()) {
        const startDate = this.startDate()?.split('-').reverse().join('-');
        if (startDate) {
          const current = new Date(startDate);
          this.generateTransferDates(current, this.frequencyType()!, this.occurrences()!);
        }
      }
    });
  }

  closeDrawer() {
    this.open.set(false);
  }

  generateTransferDates(startDate: Date, frequencyType: FrequencyType, occurrences: number): Date[] {
    this.transferDates.length = 0;

    const originalDay = startDate.getDate(); // e.g. 30 or 31
    let foundFriday = false;

    let year = startDate.getFullYear();
    let month = startDate.getMonth();

    for (let i = 0; i < occurrences; i++) {
      let transferDate: Date;

      switch (frequencyType) {
        case 'DAILY': {
          const newDate = new Date(startDate);
          newDate.setDate(startDate.getDate() + i);
          transferDate = newDate;
          break;
        }

        case 'WEEKLY': {
          const newDate = new Date(startDate);
          newDate.setDate(startDate.getDate() + i * 7);
          transferDate = newDate;
          break;
        }

        case 'MONTHLY':
        case 'QUARTERLY':
        case 'SEMI_ANNUALLY': {
          transferDate = this.getClampedDate(year, month, originalDay);
          break;
        }

        default:
          throw new Error(`Unsupported frequencyType: ${frequencyType}`);
      }

      this.transferDates.push(transferDate);

      if (transferDate.getDay() === 5 || transferDate.getDay() === 6) {
        foundFriday = true;
      }

      switch (frequencyType) {
        case 'MONTHLY':
          month += 1;
          break;
        case 'QUARTERLY':
          month += 3;
          break;
        case 'SEMI_ANNUALLY':
          month += 6;
          break;
      }

      // Normalize if month > 11
      while (month > 11) {
        month -= 12;
        year += 1;
      }
    }

    this.friday.set(foundFriday);
    return this.transferDates;
  }

  getClampedDate(year: number, month: number, day: number): Date {
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // last day of the month
    return new Date(year, month, Math.min(day, daysInMonth));
  }

  isFriday(date: string): boolean {
    return new Date(date).getDay() === 5;
  }

  isSaturday(date: string): boolean {
    return new Date(date).getDay() === 6;
  }
}
