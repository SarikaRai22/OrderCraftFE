import { Routes } from '@angular/router';
import { PoDashboardLayoutComponent } from '../pages/po-dashboard/po-dashboard-layout/po-dashboard-layout.component';
import { PoDashboardComponent } from '../pages/po-dashboard/po-dashboard.component';
import { CreateOrderComponent } from '../pages/po-dashboard/create-order/create-order.component';
import { ProductOrderComponent } from '../pages/po-dashboard/create-order/product-order/product-order.component';
import { RawMaterialOrderComponent } from '../pages/po-dashboard/create-order/raw-material-order/raw-material-order.component';
import { ViewOrdersComponent } from '../pages/po-dashboard/view-orders/view-orders.component';
import { OrderTrackingComponent } from '../pages/po-dashboard/order-tracking/order-tracking.component';

export const poDashboardRoutes: Routes = [
  {
    path: '',
    component: PoDashboardLayoutComponent,
    children: [
      { path: '', component: ViewOrdersComponent },
      {
        path: 'create-order',
        component: CreateOrderComponent,
        children: [
          { path: '', redirectTo: 'product-order', pathMatch: 'full' }, // default to product
          { path: 'product-order', component: ProductOrderComponent },
          { path: 'raw-material-order', component: RawMaterialOrderComponent },
        ]
      },
       { path: 'view-orders', component: ViewOrdersComponent },
       {
        path: 'user-profile',
        loadComponent: () =>
          import('../pages/user-profile/user-profile.component').then(m => m.UserProfileComponent)
      },
      {
        path: 'edit-profile',
        loadComponent: () =>
          import('../pages/edit-user-profile/edit-user-profile.component').then(m => m.EditUserProfileComponent)
      },
       {
        path: 'return-order',
        loadComponent: () =>
          import('../pages/po-dashboard/return-order/return-order.component').then(
            m => m.ReturnOrderComponent
          ),
        },
      { path: 'order-tracking/:id', component: OrderTrackingComponent },
{ path: 'order-tracking', component: OrderTrackingComponent }



    ]
  }
];
