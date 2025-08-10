import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[scbMaxLength]',
  standalone: true,
})
export class ScbMaxLengthDirective {
  @Input() scbMaxLength = 50;

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: InputEvent) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (value.length > this.scbMaxLength) {
      input.value = value.slice(0, this.scbMaxLength);
      // Dispatch input event to ensure Angular's form control is updated
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const input = event.target as HTMLInputElement;
    const pastedText = event.clipboardData?.getData('text');

    if (pastedText) {
      const currentValue = input.value;
      const selectionStart = input.selectionStart || 0;
      const selectionEnd = input.selectionEnd || 0;
      const newValue = currentValue.substring(0, selectionStart) + pastedText + currentValue.substring(selectionEnd);

      if (newValue.length > this.scbMaxLength) {
        event.preventDefault();
        const truncatedPaste = pastedText.slice(
          0,
          this.scbMaxLength - (currentValue.length - (selectionEnd - selectionStart)),
        );
        input.value = currentValue.substring(0, selectionStart) + truncatedPaste + currentValue.substring(selectionEnd);
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  }
}
