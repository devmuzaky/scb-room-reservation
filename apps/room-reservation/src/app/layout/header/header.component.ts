import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';

import { AuthUser } from '@/models/auth.model';
import { UserRole } from '@/models/user.model';

@Component({
  selector: 'app-header',
  imports: [CommonModule, ButtonModule, BadgeModule, AvatarModule],
  template: `
    <header
      class="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center px-6 relative z-50"
    >
      <div class="flex justify-between items-center w-full">
        <div class="flex items-center space-x-4">
          <button
            class="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            (click)="toggleSidebar.emit()"
            type="button"
            aria-label="Toggle Menu"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <button
            class="hidden lg:flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            (click)="toggleSidebar.emit()"
            type="button"
            aria-label="Toggle Sidebar"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <div class="flex items-center space-x-3">
            <div
              class="h-10 w-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md"
            >
              <i class="pi pi-home text-white text-lg"></i>
            </div>

            <div class="hidden sm:block">
              <h1 class="text-xl font-bold text-gray-900">BookedIn</h1>
              <p class="text-xs text-gray-500 -mt-0.5">Meeting Management</p>
            </div>
          </div>
        </div>

        <div class="flex items-center space-x-3">
          <div
            class="hidden md:flex items-center space-x-3 bg-gray-50 rounded-xl px-4 py-2"
            *ngIf="user"
          >
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900 leading-tight">
                {{ user.email }}
              </p>
              <div class="flex items-center justify-end space-x-1 -mt-0.5">
                <span
                  class="px-2 py-0.5 text-xs font-semibold rounded-full"
                  [class]="getRoleBadgeClass(user.role)"
                >
                  {{ getRoleDisplayName(user.role) }}
                </span>
              </div>
            </div>

            <div
              class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"
            >
              <i class="pi pi-user text-blue-600 text-sm"></i>
            </div>
          </div>

          <button
            class="flex items-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            (click)="logout.emit()"
            type="button"
          >
            <i class="pi pi-sign-out mr-2"></i>
            <span class="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }

      button:focus {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
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
