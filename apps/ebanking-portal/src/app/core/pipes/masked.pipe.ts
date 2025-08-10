import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mask',
  pure: false,
})
export class MaskedPipe implements PipeTransform {
  transform(value: string, visible: boolean, repeat = 8): string {
    return MaskValue.convert(value, visible, repeat);
  }
}

export class MaskValue {
  static convert(value: string, visible: boolean, repeat = 8): string {
    return new MaskValue().transform(value, visible, repeat);
  }

  transform(value: string, visible: boolean, repeat = 8): string {
    return visible ? value : '*'.repeat(repeat);
  }
}

@Pipe({
  name: 'maskNumber',
  pure: false,
})
export class MaskedAccountNumberPipe implements PipeTransform {
  transform(value: string | number | undefined): string {
    if (!value) return 'xxxx-xxxx-xxxx-xxxx';
    const strValue = value.toString().trim();
    const length = strValue.length;
    if (length < 4) return strValue;
    const maskedGroups = Math.floor((length - 4) / 4);
    const maskedPart = Array(maskedGroups).fill('xxxx').join('-');
    return maskedPart ? maskedPart + '-' + strValue.slice(-4) : strValue.slice(-4);
  }
}

@Pipe({
  name: 'maskAllNumber',
  pure: false,
})
export class MaskedAllAccountNumberPipe implements PipeTransform {
  transform(value: string | number | undefined): string {
    if (!value) return 'xxxx-xxxx-xxxx-xxxx';

    const strValue = value.toString().trim();
    const length = strValue.length;
    const groups = Math.ceil(length / 4);
    const maskedGroups = Array(groups).fill('xxxx');

    return maskedGroups.join('-');
  }
}
