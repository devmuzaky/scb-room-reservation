import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';

import { AuthUser } from '@/models/auth.model';
import { UserRole } from '@/models/user.model';

@Component({
  selector: 'app-header',
  imports: [CommonModule, ButtonModule, ToolbarModule, BadgeModule, TooltipModule],
  template: `
    <div class="organization-header">
      <div class="flex justify-between items-center w-full px-6 py-4">
        <!-- Left side -->
        <div class="flex items-center space-x-4">
          <!-- Mobile Sidebar Toggle -->
          <button
            class="organization-btn-ghost lg:hidden"
            (click)="toggleSidebar.emit()"
            pTooltip="Toggle Menu"
            tooltipPosition="bottom">
            <i class="pi pi-bars text-lg"></i>
          </button>

          <!-- Logo & Title -->
          <div class="flex items-center space-x-3">
            <div class="organization-logo">
              <i class="pi pi-home text-white"></i>
            </div>
            <div>
              <h1 class="text-xl font-bold text-white">Room Reservation</h1>
              <p class="text-xs text-brand-200 hidden sm:block">Meeting Room Management System</p>
            </div>
          </div>
        </div>

        <!-- Right side -->
        <div class="flex items-center space-x-4">
          <!-- User Info -->
          <div class="hidden md:flex items-center space-x-3" *ngIf="user">
            <div class="text-right">
              <p class="text-sm font-medium text-white">{{ user.email }}</p>
              <div class="flex items-center justify-end space-x-1">
                <span class="organization-badge" [class]="getRoleBadgeClass(user.role)">
                  {{ getRoleDisplayName(user.role) }}
                </span>
              </div>
            </div>
            <div class="organization-avatar">
              <i class="pi pi-user text-white"></i>
            </div>
          </div>

          <!-- Desktop Sidebar Toggle -->
          <button
            class="organization-btn-ghost hidden lg:flex"
            (click)="toggleSidebar.emit()"
            pTooltip="Toggle Sidebar"
            tooltipPosition="bottom">
            <i class="pi pi-bars"></i>
          </button>

          <!-- Logout Button -->
          <button
            class="organization-btn-outline"
            (click)="logout.emit()"
            pTooltip="Logout"
            tooltipPosition="bottom">
            <i class="pi pi-sign-out mr-2"></i>
            <span class="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .organization-header {
      background: linear-gradient(135deg, var(--color-brand-800) 0%, var(--color-brand-700) 100%);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border-bottom: 1px solid var(--color-brand-700);
    }

    .organization-logo {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, var(--color-brand-400) 0%, var(--color-brand-500) 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0, 81, 141, 0.3);
    }

    .organization-avatar {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, var(--color-brand-300) 0%, var(--color-brand-400) 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid rgba(255, 255, 255, 0.2);
    }

    .organization-btn-ghost {
      background: transparent;
      color: var(--color-text-always-light);
      border: none;
      padding: 8px 12px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .organization-btn-ghost:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-1px);
    }

    .organization-btn-outline {
      background: transparent;
      color: var(--color-text-always-light);
      border: 1px solid rgba(255, 255, 255, 0.3);
      padding: 8px 16px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      font-size: 14px;
      font-weight: 500;
    }

    .organization-btn-outline:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.5);
      transform: translateY(-1px);
    }

    .organization-badge {
      font-size: 11px;
      font-weight: 600;
      padding: 4px 8px;
      border-radius: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .badge-admin {
      background: var(--color-danger);
      color: var(--color-text-always-light);
    }

    .badge-staff {
      background: var(--color-info);
      color: var(--color-text-always-light);
    }

    .badge-default {
      background: var(--color-gray-500);
      color: var(--color-text-always-light);
    }

    .text-brand-200 {
      color: var(--color-brand-200);
    }

    /* Dark mode adjustments */
    .dark .organization-header {
      background: linear-gradient(135deg, var(--color-brand-900) 0%, var(--color-brand-800) 100%);
      border-bottom-color: var(--color-brand-800);
    }
  `]
})
export class HeaderComponent {
  @Input() user: AuthUser | null = null;
  @Output() logout = new EventEmitter<void>();
  @Output() toggleSidebar = new EventEmitter<void>();

  getRoleDisplayName(role: UserRole): string {
    switch (role) {
      case UserRole.ADMIN:
        return 'Admin';
      case UserRole.STAFF:
        return 'Staff';
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
}
