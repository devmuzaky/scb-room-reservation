import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subject, takeUntil, finalize } from 'rxjs';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { DividerModule } from 'primeng/divider';

import { AuthService } from '@/services/auth.service';
import { LoginRequest, SetPasswordRequest } from '@/models/auth.model';
import { Router } from '@angular/router';

function passwordsMatchValidator(form: FormGroup) {
  const password = form.get('password')?.value;
  const confirmPassword = form.get('confirmPassword')?.value;

  if (!confirmPassword) {
    return null; 
  }

  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-activate',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MessageModule,
    DividerModule,
  ],
  template: `
    <div
      class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4"
    >
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <div
            class="mx-auto h-20 w-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg mb-6 transform hover:scale-105 transition-transform"
          >
            <i class="pi pi-home text-white text-3xl"></i>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">BookedIn</h1>
          <p class="text-gray-600">Meeting Room Management System</p>
        </div>

        <p-card styleClass="shadow-xl border-0">
          <ng-template pTemplate="header">
            <div class="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-b">
              <h2 class="text-lg font-semibold text-gray-800 flex items-center">
                <i class="pi pi-sign-in mr-2 text-blue-600"></i>
                Activate Your Account
              </h2>
            </div>
          </ng-template>

          <ng-template pTemplate="content">
            <form
              [formGroup]="activateForm"
              (ngSubmit)="onSave()"
              class="space-y-6 pt-4"
            >

            <p-message
                *ngIf="errorMessage"
                severity="error"
                styleClass="text-red-200 flex items-center  -mt-6 "
                 [text]="errorMessage"
              >
                <ng-template pTemplate="message">
                  <div class="flex items-center text-red-600">
                    <i class="pi pi-times-circle mr-2"></i>
                    <span>{{ errorMessage }}</span>
                  </div>
                </ng-template>
              </p-message>
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                  <i class="pi pi-lock mr-1 text-gray-500"></i>
                  Password
                </label>
                <p-password
                  formControlName="password"
                  placeholder="Enter your password"
                  styleClass="w-full"
                  inputStyleClass="w-full"
                  [toggleMask]="true"
                  [feedback]="false"
                  size="large"
                  (copy)="$event.preventDefault()"
                  (paste)="$event.preventDefault()"
                  [class.ng-invalid]="
                    activateForm.get('password')?.invalid &&
                    activateForm.get('password')?.touched
                  "
                />
                <small
                  *ngIf="
                    activateForm.get('password')?.invalid &&
                    activateForm.get('password')?.touched &&
                    !activateForm.get('password')?.value
                  "
                  class="text-red-600 flex items-center"
                >
                  <i class="pi pi-exclamation-triangle mr-1"></i>
                  Password is required
                </small>

                <small
                  *ngIf="
                (activateForm.get('password')?.errors?.['pattern'] || 
                activateForm.get('password')?.errors?.['minlength']) &&
                activateForm.get('password')?.touched"
                  class="text-red-600 flex items-center"
                >
                  <i class="pi pi-exclamation-triangle mr-1"></i>
                  Password must be at least 6 characters and contain at least
                  one uppercase letter, one number, and one special character
                </small>
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                  <i class="pi pi-lock mr-1 text-gray-500"></i>
                  Confirm Password
                </label>
                <p-password
                  formControlName="confirmPassword"
                  placeholder="Re-enter your password"
                  styleClass="w-full"
                  inputStyleClass="w-full"
                  [toggleMask]="true"
                  [feedback]="false"
                  size="large"
                  (copy)="$event.preventDefault()"
                  (paste)="$event.preventDefault()"
                  [class.ng-invalid]="
                    activateForm.get('confirmPassword')?.invalid &&
                    activateForm.get('confirmPassword')?.touched
                  "
                />
                <small
                  *ngIf="
                    activateForm.get('confirmPassword')?.invalid &&
                    activateForm.get('confirmPassword')?.touched
                  "
                  class="text-red-600 flex items-center"
                >
                  <i class="pi pi-exclamation-triangle mr-1"></i>
                  Confirm Password is required
                </small>

                <small
                  *ngIf="
                    activateForm.hasError('passwordMismatch') &&
                    (activateForm.get('password')?.dirty ||
                      activateForm.get('password')?.touched) &&
                    (activateForm.get('confirmPassword')?.touched ||
                      activateForm.get('confirmPassword')?.dirty)
                  "
                  class="text-red-600 flex items-center"
                >
                  <i class="pi pi-exclamation-triangle mr-1"></i>
                  Passwords do not match
                </small>
              </div>

              

              <div class="pt-2">
                <p-button
                  type="submit"
                  label="Save"
                  icon="pi pi-sign-in"
                  styleClass="w-full"
                  size="large"
                  [disabled]="activateForm.invalid || isLoading"
                  [loading]="isLoading"
                  loadingIcon="pi pi-spinner pi-spin"
                >
                </p-button>
              </div>
            </form>
          </ng-template>
        </p-card>
      </div>
    </div>
  `,
  styles: [
    `
      :host ::ng-deep {
        .p-card {
          border-radius: 16px;
          overflow: hidden;
        }

        .p-card .p-card-header {
          padding: 0;
          border-radius: 16px 16px 0 0;
        }

        
        .p-password input:focus {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          border-color: rgb(59, 130, 246) !important;
        }

        .p-button {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          border: none;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .p-button:hover {
          background: linear-gradient(
            135deg,
            #2563eb 0%,
            #1d4ed8 100%
          ) !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3) !important;
        }

        .p-button:active {
          transform: translateY(0);
        }
      }
    `,
  ],
})
export class ActivateComponent implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  activateForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor() {
    this.activateForm = this.fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(
              '^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-={}\\[\\]:;"\'<>,.?/~`]).{6,}$'
            ),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: passwordsMatchValidator }
    );

    this.activateForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.errorMessage) {
          this.errorMessage = '';
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSave(): void {
    if (this.activateForm.invalid || this.isLoading) return;

    this.isLoading = true;
    this.errorMessage = '';

    const credentials: SetPasswordRequest = {
      token: this.extractToken() ,
      password: this.activateForm.get('password')?.value
    };

    this.authService
      .activate(credentials)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.isLoading = false))
      )
      .subscribe({
        next: () => {
          // Success - navigation handled in auth service
        },
        error: (error) => {
            console.log('Activation error:', error);
          this.errorMessage =
            error.message || 'Activation failed. Please try again.';
        },
      });
  }

  extractToken(): string {
     const currentUrl = this.router.url;
    const urlParams = new URLSearchParams(currentUrl.split('?')[1]);
    const token = urlParams.get('token');
   return token ?? '';
  }

}
