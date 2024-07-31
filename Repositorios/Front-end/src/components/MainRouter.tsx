import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { Home } from '../pages/home/HomePage';
import { NotFoundPage } from '../pages/not-found/NotFoundPage';
import { HelpPage } from '../pages/help/HelpPage';
import { LoginPage } from '../pages/login/LoginPage';
import { AdminHome } from '../pages/admin/AdminHomePage';
import { ResetPasswordPage } from '../pages/reset-password/ResetPassword';
import { EventsPage } from '../pages/landing/events/EventPage';
import { ProductsPage } from '../pages/landing/inventory/products/ProductsPage';
import { TransactionPage } from '../pages/landing/finantial/transaction/TransactionPage';
import { AccountPage } from '../pages/landing/finantial/accounts/AccountPage';
import { InventoryPage } from '../pages/landing/inventory/InventoryPage';
import { SuppliersPage } from '../pages/landing/suppliers/SuppliersPage';
import { SubscribersPage } from '../pages/landing/subscriptions/subscribers/SusbcribersPage';
import { SubscriptionPlansPage } from '../pages/landing/subscriptions/subscription-plans/SusbcriptionPlansPage';
import { BudgetRequestPage } from '../pages/landing/events/budget-request/BudgetRequestPage';
import {
  ADMIN,
  DIRECTOR_FINANCIERO,
  PRESIDENTE,
  SECRETARIO,
  VICEPRESIDENTE_DE_CULTURA,
  VICEPRESIDENTE_FINANCIERO,
  VICEPRESIDENTE_GENERAL,
} from '../utils/roles-constants';

import { Layout } from './Layout';
import ProtectedRoute from './ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
    errorElement: (
      <Layout>
        <NotFoundPage />
      </Layout>
    ),
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute
        adminPage={true}
        unauthorizedRoles={[
          PRESIDENTE,
          VICEPRESIDENTE_DE_CULTURA,
          VICEPRESIDENTE_FINANCIERO,
          DIRECTOR_FINANCIERO,
          VICEPRESIDENTE_GENERAL,
          SECRETARIO,
        ]}
      >
        <Layout>
          <AdminHome />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/inicio-sesion',
    element: (
      <Layout>
        <LoginPage />
      </Layout>
    ),
  },
  {
    path: '/cambiar-clave',
    element: (
      <Layout>
        <ResetPasswordPage />
      </Layout>
    ),
  },
  {
    path: '/ayuda',
    element: (
      <Layout>
        <HelpPage />
      </Layout>
    ),
  },
  {
    path: '/eventos',
    element: (
      <ProtectedRoute unauthorizedRoles={[ADMIN]}>
        <Layout>
          <EventsPage />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/eventos/solicitud-presupuesto',
    element: (
      <ProtectedRoute unauthorizedRoles={[ADMIN]}>
        <Layout>
          <BudgetRequestPage />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/proveedores',
    element: (
      <ProtectedRoute unauthorizedRoles={[ADMIN]}>
        <Layout>
          <SuppliersPage />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/finanzas/transacciones',
    element: (
      <ProtectedRoute unauthorizedRoles={[ADMIN]}>
        <Layout>
          <TransactionPage />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/finanzas/cuentas-contables',
    element: (
      <ProtectedRoute unauthorizedRoles={[ADMIN]}>
        <Layout>
          <AccountPage />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/inventario/movimientos',
    element: (
      <ProtectedRoute unauthorizedRoles={[ADMIN]}>
        <Layout>
          <InventoryPage />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/inventario/productos',
    element: (
      <ProtectedRoute unauthorizedRoles={[ADMIN]}>
        <Layout>
          <ProductsPage />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/aportaciones/aportantes',
    element: (
      <ProtectedRoute unauthorizedRoles={[ADMIN]}>
        <Layout>
          <SubscribersPage />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/aportaciones/planes-aportacion',
    element: (
      <ProtectedRoute unauthorizedRoles={[ADMIN]}>
        <Layout>
          <SubscriptionPlansPage />
        </Layout>
      </ProtectedRoute>
    ),
  },
]);

export const MainRouter = () => {
  return <RouterProvider router={router} />;
};
