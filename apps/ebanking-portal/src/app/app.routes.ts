import { Route } from '@angular/router';
import { createRoleGuard } from '@/core/guards/role.guard';
import { SecuredJwtAuthGuard } from './core/guards/auth.jwt.guard';
import { CanDeactivateLeaveGuard } from './core/guards/can-deactivate-leave.guard';
import { LoginGuard } from './core/guards/login.guard';
import { HomeContainer } from './layout/containers/home/Home.container';
import { NotFound4O4Component } from './layout/containers/not-found/NotFound4O4.container';

export const appRoutes: Route[] = [
  /**
   * All Pages that are used for non-authenticated users
   */
  {
    path: 'login',
    canActivate: [LoginGuard],
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'locate-us',
    canActivate: [LoginGuard],
    loadComponent: () => import('./auth/locate-us/locate-us.component'),
  },
  {
    path: 'forget-password',
    canActivate: [LoginGuard],
    loadComponent: () => import('./auth/forget-password/forget-password-container.component'),
  },
  {
    path: 'registration',
    canActivate: [LoginGuard],
    loadComponent: () => import('./auth/registration/registration.container.component'),
  },
  {
    path: 'activate-user',
    canActivate: [LoginGuard],
    loadComponent: () => import('./auth/activate-user/activate-user-container.component'),
  },
  /**
   * All Pages that are commonly using the same Header and Footer grouped under the Home Layout
   */
  {
    path: '',
    canActivate: [SecuredJwtAuthGuard],
    component: HomeContainer,
    children: [
      {
        path: 'dashboard',
        children: [
          {
            path: '',
            loadComponent: () => import('./home/dashboard/dashboard.page'),
            data: { breadcrumb: 'home', sideMenu: '/dashboard' },
            title: 'titles.dashboard',
          },
          {
            path: 'accounts',
            loadComponent: () => import('./home/accounts-list/accounts-list-container.ng'),
            data: { breadcrumb: 'accounts', sideMenu: '/dashboard' },
            title: 'titles.accountsOverview',
          },
          {
            path: 'accounts/:accountId',
            loadComponent: () => import('./home/account-details/account-details.ng'),
            data: { breadcrumb: 'account-details', sideMenu: '/dashboard' },
            title: 'titles.account-details',
          },
          {
            path: 'certificates',
            loadComponent: () => import('./home/certificates-list/certificates-list-container.ng'),
            data: { breadcrumb: 'certificates', sideMenu: '/dashboard' },
            title: 'titles.certificates',
          },
          {
            path: 'certificates/:certificateId',
            loadComponent: () => import('./home/certificates-details/certificates-detail-container.ng'),
            data: { breadcrumb: 'certificates', sideMenu: '/dashboard' },
            title: 'titles.certificate-details',
          },
          {
            path: 'deposits',
            loadComponent: () => import('./home/deposits-list/deposits-list-container.ng'),
            data: { breadcrumb: 'deposits', sideMenu: '/dashboard' },
            title: 'titles.deposits',
          },
          {
            path: 'deposits/:tdNumber',
            loadComponent: () =>
              import('./home/deposit-details/deposit-details.page').then(m => m.DepositDetailsPageComponent),
            data: { breadcrumb: 'deposits', sideMenu: '/dashboard' },
            title: 'titles.deposit-details',
          },
          {
            path: 'cheques-in',
            loadComponent: () => import('./home/cheques-in/cheques-in.ng'),
            data: { breadcrumb: 'cheques-in', sideMenu: '/dashboard' },
            title: 'titles.cheques-in',
          },
          {
            path: 'cheques-out',
            loadComponent: () => import('./home/cheques-out/cheques-out.ng'),
            data: { breadcrumb: 'cheques-out', sideMenu: '/dashboard' },
            title: 'titles.cheques-out',
          },
          {
            path: 'facilities',
            loadComponent: () => import('./home/facilities/facilities.ng'),
            data: { breadcrumb: 'facilities-overview', sideMenu: '/dashboard' },
            title: 'titles.facilities',
          },
          {
            path: 'overdraft-details/:overdraftId',
            loadComponent: () => import('./home/overdraft-detalis/overdraft-details.ng'),
            data: { breadcrumb: 'overdraftDetails', sideMenu: '/dashboard' },
            title: 'titles.overdraftDetails',
          },
          {
            path: 'loan-details/:loanId',
            loadComponent: () => import('./home/loan-details/loan-details.ng'),
            data: { breadcrumb: 'loanDetails' },
            title: 'titles.loanDetails',
          },
          {
            path: 'lcs-details/:lcNumber',
            loadComponent: () => import('./home/facilities/lcs/lcs-details.ng').then(m => m.LCsDetails),
            data: { breadcrumb: 'lcsDetails' },
            title: 'titles.lcsDetails',
          },
          {
            path: 'lgs-details/:lgNumber',
            loadComponent: () => import('./home/facilities/lgs/lgs-details.ng').then(m => m.LGsDetails),
            data: { breadcrumb: 'lgsDetails' },
            title: 'titles.lgsDetails',
          },
          {
            path: 'idc-details/:idcNumber',
            loadComponent: () => import('./home/facilities/idc/idc-details.ng').then(m => m.IDCDetails),
            data: { breadcrumb: 'lgsDetails' },
            title: 'titles.idcDetails',
          },
          {
            path: 'credit-card-details/:ccNumber',
            loadComponent: () => import('./home/facilities/credit-card/cc-details/cc-details-container.ng'),
            data: { breadcrumb: 'lcsDetails', sideMenu: '/dashboard' },
            title: 'titles.creditCardDetails',
          },
        ],
      },
      {
        path: 'accounts-and-deposits',
        loadChildren: () => import('./home/accounts-and-deposits/accounts-and-deposits.routes'),
      },
      {
        path: 'beneficiary',
        children: [
          {
            path: '',
            loadComponent: () => import('./home/beneficiary/list/beneficiary.ng'),
            data: { breadcrumb: 'beneficiary', sideMenu: '/beneficiary' },
            title: 'titles.beneficiary',
          },
          {
            path: 'add/:type',
            canActivate: [createRoleGuard(['MAKER', 'SUPER_USER'])],
            loadComponent: () => import('./home/beneficiary/add-form/add-form-container.ng'),
            data: { breadcrumb: 'beneficiary.add', sideMenu: '/beneficiary' },
            title: 'titles.beneficiary',
          },
        ],
      },
      {
        path: 'transfer',
        children: [
          {
            path: '',
            loadComponent: () => import('./home/transfer/trasnfer-type-list.ng'),
            data: { breadcrumb: 'transfer', sideMenu: '/transfer' },
            title: 'titles.transfer',
          },
          {
            path: 'transfer-history',
            loadComponent: () => import('./home/transactions-history/transactions-history.ng'),
            data: { breadcrumb: 'transfer', sideMenu: '/transfer' },
            title: 'titles.transfer',
          },
          {
            path: 'form/:type',
            canActivate: [createRoleGuard(['MAKER', 'SUPER_USER'])],
            canDeactivate: [CanDeactivateLeaveGuard],
            loadComponent: () => import('./home/transfer/transfer-form-container'),
            data: { breadcrumb: 'transfer', sideMenu: '/transfer' },
            title: 'titles.transfer',
          },
          {
            path: 'scheduled-transfers',
            loadComponent: () => import('./home/scheduled-transfer-list/scheduled-transfers-list.ng'),
            data: { breadcrumb: 'scheduled-transfer', sideMenu: '/transfer' },
            title: 'titles.scheduledTransfers',
          },
          {
            path: 'transfer-details/:transferid',
            loadComponent: () =>
              import('./home/transfer-details/transfer-details.component').then(m => m.TransferDetailsComponent),
            data: {
              breadcrumb: 'transferDetails',
              sideMenu: '/transfer',
            },
            title: 'titles.transferDetails',
          },
          {
            path: 'scheduled-transfers/:scheduledId',
            loadComponent: () =>
              import('./home/scheduled-transfer-list/scheduled-transfer-details/scheduled-transfer-details.ng'),
            data: { breadcrumb: 'scheduled-transfer', sideMenu: '/transfer' },
            title: 'titles.transfer',
          },
        ],
      },
      {
        path: 'soft-token',
        children: [
          {
            path: '',
            canActivate: [createRoleGuard(['MAKER', 'CHECKER', 'SUPER_USER'])],
            loadComponent: () => import('./home/soft-token/soft-token.list').then(m => m.SoftTokenListComponent),
            data: { breadcrumb: 'soft-token', sideMenu: '/soft-token' },
            title: 'titles.softToken',
          },
          {
            path: 'add',
            canActivate: [createRoleGuard(['MAKER', 'CHECKER', 'SUPER_USER'])],
            loadComponent: () => import('./home/soft-token/soft-token.form').then(m => m.SoftTokenFormComponent),
            canDeactivate: [CanDeactivateLeaveGuard],
            data: { breadcrumb: 'soft-token', sideMenu: '/soft-token' },
            title: 'titles.softToken',
          },
        ],
      },
      {
        path: 'products',
        canActivate: [createRoleGuard(['MAKER', 'SUPER_USER'])],
        children: [
          {
            path: '',
            loadComponent: () => import('./home/products/products.ng'),
            data: { breadcrumb: 'products', sideMenu: '/products' },
            title: 'titles.products',
          },
          {
            path: 'time-deposits',
            children: [
              {
                path: '',
                loadComponent: () => import('./home/products/products-cd/products-td.ng'),
                data: { breadcrumb: 'products', sideMenu: '/products' },
                title: 'titles.timeDeposits',
              },
              {
                path: 'td-form/:id',
                loadComponent: () => import('./home/products/td-form/td-form.ng'),
                data: { breadcrumb: 'products', sideMenu: '/products' },
                title: 'titles.timeDeposits',
              },
            ],
          },
          {
            path: 'certificate-of-deposits',
            children: [
              {
                path: '',
                loadComponent: () => import('./home/products/products-cd/products-cd.ng'),
                data: { breadcrumb: 'products', sideMenu: '/products' },
                title: 'titles.certificateOfDeposits',
              },
              {
                path: 'cd-form/:id',
                loadComponent: () => import('./home/products/cd-form/cd-form.ng'),
                data: { breadcrumb: 'products', sideMenu: '/products' },
                title: 'titles.certificateOfDeposits',
              },
            ],
          },
          {
            path: 'accounts',
            children: [
              {
                path: '',
                loadComponent: () => import('./home/products/products-cd/products-accounts.ng'),
                data: { breadcrumb: 'products', sideMenu: '/products' },
                title: 'titles.accounts',
              },
              {
                path: 'current-account/:id',
                loadComponent: () => import('./home/products/sub-accounts/current-account.ng'),
                data: { breadcrumb: 'products', sideMenu: '/products' },
                title: 'titles.currentAccount',
              },
            ],
          },
        ],
      },
      {
        path: 'chequebook',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./home/cheque-book/chequebook-list/chequebook-list.ng').then(m => m.ChequeBookListComponent),
            data: {
              breadcrumb: 'transferDetails',
              sideMenu: '/chequebook',
            },
            title: 'titles.chequeBook',
          },
          {
            path: 'chequebook-detail/:id',
            loadComponent: () =>
              import('./home/cheque-book/chequebook-detail/chequebook-detail.ng').then(m => m.ChequeBookDetail),
            data: { breadcrumb: 'scheduled-transfer', sideMenu: '/chequebook' },
            title: 'titles.chequeBook',
          },
          {
            path: 'new-chequebook',
            canActivate: [createRoleGuard(['MAKER', 'SUPER_USER'])],
            loadComponent: () =>
              import('./home/cheque-book/request-chequebook/request-new-chequebook.ng').then(m => m.RequestChequeBook),
            data: { breadcrumb: 'requestNewChecquebook', sideMenu: '/chequebook' },
            title: 'titles.chequeBook',
          },
        ],
      },
      {
        path: 'pending-approvals',
        loadChildren: () => import('./home/pending-approvals/pending-approvals.routes'),
      },
      //  {
      //   path: 'pending-approvals',
      //   loadComponent: () => import('./home/pending-approvals/pending-approvals.ng'),
      //   title: 'titles.pendingApprovals',
      //   data: { breadcrumb: 'pending-approvals', sideMenu: '/pending-approvals' },
      // },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: 'not-found-404', component: NotFound4O4Component },
  { path: '**', redirectTo: 'not-found-404' },
];
