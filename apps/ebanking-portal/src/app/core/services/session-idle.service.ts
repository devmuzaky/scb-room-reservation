import { effect, inject, Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, interval, merge, Subscription } from 'rxjs';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '@/auth/api/auth.service';
import { IdleAlertService } from '@/core/components/idle-alert/idle-alert.service';
import { AppConfigService } from '@/core/config/app-config.service';
import { AuthStore } from '@/store/auth-store';

/**
 * Zone-less friendly session manager using RxJS only.
 * - Detects user activity and tracks inactivity duration
 * - Pings `/me` periodically while authenticated
 * - Logs out on idle timeout or backend 401
 */
@Injectable({ providedIn: 'root' })
export class SessionIdleService {
  private readonly authService = inject(AuthService);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly ngZone = inject(NgZone);
  private readonly appConfig = inject(AppConfigService);
  private readonly idleAlert = inject(IdleAlertService);

  private activitySub?: Subscription;
  private keepaliveSub?: Subscription;
  private idleTimeoutHandle?: number;
  private finalTimeoutHandle?: number;
  private accessExpiryHandle?: number;

  constructor() {
    // React to auth state changes using signal effects
    effect(() => {
      const isAuthed = this.authStore.isAuthenticated();
      if (isAuthed) {
        this.start();
      } else {
        this.stop();
      }
    });
  }

  private start() {
    this.ngZone.runOutsideAngular(() => {
      this.startActivityWatcher();
      this.startKeepalive();
      this.scheduleAccessExpiryWatcher();
    });
  }

  private stop() {
    if (this.activitySub) {
      this.activitySub.unsubscribe();
      this.activitySub = undefined;
    }
    if (this.keepaliveSub) {
      this.keepaliveSub.unsubscribe();
      this.keepaliveSub = undefined;
    }
    if (this.idleTimeoutHandle) {
      clearTimeout(this.idleTimeoutHandle);
      this.idleTimeoutHandle = undefined as unknown as number;
    }
    if (this.finalTimeoutHandle) {
      clearTimeout(this.finalTimeoutHandle);
      this.finalTimeoutHandle = undefined as unknown as number;
    }
    if (this.accessExpiryHandle) {
      clearTimeout(this.accessExpiryHandle);
      this.accessExpiryHandle = undefined as unknown as number;
    }
    // Ensure any open idle dialog is closed
    this.ngZone.run(() => this.idleAlert.closeAll());
  }

  private startKeepalive() {
    if (this.keepaliveSub) {
      this.keepaliveSub.unsubscribe();
    }
    const keepaliveMs = this.appConfig.config.keepalive * 1000;
    this.keepaliveSub = interval(keepaliveMs)
      .pipe(
        switchMap(() => this.authService.me()),
        // Only act on errors; success means session is valid
        tap({
          error: () => this.forceLogout(),
        }),
      )
      .subscribe();
  }

  private startActivityWatcher() {
    const activityEvents = ['mousedown', 'keydown', 'touchstart', 'scroll', 'click', 'wheel'];

    // Merge events from window and document
    const activity$ = merge(
      ...activityEvents.map(evt => fromEvent(window, evt)),
      ...activityEvents.map(evt => fromEvent(document, evt)),
    ).pipe(debounceTime(200));

    // Reset timers immediately on activity
    if (this.activitySub) {
      this.activitySub.unsubscribe();
    }

    const idleMs = this.appConfig.config.idle * 1000;
    const timeoutMs = this.appConfig.config.timeout * 1000;

    const scheduleFinalTimeout = () => {
      if (this.finalTimeoutHandle) {
        clearTimeout(this.finalTimeoutHandle);
      }
      this.finalTimeoutHandle = setTimeout(() => {
        this.forceLogout();
      }, timeoutMs) as unknown as number;
    };

    const scheduleIdle = () => {
      if (this.idleTimeoutHandle) {
        clearTimeout(this.idleTimeoutHandle);
      }
      this.idleTimeoutHandle = setTimeout(() => {
        // Enter idle state; start final timeout countdown
        scheduleFinalTimeout();
        // Open idle alert dialog with countdown and actions
        this.ngZone.run(() =>
          this.idleAlert.open({
            seconds: this.appConfig.config.timeout,
            onExtend: () => {
              // User chose to extend session, reset timers
              if (this.finalTimeoutHandle) {
                clearTimeout(this.finalTimeoutHandle);
                this.finalTimeoutHandle = undefined as unknown as number;
              }
              this.idleAlert.closeAll();
              scheduleIdle();
            },
            onCancel: () => this.forceLogout(),
          }),
        );
      }, idleMs) as unknown as number;
    };

    // Initial schedule when starting to watch
    scheduleIdle();

    this.activitySub = activity$
      .pipe(
        tap(() => {
          // Any activity resets idle and final timeout timers
          if (this.finalTimeoutHandle) {
            clearTimeout(this.finalTimeoutHandle);
            this.finalTimeoutHandle = undefined as unknown as number;
          }
          // Close idle dialog if open
          this.ngZone.run(() => this.idleAlert.closeAll());
          scheduleIdle();
        }),
      )
      .subscribe();
  }

  private scheduleAccessExpiryWatcher() {
    // Clear previous
    if (this.accessExpiryHandle) {
      clearTimeout(this.accessExpiryHandle);
      this.accessExpiryHandle = undefined as unknown as number;
    }

    const tokens = this.authStore.tokens();
    if (!tokens?.accessToken || !tokens.issuedAtMs || !tokens.expiresIn) return;

    const now = Date.now();
    const expiresAtMs = tokens.issuedAtMs + tokens.expiresIn * 1000;
    const msUntilExpiry = Math.max(0, expiresAtMs - now);

    this.accessExpiryHandle = setTimeout(() => {
      // When access token actually expires, open the idle dialog with the configured timeout countdown
      // Extend: try refresh; Cancel: force logout
      this.ngZone.run(() =>
        this.idleAlert.open({
          seconds: this.appConfig.config.timeout,
          onExtend: () => {
            // Try refresh token
            this.authService.refreshToken().subscribe({
              next: () => {
                // Tokens updated; reschedule expiry watcher and close dialog
                this.scheduleAccessExpiryWatcher();
                this.idleAlert.closeAll();
              },
              error: () => this.forceLogout(),
            });
          },
          onCancel: () => this.forceLogout(),
        }),
      );
    }, msUntilExpiry) as unknown as number;

    // Also reactively reschedule when tokens change
    // Note: effect at constructor already restarts start/stop on auth changes.
  }

  private forceLogout() {
    this.stop();
    this.authStore.clearAuthState();
    // Close idle dialog explicitly before navigation
    this.ngZone.run(() => this.idleAlert.closeAll());
    // Ensure navigation runs in Angular context
    this.ngZone.run(() => this.router.navigate(['/login']));
  }
}
