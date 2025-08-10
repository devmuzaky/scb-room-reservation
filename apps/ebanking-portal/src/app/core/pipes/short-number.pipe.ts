import { Pipe, PipeTransform } from '@angular/core';

const UNITS = [
  { limit: 1_000_000_000_000, suffix: 'T' },
  { limit: 1_000_000_000, suffix: 'B' },
  { limit: 1_000_000, suffix: 'M' },
];

@Pipe({
  name: 'shortNumber',
})
export class ShortNumberPipe implements PipeTransform {
  transform(value: string | number | null | undefined, short = true, decimalPlaces?: number): string {
    return ShortNumber.convert(value, short, decimalPlaces);
  }
}

export class ShortNumber {
  static convert(value: string | number | null | undefined, short = true, decimalPlaces?: number): string {
    return new ShortNumber().transform(value, short, decimalPlaces);
  }

  transform(value: string | number | null | undefined, short = true, decimalPlaces?: number): string {
    if (value === null || value === undefined) return '';

    const num = typeof value === 'number' ? value : parseFloat(value.replace(/,/g, ''));
    if (isNaN(num)) return 'Invalid Number';

    const isNegative = num < 0;
    if (short) {
      const absNum = Math.abs(num);

      for (const unit of UNITS) {
        if (absNum >= unit.limit) {
          return this.formatLargeNumber(absNum, unit.suffix, isNegative, unit.limit, decimalPlaces);
        }
      }
    }

    return this.formatSmallNumber(num, isNegative, short, decimalPlaces);
  }

  private formatSmallNumber(num: number, isNegative: boolean, short: boolean, decimalPlaces?: number): string {
    const absNum = Math.abs(num);
    const rounded = short && decimalPlaces !== undefined ? this.floorToDecimal(absNum, decimalPlaces) : absNum;
    const hasDecimal = rounded % 1 !== 0;

    const formatted = new Intl.NumberFormat(undefined, {
      minimumFractionDigits: decimalPlaces !== undefined && hasDecimal ? decimalPlaces : 0,
      maximumFractionDigits: decimalPlaces !== undefined ? decimalPlaces : undefined,
    }).format(rounded);

    return isNegative ? `-${formatted}` : formatted;
  }

  private formatLargeNumber(
    num: number,
    suffix: string,
    isNegative: boolean,
    limit: number,
    decimalPlaces?: number,
  ): string {
    const rounded = this.floorToDecimal(num / limit, decimalPlaces ?? 1);
    let formatted = rounded.toFixed(decimalPlaces ?? 1);
    if (formatted.endsWith('.0') || formatted.endsWith('.00')) {
      formatted = formatted.replace(/\.0+$/, '');
    }
    return isNegative ? `-${formatted}${suffix}` : `${formatted}${suffix}`;
  }

  private floorToDecimal(value: number, decimals: number): number {
    const multiplier = Math.pow(10, decimals);
    return Math.floor(value * multiplier) / multiplier;
  }
}
