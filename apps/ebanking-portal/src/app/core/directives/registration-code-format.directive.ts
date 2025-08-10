import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[registrationCodeFormat]',
  standalone: true,
})
export class RegistrationCodeFormatDirective {
  private isProcessing = false;

  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event'])
  onInput(event: InputEvent) {
    if (this.isProcessing) return;

    this.isProcessing = true;

    try {
      const input = event.target as HTMLInputElement;
      let value = input.value;

      // Remove all non-alphanumeric characters
      value = value.replace(/[^a-zA-Z0-9]/g, '');

      // Format the value according to the pattern: 5 chars + space + dash + 5 chars
      if (value.length > 0) {
        let formattedValue = '';

        // First 5 characters
        if (value.length <= 5) {
          formattedValue = value;
        } else {
          // 5 chars + space + dash + remaining chars (up to 5 more)
          formattedValue = value.substring(0, 5) + ' - ' + value.substring(5, 10);
        }

        // Update input value without triggering another input event
        const currentValue = input.value;
        if (currentValue !== formattedValue) {
          input.value = formattedValue;
          // Use setTimeout to ensure the event loop is clear before dispatching
          setTimeout(() => {
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }, 0);
        }
      }
    } finally {
      this.isProcessing = false;
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    if (this.isProcessing) return;

    this.isProcessing = true;

    try {
      const input = event.target as HTMLInputElement;
      const pastedText = event.clipboardData?.getData('text');

      if (pastedText) {
        // Remove non-alphanumeric characters from pasted text
        const cleanPastedText = pastedText.replace(/[^a-zA-Z0-9]/g, '');

        // Limit to 10 characters (5 + 5)
        const limitedText = cleanPastedText.substring(0, 10);

        event.preventDefault();

        // Format the pasted text
        let formattedValue = '';
        if (limitedText.length <= 5) {
          formattedValue = limitedText;
        } else {
          formattedValue = limitedText.substring(0, 5) + ' - ' + limitedText.substring(5);
        }

        input.value = formattedValue;
        // Use setTimeout to ensure the event loop is clear before dispatching
        setTimeout(() => {
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }, 0);
      }
    } finally {
      this.isProcessing = false;
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const currentValue = input.value;

    // Allow backspace and delete
    if (event.key === 'Backspace' || event.key === 'Delete') {
      return;
    }

    // Allow navigation keys
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab'].includes(event.key)) {
      return;
    }

    // Only allow alphanumeric characters
    if (!/^[a-zA-Z0-9]$/.test(event.key)) {
      event.preventDefault();
      return;
    }

    // Check if we've reached the maximum length (10 characters without formatting)
    const cleanValue = currentValue.replace(/[^a-zA-Z0-9]/g, '');
    if (cleanValue.length >= 10) {
      event.preventDefault();
    }
  }
}
