import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { AuthGuard } from './services/auth.guard';
import { PmDashboardComponent } from './pages/pm-dashboard/pm-dashboard.component';
import { ImDashboardComponent } from './pages/im-dashboard/im-dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Public routes
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ForgotPasswordComponent },

  // Lazy-loaded Admin Dashboard section (with layout + children)
  {
    path: 'admin-dashboard',
    canActivate: [AuthGuard],
    loadChildren: () =>
    import ('./routes/admin-dashboard.routes').then(m => m.adminDashboardRoutes)
  },

  // Lazy-loaded PO Dashboard section
  {
    path: 'po-dashboard',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./routes/po-dashboard.routes').then(m => m.poDashboardRoutes)
  },

  // Direct components (PM and IM dashboards not modularized yet)
  {
    path: 'pm-dashboard',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./routes/pm-dashboard.routes').then(m => m.pmDashboardRoutes)
  },
  {
    path: 'im-dashboard',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./routes/im-dashboard.routes').then(m => m.imDashboardRoutes)
  },

  

  // Fallback
  { path: '**', redirectTo: 'login' }
];
