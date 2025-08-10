import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { LangButton } from '../lang-btn/lang-button';
import { Logo } from '../logo/logo';

@Component({
  selector: 'header-auth',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Logo, LangButton, Button, RouterLink, TranslocoDirective],
  template: `
    <app-logo class="flex-1" />
    <div class="gap-lg flex">
      <app-lang-button size="md" />

      @if (!hideLogin()) {
        <a
          *transloco="let t"
          scbButton
          routerLink="/login"
          variant="secondary"
          size="md">
          {{ t('Login') }}
        </a>
      }
    </div>
  `,
  host: {
    class: 'flex bg-foreground 2xl:px-6xl p-xl top-0 w-full absolute sm:sticky!',
  },
})
export class HeaderAuthComponent {
  readonly hideLogin = input(false, { transform: booleanAttribute });
}
