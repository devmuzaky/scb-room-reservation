import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormField, ScbInput } from '@scb/ui/form-field';
import { Icon } from '@scb/ui/icon';

@Component({
  selector: 'app-header-search',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField, ScbInput, Icon, TranslocoPipe],
  template: `<scb-form-field mode="search">
    <icon
      name="search-normal"
      class="prefix text-input-icon-enabled" />
    <input
      type="text"
      [placeholder]="'dashboardLayout.searchPlaceholder' | transloco"
      data-testid="DASH_INPUT_SEARCH"
      scbInput />
  </scb-form-field>`,
})
export class HeaderSearch {}
