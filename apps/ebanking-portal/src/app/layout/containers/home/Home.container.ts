import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { AuthService } from '@/auth/api/auth.service';
import { ToasterComponent } from '@/core/components';
import { RolePermissionDirective } from '@/core/directives/role-permission.directive';
import { HeaderDashboard, Logo, ShellItem } from '@/layout/components';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { Sidenav, SidenavHeader } from '@scb/ui/sidenav';

@Component({
  selector: 'app-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ToasterComponent,
    RouterOutlet,
    Sidenav,
    Button,
    SidenavHeader,
    HeaderDashboard,
    Logo,
    ShellItem,
    TranslocoDirective,
    RolePermissionDirective,
  ],
  templateUrl: './Home.container.html',
})
export class HomeContainer {
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly auth = inject(AuthService);
  readonly activeChild = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => {
        let child = this.route.firstChild;
        while (child?.firstChild) {
          child = child.firstChild;
        }
        return child;
      }),
      filter(child => child !== null),
    ),
  );
  readonly sideMenu = computed(() => {
    const child = this.activeChild();
    return child?.snapshot.data['sideMenu'];
  });

  constructor() {
    this.auth.me().subscribe();
  }
}
