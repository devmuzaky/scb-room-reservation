import { adminGuard, authGuard, staffGuard } from '@/core/guards/auth.guard';
import { Route } from '@angular/router';
import { ManagePeopleComponent } from '@/admin/manage-people/people.component';
import { ManageRoomsComponent } from '@/admin/manage-rooms/rooms.component';
import { ManageRequestsComponent } from '@/admin/manage-requests/requests.component';

export const appRoutes: Route[] = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },

  {
    path: 'auth/set-password',
    loadComponent: () =>
      import('@/auth/pages/activate/activate.component').then(
        (m) => m.ActivateComponent
      ),
  },

  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('@/features/auth/pages/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },
    ],
  },

  {
    path: 'admin',
    canActivate: [authGuard],
    children: [
      {
        path: 'manage-people',
        component: ManagePeopleComponent,
        canActivate: [adminGuard],
      },
      {
        path: 'manage-rooms',
        component: ManageRoomsComponent,
        canActivate: [adminGuard],
      },
      {
        path: 'manage-requests',
        component: ManageRequestsComponent,
        canActivate: [adminGuard],
      },
    ],
  },

  // {
  //   path: 'dashboard',
  //   canActivate: [authGuard],
  //   children: [
  //     {
  //       path: 'calendar',
  //       component: CalendarComponent,
  //       canActivate: [staffGuard],
  //     },
  //     {
  //       path: 'my-bookings',
  //       component: MyBookingsComponent,
  //       canActivate: [staffGuard],
  //     },
  //   ],
  // },

  {
    path: '**',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@/shared/components/not-found.components').then(
        (m) => m.NotFoundComponent
      ),
  },
];
