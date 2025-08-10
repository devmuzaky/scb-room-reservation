import { Directive, effect, inject, input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '@/auth/api/auth.service';
import { Role } from '@/core/store/auth-store';

type ExtendedRole = Role | 'CHECKER';

@Directive({
  selector: '[rolePermission]',
  standalone: true,
})
export class RolePermissionDirective {
  private readonly templateRef = inject(TemplateRef<any>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly authService = inject(AuthService);

  hasView = false;

  readonly rolePermission = input.required<ExtendedRole | ExtendedRole[]>();
  readonly roleInvert = input(false);

  constructor() {
    effect(() => {
      this.updateView();
    });
  }

  updateView(): void {
    const hasRole = this.checkUserRole();
    const shouldShow = this.roleInvert() ? !hasRole : hasRole;
    if (shouldShow && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!shouldShow && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }

  checkUserRole(): boolean {
    const userRoles = this.authService.getRolesFromToken();

    if (!userRoles?.length) return false;

    const requiredRoles = this.expandRoles(this.rolePermission());

    return userRoles.some(userRole => requiredRoles.includes(userRole));
  }

  expandRoles(roles: ExtendedRole | ExtendedRole[]): Role[] {
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.flatMap(role =>
      role === 'CHECKER' ? (['CHECKER_LEVEL_1', 'CHECKER_LEVEL_2', 'CHECKER_LEVEL_3'] as Role[]) : [role as Role],
    );
  }
}
