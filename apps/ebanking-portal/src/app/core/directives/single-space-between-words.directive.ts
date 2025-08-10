import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[singleSpaceBetweenWords]',
  standalone: true,
})
export class SingleSpaceBetweenWordsDirective {
  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event'])
  onInput(event: InputEvent) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Remove leading spaces and collapse multiple spaces
    value = value.replace(/^\s+/, '');
    // Replace multiple spaces with a single space
    value = value.replace(/\s+/g, ' ');
    // Remove dot followed by space (from double space behavior)
    value = value.replace(/\. /g, '');

    input.value = value;
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;

    // Prevent inserting space at the beginning
    if (event.key === ' ' && input.selectionStart === 0) {
      event.preventDefault();
    }
  }

  @HostListener('blur')
  onBlur() {
    const input = this.el.nativeElement;
    // Trim leading and trailing spaces on blur
    input.value = input.value.trim();
  }
}
