import { Routes } from '@angular/router';
import { ImDashboardLayoutComponent } from '../pages/im-dashboard/im-dashboard-layout/im-dashboard-layout.component';

export const imDashboardRoutes: Routes = [
  {
    path: '',
    component: ImDashboardLayoutComponent,
    children: [
      // Set TrackingStockLevelComponent as the default route
      {
        path: '',
        loadComponent: () =>
          import('../pages/im-dashboard/tracking-stock-level/tracking-stock-level.component').then(
            m => m.TrackingStockLevelComponent
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
        path: 'edit-profile',
        loadComponent: () =>
          import('../pages/edit-user-profile/edit-user-profile.component').then(
            m => m.EditUserProfileComponent
          ),
      },
      {
        path: 'view-im-orders',
        loadComponent: () =>
          import('../pages/im-dashboard/view-im-orders/view-im-orders.component').then(
            m => m.ViewImOrdersComponent
          ),
      },
      {
        path: 'im-reports',
        loadComponent: () =>
          import('../pages/im-dashboard/im-reports/im-reports.component').then(
            m => m.ImReportsComponent
          ),
      },
      {
        path: 'product-categorization',
        loadComponent: () =>
          import('../pages/im-dashboard/product-categorization/product-categorization.component').then(
            m => m.ProductCategorizationComponent
          ),
      },
    ],
  },
];
