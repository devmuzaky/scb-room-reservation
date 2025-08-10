import { Component, computed, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@/auth/api/auth.service';
import { AuthStore } from '@/core/store/auth-store';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { alertPortal } from '@scb/ui/alert-dialog';
import { Button } from '@scb/ui/button';
import { Card } from '@scb/ui/card';
import { Icon } from '@scb/ui/icon';
import { StepperService } from './stepper.service';

@Component({
  selector: 'soft-token-list',
  imports: [Button, Card, Icon, TranslocoDirective, RouterLink],
  template: `
    @if (isActive()) {
      <section class="gap-2xl 2xl:px-3xl px-xl py-2xl 2xl:py-2xl flex flex-col">
        <div *transloco="let t; prefix: 'softToken'">
          <scb-card>
            <div class="gap-xl flex w-full flex-col items-start justify-between sm:flex-row sm:items-center">
              <div class="gap-lg flex w-full items-start sm:flex-1 sm:items-center">
                <icon
                  name="token-otp"
                  class="h-14 w-14" />

                <div class="gap-md flex flex-wrap items-center">
                  <span class="head-2xs-s text-text-primary"> {{ t('list.softTokenTitle') }}</span>
                  <div class="bg-success-tint rounded-full px-2 py-0.5">
                    <span class="body-label-sm-m text-text-success">{{ t('list.activated') }}</span>
                  </div>
                </div>
              </div>
              <div class="flex w-full justify-start sm:w-auto sm:justify-end">
                <button
                  scbButton
                  size="md"
                  type="button"
                  variant="secondary"
                  (click)="openDialog(t('reactivateAlert.title'), t('reactivateAlert.description'))"
                  class="w-full sm:w-auto">
                  {{ t('list.reactivateButton') }}
                </button>
              </div>
            </div>
          </scb-card>
        </div>
      </section>
    } @else if (isPending()) {
      <section class="gap-2xl 2xl:px-3xl px-xl py-2xl 2xl:py-2xl flex flex-col">
        <div *transloco="let t; prefix: 'softToken'">
          <scb-card>
            <div class="gap-xl flex w-full flex-col items-start justify-between sm:flex-row sm:items-center">
              <div class="gap-lg flex w-full items-start sm:flex-1 sm:items-center">
                <icon
                  name="token-otp"
                  class="h-14 w-14" />

                <div class="gap-md flex flex-wrap items-center">
                  <span class="head-2xs-s text-text-primary"> {{ t('list.softTokenTitle') }}</span>
                  <div class="bg-warning-tint rounded-full px-2 py-0.5">
                    <span class="body-label-sm-m text-text-warning">{{ t('list.pending') }}</span>
                  </div>
                </div>
              </div>
              <div class="flex w-full justify-start sm:w-auto sm:justify-end">
                <button
                  scbButton
                  size="md"
                  type="button"
                  variant="secondary"
                  (click)="openDialog(t('reactivateAlert.title'), t('reactivateAlert.description'))"
                  class="w-full sm:w-auto">
                  {{ t('list.reactivateButton') }}
                </button>
              </div>
            </div>
          </scb-card>
        </div>
      </section>
    } @else {
      <section
        class="gap-2xl 2xl:px-3xl px-xl py-2xl 2xl:py-2xl flex flex-col"
        *transloco="let t; prefix: 'softToken'">
        <scb-card>
          <div class="gap-2xl py-3xl flex flex-col items-center text-center">
            <div class="flex items-center justify-center">
              <icon
                name="token-otp"
                class="text-3xl" />
            </div>

            <div class="gap-sm flex flex-col items-center">
              <div class="text-text-primary head-xs-s">
                {{ t('howToActivate.title') }}
              </div>
              <div class="text-text-secondary body-md">
                {{ t('howToActivate.subtitle') }}
              </div>
            </div>

            <button
              scbButton
              size="lg"
              type="button"
              routerLink="/soft-token/add">
              {{ t('howToActivate.button') }}
            </button>
          </div>
        </scb-card>

        <scb-card class="gap-2xl flex flex-col">
          <div class="text-text-primary head-xs-s">{{ t('steps.howToActivate') }}</div>

          <div class="gap-2xl flex flex-col lg:flex-row">
            @for (item of stepperService.activationsStepsGuide(); track $index) {
              <div
                class="p-xl gap-2xl flex flex-1 flex-col items-center rounded-4xl border border-gray-100 dark:border-gray-800">
                <div class="bg-icon-container-blue h-6xl flex w-6xl items-center justify-center rounded-lg">
                  <div class="text-text-brand body-label-md-m">{{ $index + 1 }}</div>
                </div>
                <div class="gap-md flex flex-col text-center">
                  <div class="text-text-primary head-2xs-s">{{ t(item.title) }}</div>
                  <div class="text-text-secondary body-sm">{{ t(item.description) }}</div>
                </div>
              </div>
            }
          </div>
        </scb-card>
      </section>
    }
  `,
})
export class SoftTokenListComponent implements OnInit {
  readonly stepperService = inject(StepperService);
  readonly authStore = inject(AuthStore);
  readonly auth = inject(AuthService);
  readonly isActive = computed(() => this.authStore.user().softTokenStatus === 'ACTIVE');
  readonly isPending = computed(() => this.authStore.user().softTokenStatus === 'PENDING');
  readonly isInactive = computed(() => this.authStore.user().softTokenStatus === 'INACTIVE');
  private readonly alert = alertPortal();
  private transloco = inject(TranslocoService);
  readonly router = inject(Router);

  ngOnInit(): void {
    // Ensure user profile is updated when navigating to soft-token
    this.getSoftTokenStatus();
  }

  private getSoftTokenStatus() {
    this.auth.me().subscribe(user => {
      this.authStore.setProfileInfo(user);
    });
  }

  openDialog(title: string, description: string): void {
    this.alert.open({
      title,
      description,
      icon: 'Alert-Warning',
      actions: [
        {
          text: this.transloco.translate('softToken.reactivateAlert.confirm'),
          type: 'primary',
          handler: confirm => this.confirm(),
        },

        {
          text: this.transloco.translate('softToken.reactivateAlert.cancel'),
          type: 'secondary',
          handler: close => this.close(),
        },
      ],
    });
  }

  close() {
    this.alert.closeAll();
  }

  confirm() {
    this.router.navigate(['/soft-token/add']);
    this.close();
  }
}
