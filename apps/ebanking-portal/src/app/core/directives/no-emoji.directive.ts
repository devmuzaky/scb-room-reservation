import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appNoEmoji]',
  standalone: true,
})
export class NoEmojiDirective {
  private emojiRegex =
    /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F018}-\u{1F270}]|[\u{238C}-\u{2454}]|[\u{20D0}-\u{20FF}]|[\u{FE00}-\u{FE0F}]|[\u{1F170}-\u{1F251}]/gu;

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const inputChar = event.key;

    // Allow control keys (backspace, delete, arrow keys, etc.)
    if (this.isControlKey(event)) {
      return;
    }

    // Check if the input character is an emoji
    if (this.containsEmoji(inputChar)) {
      event.preventDefault();
      return;
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const originalValue = input.value;
    const cleanedValue = this.removeEmojis(originalValue);

    if (originalValue !== cleanedValue) {
      input.value = cleanedValue;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();

    const paste = event.clipboardData?.getData('text') || '';
    const cleanedPaste = this.removeEmojis(paste);

    const input = event.target as HTMLInputElement;
    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;

    const currentValue = input.value;
    const newValue = currentValue.slice(0, start) + cleanedPaste + currentValue.slice(end);

    input.value = newValue;

    const newCursorPos = start + cleanedPaste.length;
    input.setSelectionRange(newCursorPos, newCursorPos);

    input.dispatchEvent(new Event('input', { bubbles: true }));
  }

  private containsEmoji(text: string): boolean {
    return this.emojiRegex.test(text);
  }

  private removeEmojis(text: string): string {
    return text.replace(this.emojiRegex, '');
  }

  private isControlKey(event: KeyboardEvent): boolean {
    // Allow control keys that don't input characters
    const controlKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'Escape',
      'Enter',
      'Home',
      'End',
      'PageUp',
      'PageDown',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'F1',
      'F2',
      'F3',
      'F4',
      'F5',
      'F6',
      'F7',
      'F8',
      'F9',
      'F10',
      'F11',
      'F12',
    ];

    return controlKeys.includes(event.key) || event.ctrlKey || event.metaKey || event.altKey;
  }
}
