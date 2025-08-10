import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { LayoutFacadeService } from '@/layout/layout.facade.service';

export interface CanDeactivateComponent {
  canDeactivate?(): boolean;
}

@Injectable({ providedIn: 'root' })
export class CanDeactivateLeaveGuard implements CanDeactivate<CanDeactivateComponent> {
  constructor(private layoutFacade: LayoutFacadeService) {}

  canDeactivate(component: CanDeactivateComponent): boolean {
    // If component has its own canDeactivate method, use it
    if (component.canDeactivate) {
      return component.canDeactivate();
    }

    // TODO: Future enhancements
    // if (this.authService.isSessionExpired()) {
    //   // Handle session expiration
    //   this.authService.logout();
    //   return true; // Allow navigation to login
    // }

    // if (this.maintenanceService.isUnderMaintenance()) {
    //   // Handle maintenance mode
    //   return window.confirm('System is under maintenance. Continue anyway?');
    // }

    // if (this.unsavedChangesService.hasGlobalUnsavedChanges()) {
    //   // Handle global unsaved changes
    //   return window.confirm('You have unsaved changes across multiple forms. Leave anyway?');
    // }

    // Fallback to LayoutFacadeService
    return this.layoutFacade.getCanLeave();
  }
}
