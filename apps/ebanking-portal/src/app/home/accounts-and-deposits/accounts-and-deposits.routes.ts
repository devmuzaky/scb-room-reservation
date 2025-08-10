import { Routes } from '@angular/router';

const ACCOUNTS_AND_DEPOSITS: Routes = [
  {
    path: 'accounts/:accountId',
    loadComponent: () => import('../account-details/account-details.ng'),
    data: { breadcrumb: 'account-details', hideBreadcrumb: true, sideMenu: '/accounts-and-deposits' },
    title: 'titles.account-details',
  },
  {
    path: 'certificates/:certificateId',
    loadComponent: () => import('../certificates-details/certificates-detail-container.ng'),
    data: { breadcrumb: 'certificates', hideBreadcrumb: true, sideMenu: '/accounts-and-deposits' },
    title: 'titles.certificate-details',
  },
  {
    path: 'deposits/:tdNumber',
    loadComponent: () => import('../deposit-details/deposit-details.page').then(m => m.DepositDetailsPageComponent),
    data: { breadcrumb: 'deposits', hideBreadcrumb: true, sideMenu: '/accounts-and-deposits' },
    title: 'titles.deposit-details',
  },
  {
    path: ':id',
    loadComponent: () => import('../accounts-and-deposits/accounts-and-deposits.ng'),
    data: { breadcrumb: 'accounts-and-deposits', sideMenu: '/accounts-and-deposits' },
    title: 'titles.accountsAndDeposits',
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'all',
  },
];

export default ACCOUNTS_AND_DEPOSITS;
