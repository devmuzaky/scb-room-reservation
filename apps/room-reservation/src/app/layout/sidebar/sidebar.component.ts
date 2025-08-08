import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  OnInit,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';

import { AuthUser } from '@/models/auth.model';
import { UserRole } from '@/models/user.model';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles: UserRole[];
  description?: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    SidebarModule,
    BadgeModule,
    AvatarModule,
  ],
  template: `
    <!-- Desktop Sidebar - Positioned BELOW header -->
    <aside
      *ngIf="!isMobile"
      class="fixed left-0 w-72 bg-white shadow-lg border-r border-gray-200 transform transition-transform duration-300 z-30"
      [class.translate-x-0]="isOpen"
      [class.-translate-x-full]="!isOpen"
      [style.top.px]="64"
      [style.height]="'calc(100vh - 64px)'"
    >
      <div class="flex flex-col h-full">
        <!-- Desktop Sidebar Header -->
        <div
          class="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100"
        >
          <div class="flex items-center space-x-3">
            <div
              class="h-10 w-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center"
            >
              <i class="pi pi-home text-white text-lg"></i>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">Navigation</h3>
              <p class="text-xs text-gray-600">
                {{ getRoleDisplayName(user?.role || UserRole.STAFF) }} Panel
              </p>
            </div>
          </div>
        </div>

        <!-- Desktop Navigation Menu -->
        <nav class="flex-1 px-4 py-6 overflow-y-auto">
          <div class="space-y-2">
            <a
              *ngFor="let item of getMenuItems()"
              [routerLink]="item.route"
              routerLinkActive="active-nav-item"
              class="nav-item group flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
              (click)="onMenuClick()"
            >
              <!-- Icon -->
              <div
                class="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-blue-100 mr-3 transition-colors"
              >
                <i
                  [class]="
                    'pi pi-' +
                    item.icon +
                    ' text-gray-500 group-hover:text-blue-600'
                  "
                ></i>
              </div>

              <!-- Label & Description -->
              <div class="flex-1">
                <div class="font-medium">{{ item.label }}</div>
                <div
                  class="text-xs text-gray-500 group-hover:text-blue-500"
                  *ngIf="item.description"
                >
                  {{ item.description }}
                </div>
              </div>

              <!-- Arrow -->
              <i
                class="pi pi-angle-right text-gray-400 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all"
              ></i>
            </a>
          </div>
        </nav>

        <!-- Desktop User Profile -->
        <div class="p-4 border-t border-gray-100 bg-gray-50" *ngIf="user">
          <div
            class="flex items-center space-x-3 p-3 bg-white rounded-xl shadow-sm"
          >
            <div
              class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
            >
              <i class="pi pi-user text-blue-600"></i>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">
                {{ user.email }}
              </p>
              <div class="flex items-center space-x-1 mt-1">
                <span
                  class="px-2 py-0.5 text-xs font-semibold rounded-full"
                  [class]="getRoleBadgeClass(user.role)"
                >
                  {{ getRoleDisplayName(user.role) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Mobile Sidebar - PrimeNG Sidebar with proper z-index -->
    <p-sidebar
      *ngIf="isMobile"
      [(visible)]="mobileVisible"
      position="left"
      [modal]="true"
      [dismissible]="true"
      [closeOnEscape]="true"
      styleClass="mobile-sidebar"
      (onHide)="onMobileHide()"
    >
      <ng-template pTemplate="header">
        <div class="flex items-center space-x-3 w-full">
          <div
            class="h-8 w-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center"
          >
            <i class="pi pi-home text-white text-sm"></i>
          </div>
          <div>
            <span class="font-semibold text-gray-900">BookedIn</span>
            <p class="text-xs text-gray-600">
              {{ getRoleDisplayName(user?.role || UserRole.STAFF) }}
            </p>
          </div>
        </div>
      </ng-template>

      <ng-template pTemplate="content">
        <div class="flex flex-col h-full -m-6">
          <!-- Mobile Navigation -->
          <nav class="flex-1 px-6 py-4">
            <div class="space-y-2">
              <a
                *ngFor="let item of getMenuItems()"
                [routerLink]="item.route"
                routerLinkActive="active-mobile-nav"
                class="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-all"
                (click)="closeMobileSidebar()"
              >
                <div
                  class="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 mr-3"
                >
                  <i
                    [class]="'pi pi-' + item.icon + ' text-gray-500 text-sm'"
                  ></i>
                </div>
                <div>
                  <div class="font-medium">{{ item.label }}</div>
                  <div class="text-xs text-gray-500" *ngIf="item.description">
                    {{ item.description }}
                  </div>
                </div>
              </a>
            </div>
          </nav>

          <!-- Mobile User Info -->
          <div class="p-6 border-t border-gray-100 bg-gray-50" *ngIf="user">
            <div class="flex items-center space-x-3">
              <div
                class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
              >
                <i class="pi pi-user text-blue-600"></i>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">
                  {{ user.email }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ getRoleDisplayName(user.role) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </ng-template>
    </p-sidebar>
  `,
  styles: [
    `
      /* Active navigation styles */
      :host ::ng-deep {
        .active-nav-item {
          background: linear-gradient(
            135deg,
            #3b82f6 0%,
            #2563eb 100%
          ) !important;
          color: white !important;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3) !important;
          transform: scale(1.02);
        }

        .active-nav-item .pi {
          color: white !important;
        }

        .active-nav-item div {
          background: rgba(255, 255, 255, 0.2) !important;
        }

        .active-mobile-nav {
          background: #3b82f6 !important;
          color: white !important;
        }

        .active-mobile-nav .pi {
          color: white !important;
        }

        .active-mobile-nav div {
          background: rgba(255, 255, 255, 0.2) !important;
        }

        /* Mobile sidebar z-index fix */
        .mobile-sidebar {
          z-index: 1000 !important;
        }

        .mobile-sidebar .p-sidebar {
          z-index: 1000 !important;
        }

        .mobile-sidebar .p-sidebar-mask {
          z-index: 999 !important;
        }
      }

      .badge-admin {
        background-color: #fecaca;
        color: #dc2626;
      }

      .badge-staff {
        background-color: #bfdbfe;
        color: #2563eb;
      }

      .badge-default {
        background-color: #f3f4f6;
        color: #6b7280;
      }
    `,
  ],
})
export class SidebarComponent implements OnInit, OnChanges {
  @Input() user: AuthUser | null = null;
  @Input() isOpen = false;
  @Output() closeSidebar = new EventEmitter<void>();

