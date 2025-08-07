import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subject, takeUntil, finalize } from 'rxjs';

// PrimeNG Components
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

import { AuthService } from '@/services/auth.service';
import { LoginRequest } from '@/models/auth.model';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MessageModule,
  ],
  template: `
    <div class="login-container">
      <div class="login-wrapper">
        <!-- Brand Header -->
        <div class="login-header">
          <div class="brand-logo">
            <i class="pi pi-home"></i>
          </div>
          <h1 class="brand-title">Room Reservation</h1>
          <p class="brand-subtitle">Meeting Room Management System</p>
        </div>

        <!-- Demo Credentials -->
        <div class="demo-credentials">
          <h3 class="demo-title">Demo Accounts:</h3>
          <div class="demo-list">
            <div class="demo-item">
              <span class="demo-label">Admin:</span>
              <span class="demo-value">admin@test.com / Admin123!</span>
            </div>
            <div class="demo-item">
              <span class="demo-label">Staff:</span>
              <span class="demo-value">staff@test.com / Staff123!</span>
            </div>
          </div>
        </div>

        <!-- Login Form -->
        <div class="login-card">
          <form
            [formGroup]="loginForm"
            (ngSubmit)="onSubmit()"
            class="login-form"
          >
            <!-- Email Field -->
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input
                type="email"
                formControlName="email"
                placeholder="Enter your email"
                class="form-input"
                [class.form-input-error]="
                  loginForm.get('email')?.invalid &&
                  loginForm.get('email')?.touched
                "
              />
            </div>

            <!-- Password Field -->
            <div class="form-group">
              <label class="form-label">Password</label>
              <p-password
                formControlName="password"
                placeholder="Enter your password"
                styleClass="w-full password-field"
                inputStyleClass="w-full form-input"
                [toggleMask]="true"
                [feedback]="false"
              />
            </div>

            <!-- Error Message -->
            <div *ngIf="errorMessage" class="error-message">
              <i class="pi pi-exclamation-triangle mr-2"></i>
              <span>{{ errorMessage }}</span>
            </div>

            <!-- Login Button -->
            <button
              type="submit"
              class="login-button"
              [class.login-button-loading]="isLoading"
              [disabled]="loginForm.invalid || isLoading"
            >
              <span *ngIf="!isLoading">Sign In</span>
              <span *ngIf="isLoading" class="flex items-center justify-center">
                <i class="pi pi-spinner pi-spin mr-2"></i>
                Signing in...
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .login-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
        background: linear-gradient(
          135deg,
          var(--color-brand-50) 0%,
          var(--color-brand-100) 100%
        );
        position: relative;
        overflow: hidden;
      }

      .login-container::before {
        content: '';
        position: absolute;
        top: -50%;
        right: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(
          circle,
          var(--color-brand-200) 0%,
          transparent 70%
        );
        opacity: 0.3;
        animation: float 20s ease-in-out infinite;
      }

      @keyframes float {
        0%,
        100% {
          transform: translateY(0px) rotate(0deg);
        }
        50% {
          transform: translateY(-20px) rotate(5deg);
        }
      }

      .login-wrapper {
        width: 100%;
        max-width: 420px;
        position: relative;
        z-index: 10;
      }

      .login-header {
        text-align: center;
        margin-bottom: 32px;
      }

      .brand-logo {
        width: 64px;
        height: 64px;
        background: linear-gradient(
          135deg,
          var(--color-brand-600) 0%,
          var(--color-brand-700) 100%
        );
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
        color: var(--color-text-always-light);
        font-size: 28px;
        box-shadow: 0 8px 32px rgba(0, 81, 141, 0.3);
      }

      .brand-title {
        font-size: 28px;
        font-weight: 700;
        color: var(--color-text-brand);
        margin: 0 0 8px;
        letter-spacing: -0.5px;
      }

      .brand-subtitle {
        font-size: 16px;
        color: var(--color-text-secondary);
        margin: 0;
        font-weight: 500;
      }

      .demo-credentials {
        background: var(--color-container);
        border: 1px solid var(--color-brand-200);
        border-radius: 16px;
        padding: 20px;
        margin-bottom: 24px;
        box-shadow: 0 4px 16px rgba(0, 81, 141, 0.05);
      }

      .demo-title {
        font-size: 14px;
        font-weight: 600;
        color: var(--color-text-brand);
        margin: 0 0 12px;
      }

      .demo-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .demo-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
      }

      .demo-label {
        font-weight: 600;
        color: var(--color-text-primary);
        min-width: 50px;
      }

      .demo-value {
        color: var(--color-text-secondary);
        font-family: 'JetBrains Mono', 'Fira Code', monospace;
        background: var(--color-brand-50);
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 12px;
      }

      .login-card {
        background: var(--color-container);
        border-radius: 20px;
        padding: 32px;
        box-shadow: 0 12px 48px rgba(0, 0, 0, 0.1);
        border: 1px solid var(--color-border-secondary);
        backdrop-filter: blur(10px);
      }

      .login-form {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .form-label {
        font-size: 14px;
        font-weight: 600;
        color: var(--color-text-primary);
        margin-bottom: 4px;
      }

      .form-input {
        width: 100%;
        padding: 14px 16px;
        border: 2px solid var(--color-border-primary);
        border-radius: 12px;
        background: var(--color-container);
        color: var(--color-text-primary);
        font-size: 16px;
        transition: all 0.2s ease;
        outline: none;
      }

      .form-input:focus {
        border-color: var(--color-brand);
        box-shadow: 0 0 0 4px rgba(0, 81, 141, 0.1);
      }

      .form-input-error {
        border-color: var(--color-danger);
      }

      .form-input-error:focus {
        box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.1);
      }

      .error-message {
        background: rgba(220, 38, 38, 0.05);
        color: var(--color-danger);
        padding: 12px 16px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        display: flex;
        align-items: center;
        border: 1px solid rgba(220, 38, 38, 0.2);
      }

      .login-button {
        width: 100%;
        padding: 16px 24px;
        background: linear-gradient(
          135deg,
          var(--color-brand-600) 0%,
          var(--color-brand-700) 100%
        );
        color: var(--color-text-always-light);
        border: none;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;
        overflow: hidden;
      }

      .login-button:hover:not(:disabled) {
        background: linear-gradient(
          135deg,
          var(--color-brand-700) 0%,
          var(--color-brand-800) 100%
        );
        transform: translateY(-2px);
        box-shadow: 0 8px 32px rgba(0, 81, 141, 0.3);
      }

      .login-button:active:not(:disabled) {
        transform: translateY(0);
      }

      .login-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
      }

      .login-button-loading {
        background: linear-gradient(
          135deg,
          var(--color-brand-600) 0%,
          var(--color-brand-700) 100%
        );
      }

      /* PrimeNG Overrides */
      :host ::ng-deep {
        .password-field .p-password {
          width: 100%;
        }

        .password-field .p-password input {
          width: 100% !important;
          padding: 14px 16px !important;
          border: 2px solid var(--color-border-primary) !important;
          border-radius: 12px !important;
          background: var(--color-container) !important;
          color: var(--color-text-primary) !important;
          font-size: 16px !important;
          transition: all 0.2s ease !important;
        }

        .password-field .p-password input:focus {
          border-color: var(--color-brand) !important;
          box-shadow: 0 0 0 4px rgba(0, 81, 141, 0.1) !important;
        }

        .password-field .p-password .p-password-toggle-icon {
          color: var(--color-text-tertiary) !important;
        }
      }

      /* Dark mode adjustments */
      .dark .login-container {
        background: linear-gradient(
          135deg,
          var(--color-brand-950) 0%,
          var(--color-brand-900) 100%
        );
      }

      .dark .demo-value {
        background: var(--color-brand-900);
        color: var(--color-brand-300);
      }
    `,
  ],
})
export class LoginComponent implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    // Clear error when user types
    this.loginForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (this.errorMessage) {
        this.errorMessage = '';
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.loginForm.invalid || this.isLoading) return;

    this.isLoading = true;
    this.errorMessage = '';

    const credentials: LoginRequest = this.loginForm.value;

    this.authService
      .login(credentials)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.isLoading = false))
      )
      .subscribe({
        next: () => {
          // Success - navigation handled in auth service
        },
        error: (error) => {
          this.errorMessage =
            error.message || 'Login failed. Please try again.';
        },
      });
  }
}
