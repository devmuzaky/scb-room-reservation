import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { AuthService } from '@/services/auth.service';
import { AuthUser } from '@/models/auth.model';
import { HeaderComponent } from '@/layout/header/header.component';
import { SidebarComponent } from '@/layout/sidebar/sidebar.component';

@Component({
  selector: 'app-main-layout',
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent],
  template: `
    <div class="organization-layout">
      <!-- Header -->
      <app-header
        [user]="currentUser"
        (logout)="onLogout()"
        (toggleSidebar)="toggleSidebar()"
      >
      </app-header>

      <!-- Main Content Area -->
      <div class="layout-body">
        <!-- Sidebar -->
        <app-sidebar
          [user]="currentUser"
          [isOpen]="sidebarOpen"
          (closeSidebar)="closeSidebar()"
        >
        </app-sidebar>

        <!-- Main Content -->
        <main
          class="layout-main"
          [class.with-sidebar]="sidebarOpen && !isMobile"
        >
          <div class="content-container">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [
    `
      .organization-layout {
        height: 100vh;
        display: flex;
        flex-direction: column;
        background: var(--color-page);
      }

      .layout-body {
        flex: 1;
        display: flex;
        overflow: hidden;
        position: relative;
      }

      .layout-main {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transition: margin-left 0.3s ease;
        margin-left: 0;
        background: var(--color-page);
      }

      .layout-main.with-sidebar {
        margin-left: 280px;
      }

      .content-container {
        flex: 1;
        padding: 24px;
        overflow-y: auto;
        background: var(--color-page);
      }

      /* Responsive adjustments */
      @media (max-width: 1023px) {
        .layout-main.with-sidebar {
          margin-left: 0;
        }
      }

      /* Custom scrollbar */
      .content-container::-webkit-scrollbar {
        width: 8px;
      }

      .content-container::-webkit-scrollbar-track {
        background: var(--color-border-secondary);
        border-radius: 4px;
      }

      .content-container::-webkit-scrollbar-thumb {
        background: var(--color-border-primary);
        border-radius: 4px;
      }

      .content-container::-webkit-scrollbar-thumb:hover {
        background: var(--color-text-tertiary);
      }

      /* Dark mode adjustments */
      .dark .organization-layout {
        background: var(--color-page);
      }

      .dark .layout-main {
        background: var(--color-page);
      }

      .dark .content-container {
        background: var(--color-page);
      }
    `,
  ],
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly destroy$ = new Subject<void>();

  currentUser: AuthUser | null = null;
  sidebarOpen = true;

  get isMobile(): boolean {
    return window.innerWidth < 1024;
  }

  ngOnInit(): void {
    // Initialize sidebar state based on screen size
    this.sidebarOpen = !this.isMobile;

    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.currentUser = user;
      });

    // Listen for window resize
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    window.removeEventListener('resize', this.handleResize.bind(this));
  }

  onLogout(): void {
    this.authService.logout();
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  private handleResize(): void {
    // Auto-close sidebar on mobile
    if (this.isMobile && this.sidebarOpen) {
      this.sidebarOpen = false;
    }
    // Auto-open sidebar on desktop
    else if (!this.isMobile && !this.sidebarOpen) {
      this.sidebarOpen = true;
    }
  }
}
