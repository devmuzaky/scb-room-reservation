import { Routes } from '@angular/router';

const PENDING_APPROVALS: Routes = [
  // {
  //   path: 'pending',
  //   loadComponent: () => import('../pending-approvals/pending/pending-list-container.ng'),
  //   data: { hideBreadcrumb: false, sideMenu: '/delegation-matrix' },
  //   title: 'titles.pending',
  // },
  // {
  //   path: 'approved',
  //   loadComponent: () => import('../pending-approvals/approved/approved-list-container.ng'),
  //   data: { sideMenu: '/delegation-matrix' },
  //   title: 'titles.approved',
  // },
  // {
  //   path: 'rejected',
  //   loadComponent: () => import('../pending-approvals/rejected/rejected-list-container.ng'),
  //   data: { sideMenu: '/delegation-matrix' },
  //   title: 'titles.rejected',
  // },
  // {
  //   path: 'waiting',
  //   loadComponent: () => import('../pending-approvals/waiting/waiting-list-container.ng'),
  //   data: { breadcrumb: 'deposits', hideBreadcrumb: true, sideMenu: '/delegation-matrix' },
  //   title: 'titles.waiting',
  // },
  {
    path: ':id',
    loadComponent: () => import('../pending-approvals/pending-approvals.ng'),
    data: { sideMenu: '/pending-approvals' },

    title: 'titles.pendingApprovals',
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'all',
  },
];

export default PENDING_APPROVALS;
