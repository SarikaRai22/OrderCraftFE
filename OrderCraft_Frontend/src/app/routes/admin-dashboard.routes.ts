import { Routes } from '@angular/router';
import { AdminDashboardLayoutComponent } from '../pages/admin-dashboard/admin-dashboard-layout/admin-dashboard-layout.component';
import { AdminDashboardComponent } from '../pages/admin-dashboard/admin-dashboard.component';
import { ViewAllUsersComponent } from '../pages/admin-dashboard/view-all-users/view-all-users.component';

export const adminDashboardRoutes: Routes = [
  {
    path: '',
    component: AdminDashboardLayoutComponent,
    children: [
      { path: '', component: ViewAllUsersComponent },
      {
        path: 'register-user',
        loadComponent: () =>
          import('../pages/admin-dashboard/register-user/register-user.component').then(m => m.RegisterUserComponent)
      },
      {
        path: 'view-all-users',
        loadComponent: () =>
          import('../pages/admin-dashboard/view-all-users/view-all-users.component').then(m => m.ViewAllUsersComponent)
      },
      {
        path: 'user-profile/:mode',
        loadComponent: () =>
          import('../pages/user-profile/user-profile.component').then(m => m.UserProfileComponent)
      },
      {
        path: 'edit-profile',
        loadComponent: () => import('../pages/edit-user-profile/edit-user-profile.component').then(m => m.EditUserProfileComponent)
      },
      { path: '**', redirectTo: '' }
    ]
  }
];
