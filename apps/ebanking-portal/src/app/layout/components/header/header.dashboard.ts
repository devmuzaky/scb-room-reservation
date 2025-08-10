import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter, firstValueFrom, merge } from 'rxjs';
import { AuthService } from '@/auth/api/auth.service';
import { AuthStore } from '@/core/store/auth-store';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Button, IconButton } from '@scb/ui/button';
import { Icon } from '@scb/ui/icon';
import { Separator } from '@scb/ui/separator';
import { TooltipModule } from 'primeng/tooltip';
import { LangButton } from '../lang-btn/lang-button';
import { ThemeButton } from '../theme-btn/theme-button';
import { HeaderSearch } from './header-search.ng';

@Component({
  selector: 'header-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Button,
    IconButton,
    Separator,
    Icon,
    ThemeButton,
    LangButton,
    HeaderSearch,
    TranslocoDirective,
    TooltipModule,
  ],
  template: `<header
      class="2xl:h-8xl bg-foreground p-xl 2xl:px-3xl gap-sm sm:gap-xl border-border-tertiary relative !m-0 flex items-center 2xl:border-b"
      *transloco="let t">
      <button
        scbButton
        icon="arrow-left"
        size="xs"
        variant="ghost"
        data-testid="DASH_BTN_TOGGLE_MENU"
        class="border-border-secondary bg-container !text-icon-secondary z-p absolute !hidden h-[28px] w-[28px] rounded-lg border !p-[6px] duration-500 2xl:!inline-flex ltr:transition-[left] rtl:transition-[right]"
        [class]="
          layoutFacade.show() ? 'ltr:-left-[44px] rtl:-right-[44px]' : 'flip-x ltr:-left-[14px] rtl:-right-[14px]'
        "
        (click)="layoutFacade.toggle()"></button>
      <h4 class="mf-2xl hidden flex-1 font-semibold whitespace-nowrap 2xl:block">{{ pageTitle() }}</h4>
      <button
        scbIconButton="menu"
        (click)="layoutFacade.toggle()"
        data-testid="DASH_BTN_HAMBURGER_MENU"
        class="2xl:hidden"></button>
      <div class="flex-1"></div>
      <!-- <app-header-search class="hidden 2xl:block 2xl:w-[325px]" /> -->

      <div class="flex">
        <scb-separator class="bg-border-tertiary mr-xl !my-0 hidden w-[1px] 2xl:block" />
        <div class="gap-md flex">
          <app-lang-button size="md" />
          <button
            [scbIconButton]="layoutFacade.showBalances() ? 'eye' : 'eye-slash'"
            color="primary"
            [showDelay]="200"
            [autoHide]="true"
            [pTooltip]="
              layoutFacade.showBalances() ? t('dashboardLayout.hideBalances') : t('dashboardLayout.showBalances')
            "
            tooltipPosition="bottom"
            (click)="layoutFacade.toggleBalances()"
            data-testid="DASH_BTN_TOGGLE_MASKING"></button>
          <app-theme-button />
          <button
            class="hidden"
            scbIconButton="notification"
            color="primary"
            data-testid="DASH_BTN_NOTIFICATION"></button>
        </div>
        <scb-separator class="bg-border-tertiary ml-xl !my-0 hidden w-[1px] sm:block" />
        <button
          class="gap-md focus:bg-overlay hover:bg-overlay p-sm aria-[expanded=true]:bg-overlay ltr:pr-md ltr:ml-xl rtl:pl-md rtl:mr-xl flex items-center rounded-full"
          data-testid="DASH_BTN_USER_DETAILS">
          <!-- <scb-avatar size="32" /> -->
          <icon
            name="building-pic"
            class="w-4xl" />
          <div class="body-label-sm hidden text-left sm:block rtl:text-right">
            <h4 class="text-text-secondary">{{ authStore.user().companyName }}</h4>
            <p class="text-text-tertiary">{{ authStore.user().cif }}</p>
          </div>
          <!--          <icon-->
          <!--            name="arrow-down"-->
          <!--            class="w-xl" />-->
        </button>
        <button
          [pTooltip]="t('dashboardLayout.logout')"
          tooltipPosition="bottom"
          class="focus:bg-overlay hover:bg-overlay p-sm aria-[expanded=true]:bg-overlay ltr:ml-xl rtl:mr-xl flex items-center rounded-full"
          [loading]="loading()"
          color="primary"
          scbButton
          variant="ghost"
          data-testid="DASH_BTN_LOGOUT"
          (click)="logout()">
          <icon
            name="logout"
            class="w-3xl" />
        </button>
      </div>
    </header>

    <app-header-search
      class="bg-foreground p-xl 2xl:px-3xl border-border-tertiary sticky -top-[60px] hidden border-b pt-0 2xl:hidden" /> `,
})
export class HeaderDashboard {
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly translocoService = inject(TranslocoService);
  readonly router = inject(Router);
  readonly title = inject(Title);
  readonly pageTitle = signal<string>('');
  readonly authStore = inject(AuthStore);
  readonly authService = inject(AuthService);
  readonly loading = signal(false);

  constructor() {
    const ch = this.router.events.pipe(filter(event => event instanceof NavigationEnd));
    merge(this.translocoService.langChanges$, ch)
      .pipe(takeUntilDestroyed())
      .subscribe(async () => {
        let route = this.router.routerState.root;
        while (route.firstChild) {
          route = route.firstChild;
        }
        const routeTitle = route.snapshot?.routeConfig?.title;

        if (routeTitle && typeof routeTitle === 'string') {
          await firstValueFrom(this.translocoService.load(this.translocoService.getActiveLang()));
          const translatedTitle = this.translocoService.translate(routeTitle);
          this.title.setTitle(translatedTitle);
          this.pageTitle.set(translatedTitle);
        }
      });
  }

  logout() {
    this.loading.set(true);
    this.authService.logout().subscribe({
      next: () => {
        this.loading.set(false);
      },
    });
  }
}
