import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { AuthUser } from '@/models/auth.model';
import { UserRole } from '@/models/user.model';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles: UserRole[];
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Mobile Overlay -->
    <div
      *ngIf="isOpen && isMobile"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
      (click)="closeSidebar.emit()"
    ></div>

    <!-- Sidebar -->
    <aside
      class="organization-sidebar"
      [class.sidebar-open]="isOpen"
      [class.sidebar-closed]="!isOpen"
    >
      <div class="sidebar-container">
        <!-- Navigation Menu -->
        <nav class="sidebar-nav">
          <div class="nav-section">
            <h3 class="nav-section-title">Navigation</h3>
            <div class="nav-items">
              <a
                *ngFor="let item of getMenuItems()"
                [routerLink]="item.route"
                routerLinkActive="nav-item-active"
                class="nav-item"
                (click)="onMobileMenuClick()"
              >
                <div class="nav-item-icon">
                  <i [class]="item.icon"></i>
                </div>
                <span class="nav-item-label">{{ item.label }}</span>

                <!-- Active indicator -->
                <div class="nav-item-indicator"></div>
              </a>
            </div>
          </div>
        </nav>

        <!-- User Info (Mobile) -->
        <div class="sidebar-user-info lg:hidden" *ngIf="user">
          <div class="user-avatar">
            <i class="pi pi-user"></i>
          </div>
          <div class="user-details">
            <p class="user-email">{{ user.email }}</p>
            <p class="user-role">{{ getRoleDisplayName(user.role) }}</p>
          </div>
        </div>
      </div>
    </aside>
  `,
  styles: [
    `
      .organization-sidebar {
        position: fixed;
        top: 70px;
        left: 0;
        width: 280px;
        height: calc(100vh - 70px);
        background: var(--color-container);
        border-right: 1px solid var(--color-border-secondary);
        transform: translateX(-100%);
        transition: transform 0.3s ease;
        z-index: 50;
        box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
      }

      .sidebar-open {
        transform: translateX(0);
      }

      .sidebar-container {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .sidebar-nav {
        flex: 1;
        padding: 24px 0;
      }

      .nav-section {
        margin-bottom: 32px;
      }

      .nav-section-title {
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: var(--color-text-tertiary);
        padding: 0 24px 12px;
        margin: 0;
      }

      .nav-items {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 0 16px;
      }

      .nav-item {
        position: relative;
        display: flex;
        align-items: center;
        padding: 12px 16px;
        border-radius: 12px;
        color: var(--color-text-secondary);
        text-decoration: none;
        transition: all 0.2s ease;
        font-weight: 500;
        font-size: 14px;
        overflow: hidden;
      }

      .nav-item:hover {
        background: var(--color-brand-50);
        color: var(--color-text-brand);
        transform: translateX(4px);
      }

      .nav-item-active {
        background: var(--color-brand-50) !important;
        color: var(--color-text-brand) !important;
        font-weight: 600;
      }

      .nav-item-active .nav-item-icon i {
        color: var(--color-brand) !important;
      }

      .nav-item-active .nav-item-indicator {
        opacity: 1;
        transform: scaleY(1);
      }

      .nav-item-icon {
        width: 20px;
        height: 20px;
        margin-right: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .nav-item-icon i {
        color: var(--color-text-tertiary);
        font-size: 16px;
        transition: color 0.2s ease;
      }

      .nav-item:hover .nav-item-icon i {
        color: var(--color-brand);
      }

      .nav-item-label {
        flex: 1;
      }

      .nav-item-indicator {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%) scaleY(0);
        width: 3px;
        height: 24px;
        background: var(--color-brand);
        border-radius: 2px 0 0 2px;
        opacity: 0;
        transition: all 0.2s ease;
      }

      .sidebar-user-info {
        padding: 20px 24px;
        border-top: 1px solid var(--color-border-secondary);
        display: flex;
        align-items: center;
        gap: 12px;
        background: var(--color-brand-50);
        margin: 0 16px 16px;
        border-radius: 12px;
      }

      .user-avatar {
        width: 40px;
        height: 40px;
        background: var(--color-brand);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-text-always-light);
        font-size: 16px;
      }

      .user-details {
        flex: 1;
        min-width: 0;
      }

      .user-email {
        font-size: 14px;
        font-weight: 600;
        color: var(--color-text-primary);
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .user-role {
        font-size: 12px;
        color: var(--color-text-tertiary);
        margin: 0;
        text-transform: capitalize;
      }

      /* Dark mode adjustments */
      .dark .organization-sidebar {
        background: var(--color-container);
        border-right-color: var(--color-border-primary);
      }

      .dark .nav-item:hover {
        background: var(--color-brand-950);
        color: var(--color-brand-300);
      }

      .dark .nav-item-active {
        background: var(--color-brand-950) !important;
        color: var(--color-brand-300) !important;
      }

      .dark .nav-item-active .nav-item-icon i {
        color: var(--color-brand-400) !important;
      }

      .dark .sidebar-user-info {
        background: var(--color-brand-950);
        border-top-color: var(--color-border-primary);
      }

      /* Responsive */
      @media (min-width: 1024px) {
        .organization-sidebar {
          position: static;
          transform: none;
          width: 280px;
          height: calc(100vh - 70px);
        }
      }
    `,
  ],
})
export class SidebarComponent {
  @Input() user: AuthUser | null = null;
  @Input() isOpen = true;
  @Output() closeSidebar = new EventEmitter<void>();

  private router = inject(Router);

  private menuItems: MenuItem[] = [
    // Admin Menu Items
    {
      label: 'Manage People',
      icon: 'pi pi-users',
      route: '/admin/manage-people',
      roles: [UserRole.ADMIN],
    },
    {
      label: 'Manage Rooms',
      icon: 'pi pi-home',
      route: '/admin/manage-rooms',
      roles: [UserRole.ADMIN],
    },
    {
      label: 'Manage Requests',
      icon: 'pi pi-inbox',
      route: '/admin/manage-requests',
      roles: [UserRole.ADMIN],
    },

    // Staff Menu Items
    {
      label: 'Calendar',
      icon: 'pi pi-calendar',
      route: '/dashboard/calendar',
      roles: [UserRole.STAFF],
    },
    {
      label: 'My Bookings',
      icon: 'pi pi-clock',
      route: '/dashboard/my-bookings',
      roles: [UserRole.STAFF],
    },
  ];

  get isMobile(): boolean {
    return window.innerWidth < 1024;
  }

  getMenuItems(): MenuItem[] {
    if (!this.user) {
      return [];
    }

    return this.menuItems.filter((item) =>
      item.roles.includes(this.user!.role)
    );
  }

  getRoleDisplayName(role: UserRole): string {
    switch (role) {
      case UserRole.ADMIN:
        return 'Administrator';
      case UserRole.STAFF:
        return 'Staff Member';
      default:
        return 'User';
    }
  }

  onMobileMenuClick(): void {
    if (this.isMobile) {
      this.closeSidebar.emit();
    }
  }
}
