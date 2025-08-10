import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NoEmojiDirective } from '@/core/directives/no-emoji.directive';
import { TranslocoDirective } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { FormField, ScbInput } from '@scb/ui/form-field';
import { Icon } from '@scb/ui/icon';

@Component({
  selector: 'transfer-description-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField, ScbInput, Icon, Button, ReactiveFormsModule, TranslocoDirective, NoEmojiDirective],
  template: `@if (showDescription() || showDesc()) {
      <scb-form-field
        [maxLen]="300"
        *transloco="let t; prefix: 'transfer.form'">
        <textarea
          scbInput
          appNoEmoji
          [placeholder]="t('description')"
          [formControl]="control()"
          class="min-h-7xl placeholder:text-input-text-label resize-none font-normal"></textarea>
      </scb-form-field>
    } @else {
      <div
        *transloco="let t; prefix: 'transfer.form'"
        class="flex items-center">
        <button
          scbButton
          variant="ghost"
          size="sm"
          (click)="showDescription.set(true)">
          <icon name="plus" />
          {{ t('addDescription') }}
        </button>
        <span class="caption text-text-tertiary">({{ t('optional') }})</span>
      </div>
    }`,
})
export class TransferDescriptionField {
  readonly control = input.required<FormControl>();
  readonly showDesc = input<boolean>(false);
  readonly showDescription = signal(false);
}
