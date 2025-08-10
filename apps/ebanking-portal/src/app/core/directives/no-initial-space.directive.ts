import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[noInitialSpace]',
  standalone: true,
})
export class NoInitialSpaceDirective {
  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event'])
  onInput(event: InputEvent) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // If the value starts with a space and there are no other characters
    if (value.startsWith(' ') && value.trim().length === 0) {
      // Remove the space
      input.value = '';
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // If trying to type a space at the beginning (when there are no other characters)
    if (event.key === ' ' && value.length === 0) {
      event.preventDefault();
    }
  }
}
