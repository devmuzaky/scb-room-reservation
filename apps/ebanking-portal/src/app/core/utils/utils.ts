import { DatePipe } from '@angular/common';
import { computed, inject } from '@angular/core';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoService } from '@jsverse/transloco';
import { ScbDate } from '@scb/util/datepicker';

export const DATE_FORMAT = 'h:mm a, d MMM y';

export function calculateUserLockedTime(lockedDateTime: string, currentDate: string | Date = new Date()) {
  const currentDateTime = new ScbDate(currentDate);
  const userLockedTime = new ScbDate(lockedDateTime);
  const diff = currentDateTime.diff(userLockedTime, 'minutes');
  /* istanbul ignore file */
  if (diff > 60) {
    return { time: Math.floor(diff / 60), isHours: true };
  }
  return { time: diff, isHours: false };
}

export function lockedUserTitleDesc(date: string, transloco: TranslocoService) {
  const { time, isHours } = calculateUserLockedTime(date);
  return {
    title: transloco.translate('credentialsLockedTitle'),
    description: transloco.translate('credentialsLockedDesc', {
      // We have to maintain min 1 minutes
      timeLeft: isHours ? time : Math.max(1, time),
      state: transloco.translate(isHours ? 'hours' : 'minutes'),
    }),
  };
}

export function lockedActivateUserTitleDesc(date: string, transloco: TranslocoService) {
  const { time, isHours } = calculateUserLockedTime(date);
  return {
    title: transloco.translate('credentialsLockedTitle'),
    description: transloco.translate('credentialsACLockedDesc', {
      timeLeft: time,
      state: transloco.translate(isHours ? 'hours' : 'minutes'),
    }),
  };
}

export function lastUpdateProcess(lastUpdateAt: () => number | string | undefined) {
  const datePipe = inject(DatePipe);
  const layoutFacade = inject(LayoutFacadeService);
  return computed(() => {
    const lang = layoutFacade.language();
    const timestamp = lastUpdateAt() || '';

    const final = datePipe.transform(timestamp, DATE_FORMAT, undefined, lang) || '';
    return final;
  });
}

export function isEqual<T>(arr1: T[], arr2: T[]) {
  return arr1.length === arr2.length && arr1.every(x => arr2.includes(x));
}
