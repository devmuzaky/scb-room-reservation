import { Component } from '@angular/core';
import { AuthService } from '@/auth/api/auth.service';
import { Role } from '@/core/store/auth-store';
import { fakeService, render, RenderResult } from '@scb/util/testing';
import { RolePermissionDirective } from './role-permission.directive';

@Component({
  template: `
    <div
      *rolePermission="requiredRoles"
      [roleInvert]="invert">
      Content to show/hide
    </div>
  `,
  standalone: true,
  imports: [RolePermissionDirective],
})
class TestComponent {
  requiredRoles: Role | Role[] = 'SUPER_USER';
  invert = false;
}

const authServiceStub = fakeService(AuthService, {
  getRolesFromToken: jest.fn().mockReturnValue(['SUPER_USER']),
});

describe('RolePermissionDirective', () => {
  let view: RenderResult<TestComponent>;

  beforeEach(async () => {
    view = await render(TestComponent, [authServiceStub]);
  });

  it('should create', () => {
    expect(view.host).toBeTruthy();
  });

  describe('checkUserRole method', () => {
    it('should return false when userRoles is null', () => {
      authServiceStub.v.getRolesFromToken = jest.fn().mockReturnValue(null);

      const result = RolePermissionDirective.prototype.checkUserRole.call({
        authService: authServiceStub.v,
        rolePermission: () => 'SUPER_USER',
      });

      expect(result).toBe(false);
    });

    it('should return false when userRoles is undefined', () => {
      authServiceStub.v.getRolesFromToken = jest.fn().mockReturnValue(undefined);

      const result = RolePermissionDirective.prototype.checkUserRole.call({
        authService: authServiceStub.v,
        rolePermission: () => 'SUPER_USER',
      });

      expect(result).toBe(false);
    });

    it('should return false when userRoles is empty array', () => {
      authServiceStub.v.getRolesFromToken = jest.fn().mockReturnValue([]);

      const result = RolePermissionDirective.prototype.checkUserRole.call({
        authService: authServiceStub.v,
        rolePermission: () => 'SUPER_USER',
      });

      expect(result).toBe(false);
    });

    it('should return true when user has matching role', () => {
      authServiceStub.v.getRolesFromToken = jest.fn().mockReturnValue(['MAKER', 'VIEWER']);

      const result = RolePermissionDirective.prototype.checkUserRole.call({
        authService: authServiceStub.v,
        rolePermission: () => 'MAKER',
        expandRoles: RolePermissionDirective.prototype.expandRoles,
      });

      expect(result).toBe(true);
    });

    it('should return false when user has no matching role', () => {
      authServiceStub.v.getRolesFromToken = jest.fn().mockReturnValue(['VIEWER']);

      const result = RolePermissionDirective.prototype.checkUserRole.call({
        authService: authServiceStub.v,
        rolePermission: () => 'MAKER',
        expandRoles: RolePermissionDirective.prototype.expandRoles,
      });

      expect(result).toBe(false);
    });
  });

  describe('updateView method', () => {
    it('should create view when shouldShow is true and hasView is false', () => {
      const mockDirective = {
        checkUserRole: jest.fn().mockReturnValue(true),
        roleInvert: () => false,
        hasView: false,
        viewContainer: {
          createEmbeddedView: jest.fn(),
        },
        templateRef: {},
      };

      RolePermissionDirective.prototype.updateView.call(mockDirective);

      expect(mockDirective.hasView).toBe(true);
      expect(mockDirective.viewContainer.createEmbeddedView).toHaveBeenCalledWith(mockDirective.templateRef);
    });

    it('should clear view when shouldShow is false and hasView is true', () => {
      const mockDirective = {
        checkUserRole: jest.fn().mockReturnValue(false),
        roleInvert: () => false,
        hasView: true,
        viewContainer: {
          clear: jest.fn(),
        },
      };

      RolePermissionDirective.prototype.updateView.call(mockDirective);

      expect(mockDirective.hasView).toBe(false);
      expect(mockDirective.viewContainer.clear).toHaveBeenCalled();
    });

    it('should not create view when shouldShow is true and hasView is already true', () => {
      const mockDirective = {
        checkUserRole: jest.fn().mockReturnValue(true),
        roleInvert: () => false,
        hasView: true,
        viewContainer: {
          createEmbeddedView: jest.fn(),
        },
        templateRef: {},
      };

      RolePermissionDirective.prototype.updateView.call(mockDirective);

      expect(mockDirective.hasView).toBe(true);
      expect(mockDirective.viewContainer.createEmbeddedView).not.toHaveBeenCalled();
    });

    it('should not clear view when shouldShow is false and hasView is already false', () => {
      const mockDirective = {
        checkUserRole: jest.fn().mockReturnValue(false),
        roleInvert: () => false,
        hasView: false,
        viewContainer: {
          clear: jest.fn(),
        },
      };

      RolePermissionDirective.prototype.updateView.call(mockDirective);

      expect(mockDirective.hasView).toBe(false);
      expect(mockDirective.viewContainer.clear).not.toHaveBeenCalled();
    });

    it('should handle roleInvert true - show when user does not have role', () => {
      const mockDirective = {
        checkUserRole: jest.fn().mockReturnValue(false),
        roleInvert: () => true,
        hasView: false,
        viewContainer: {
          createEmbeddedView: jest.fn(),
        },
        templateRef: {},
      };

      RolePermissionDirective.prototype.updateView.call(mockDirective);

      expect(mockDirective.hasView).toBe(true);
      expect(mockDirective.viewContainer.createEmbeddedView).toHaveBeenCalledWith(mockDirective.templateRef);
    });

    it('should handle roleInvert true - hide when user has role', () => {
      const mockDirective = {
        checkUserRole: jest.fn().mockReturnValue(true),
        roleInvert: () => true,
        hasView: true,
        viewContainer: {
          clear: jest.fn(),
        },
      };

      RolePermissionDirective.prototype.updateView.call(mockDirective);

      expect(mockDirective.hasView).toBe(false);
      expect(mockDirective.viewContainer.clear).toHaveBeenCalled();
    });
  });

  describe('expandRoles method', () => {
    it('should handle single role (not array)', () => {
      const result = RolePermissionDirective.prototype.expandRoles.call(null, 'SUPER_USER');

      expect(result).toEqual(['SUPER_USER']);
    });

    it('should handle array of roles', () => {
      const result = RolePermissionDirective.prototype.expandRoles.call(null, ['SUPER_USER', 'MAKER']);

      expect(result).toEqual(['SUPER_USER', 'MAKER']);
    });

    it('should expand CHECKER role to all checker levels', () => {
      const result = RolePermissionDirective.prototype.expandRoles.call(null, 'CHECKER');

      expect(result).toEqual(['CHECKER_LEVEL_1', 'CHECKER_LEVEL_2', 'CHECKER_LEVEL_3']);
    });

    it('should expand CHECKER role in array to all checker levels', () => {
      const result = RolePermissionDirective.prototype.expandRoles.call(null, ['SUPER_USER', 'CHECKER']);

      expect(result).toEqual(['SUPER_USER', 'CHECKER_LEVEL_1', 'CHECKER_LEVEL_2', 'CHECKER_LEVEL_3']);
    });

    it('should handle non-CHECKER role without expansion', () => {
      const result = RolePermissionDirective.prototype.expandRoles.call(null, 'MAKER');

      expect(result).toEqual(['MAKER']);
    });

    it('should handle mixed roles with CHECKER expansion', () => {
      const result = RolePermissionDirective.prototype.expandRoles.call(null, ['MAKER', 'CHECKER', 'VIEWER']);

      expect(result).toEqual(['MAKER', 'CHECKER_LEVEL_1', 'CHECKER_LEVEL_2', 'CHECKER_LEVEL_3', 'VIEWER']);
    });
  });
});