  private router = inject(Router);
  mobileVisible = false;
  UserRole = UserRole;

  private menuItems: MenuItem[] = [
    // Admin Menu Items
    {
      label: 'Manage People',
      icon: 'users',
      route: '/admin/manage-people',
      roles: [UserRole.ADMIN],
      description: 'Add & manage staff users',
    },
    {
      label: 'Manage Rooms',
      icon: 'home',
      route: '/admin/manage-rooms',
      roles: [UserRole.ADMIN],
      description: 'View & cancel bookings',
    },
    {
      label: 'Manage Requests',
      icon: 'inbox',
      route: '/admin/manage-requests',
      roles: [UserRole.ADMIN],
      description: 'Approve booking requests',
    },

    // Staff Menu Items
    {
      label: 'Calendar',
      icon: 'calendar',
      route: '/dashboard/calendar',
      roles: [UserRole.STAFF],
      description: 'View monthly calendar',
    },
    {
      label: 'My Bookings',
      icon: 'clock',
      route: '/dashboard/my-bookings',
      roles: [UserRole.STAFF],
      description: 'Manage your reservations',
    },
  ];

  get isMobile(): boolean {
    return window.innerWidth < 1024;
  }

  ngOnInit(): void {
    this.updateMobileVisibility();
  }

  ngOnChanges(): void {
    this.updateMobileVisibility();
  }

  private updateMobileVisibility(): void {
    if (this.isMobile) {
      this.mobileVisible = this.isOpen;
    } else {
      this.mobileVisible = false;
    }
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

  getRoleBadgeClass(role: UserRole): string {
    switch (role) {
      case UserRole.ADMIN:
        return 'badge-admin';
      case UserRole.STAFF:
        return 'badge-staff';
      default:
        return 'badge-default';
    }
  }

  onMenuClick(): void {
    if (this.isMobile) {
      this.closeMobileSidebar();
    }
  }

  onMobileHide(): void {
    this.mobileVisible = false;
    this.closeSidebar.emit();
  }

  closeMobileSidebar(): void {
    this.mobileVisible = false;
    this.closeSidebar.emit();
  }
}
