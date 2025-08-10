import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SessionIdleService } from '@/core/services/session-idle.service';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
  providers: [SessionIdleService],
  template: `<router-outlet />`,
})
export class AppComponent {}
