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
    <div *ngIf="currentUser; else noLayout" class="h-screen flex flex-col">
      <app-header
        [user]="currentUser"
        (logout)="onLogout()"
        (toggleSidebar)="toggleSidebar()"
      >
      </app-header>

      <div class="flex flex-1 overflow-hidden relative">
        <app-sidebar
          [user]="currentUser"
          [isOpen]="sidebarOpen"
          (closeSidebar)="closeSidebar()"
        >
        </app-sidebar>

        <main
          class="flex-1 bg-gray-50 transition-all duration-300 overflow-hidden"
          [class.lg:ml-0]="!sidebarOpen"
          [class.lg:ml-72]="sidebarOpen"
        >
          <div class="h-full flex flex-col">
            <div class="flex-1 p-4 lg:p-6 overflow-auto">
              <div class="max-w-7xl mx-auto h-full">
                <div
                  class="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col"
                >
                  <div class="flex-1 p-6 lg:p-8 overflow-auto">
                    <router-outlet></router-outlet>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>

    <ng-template #noLayout>
      <div class="min-h-screen">
        <router-outlet></router-outlet>
      </div>
    </ng-template>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100vh;
        overflow: hidden;
      }

      .overflow-auto::-webkit-scrollbar {
        width: 6px;
      }

      .overflow-auto::-webkit-scrollbar-track {
        background: #f1f5f9;
      }

      .overflow-auto::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 3px;
      }

      .overflow-auto::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
      }

      main {
        transition: margin-left 0.3s ease-in-out;
      }

      .h-full {
        height: 100%;
      }

      .flex-1 {
        flex: 1;
        min-height: 0;
      }
    `,
  ],
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly destroy$ = new Subject<void>();

  currentUser: AuthUser | null = null;
  sidebarOpen = false;

  get isMobile(): boolean {
    return window.innerWidth < 1024;
  }

  ngOnInit(): void {
    this.sidebarOpen = !this.isMobile;

    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.currentUser = user;
      });

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
    const newIsMobile = window.innerWidth < 1024;

    if (newIsMobile) {
      this.sidebarOpen = false;
    } else if (!newIsMobile && window.innerWidth >= 1024) {
      this.sidebarOpen = true;
    }
  }
}
