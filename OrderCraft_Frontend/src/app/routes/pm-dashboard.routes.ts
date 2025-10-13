import { Routes } from '@angular/router';
import { PmDashboardLayoutComponent } from '../pages/pm-dashboard/pm-dashboard-layout/pm-dashboard-layout.component';
import { ProductionTrackingComponent } from '../pages/pm-dashboard/production-tracking/production-tracking.component';

export const pmDashboardRoutes: Routes = [
  {
    path: '',
    component: PmDashboardLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../pages/pm-dashboard/view-production-timeline/view-production-timeline.component').then(
            m => m.ViewProductionTimelineComponent
          ),
      },
      {
        path: 'user-profile',
        loadComponent: () =>
          import('../pages/user-profile/user-profile.component').then(
            m => m.UserProfileComponent
          ),
      },
      {
        path: 'pm-reports',
        loadComponent: () =>
          import('../pages/pm-dashboard/pm-reports/pm-reports.component').then(
            m => m.ProductionReportsComponent
          ),
      },
      // { path: 'production-tracking/:id', component: ProductionTrackingComponent },
      {path: 'production-tracking',component: ProductionTrackingComponent},
      {path: 'production-tracking/:id',component: ProductionTrackingComponent},

      
      {
        path: 'production-task',
        loadComponent: () =>
          import('../pages/pm-dashboard/production-task/production-task.component').then(
            m => m.ProductionTaskComponent
          ),
      },
      {
        path: 'view-requests',
        loadComponent: () =>
          import('../pages/pm-dashboard/view-requests/view-requests.component').then(
            m => m.ViewRequestsComponent
          ),
      },
      {
        path: 'edit-profile',
        loadComponent: () =>
          import('../pages/edit-user-profile/edit-user-profile.component').then(
            m => m.EditUserProfileComponent
          ),
      }
    ],
  },
];
