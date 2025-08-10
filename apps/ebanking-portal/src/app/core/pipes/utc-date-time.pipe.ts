import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'utcDateTime',
})
export class UtcDatePipe implements PipeTransform {
  private datePipe = new DatePipe('en-US');

  transform(value: any, format = 'd MMM y, hh:mm a'): string | null {
    return this.datePipe.transform(value, format, 'UTC');
  }
}
