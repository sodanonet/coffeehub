import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth';

export const routes: Routes = [
  // Customer Routes (Public)
  {
    path: '',
    loadComponent: () =>
      import('./features/customer/customer-home').then((m) => m.CustomerHome),
  },
  {
    path: 'order/menu',
    loadComponent: () =>
      import('./features/customer/order-menu').then((m) => m.OrderMenu),
  },
  {
    path: 'order/checkout',
    loadComponent: () =>
      import('./features/customer/order-checkout').then((m) => m.OrderCheckout),
  },
  {
    path: 'order/confirmation',
    loadComponent: () =>
      import('./features/customer/order-confirmation').then(
        (m) => m.OrderConfirmation,
      ),
  },

  // Admin Routes (Protected)
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/admin/admin-layout').then((m) => m.AdminLayout),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'stores',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/stores/stores-list/stores-list').then(
                (m) => m.StoresList,
              ),
          },
          {
            path: 'create',
            loadComponent: () =>
              import('./features/stores/store-form/store-form').then(
                (m) => m.StoreForm,
              ),
          },
          {
            path: ':id/edit',
            loadComponent: () =>
              import('./features/stores/store-form/store-form').then(
                (m) => m.StoreForm,
              ),
          },
        ],
      },
      {
        path: 'menu',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/menu/menu-list/menu-list').then(
                (m) => m.MenuList,
              ),
          },
          {
            path: 'create',
            loadComponent: () =>
              import('./features/menu/menu-form/menu-form').then(
                (m) => m.MenuForm,
              ),
          },
          {
            path: ':id/edit',
            loadComponent: () =>
              import('./features/menu/menu-form/menu-form').then(
                (m) => m.MenuForm,
              ),
          },
        ],
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./features/orders/orders-list/orders-list').then(
            (m) => m.OrdersList,
          ),
      },
    ],
  },

  // Auth
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login').then((m) => m.Login),
  },

  // Legacy redirects
  {
    path: 'dashboard',
    redirectTo: 'admin/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'stores',
    redirectTo: 'admin/stores',
    pathMatch: 'full',
  },
  {
    path: 'menu',
    redirectTo: 'admin/menu',
    pathMatch: 'full',
  },
  {
    path: 'orders',
    redirectTo: 'admin/orders',
    pathMatch: 'full',
  },

  // 404 - redirect to home
  {
    path: '**',
    redirectTo: '',
  },
];
