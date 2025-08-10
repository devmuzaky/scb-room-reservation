import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberCommaFormat',
})
export class NumberCommaFormatPipe implements PipeTransform {
  transform(value: string | number | null | undefined): string {
    if (value === null || value === undefined) return '';

    const num = typeof value === 'number' ? value : parseFloat(value.replace(/,/g, ''));
    if (isNaN(num)) return 'Invalid Number';

    return new Intl.NumberFormat().format(num);
  }
}
