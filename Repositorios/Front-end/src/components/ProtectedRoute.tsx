import { Navigate } from 'react-router-dom';
import { Center, Spinner } from '@chakra-ui/react';
import React from 'react';

import { useAuth } from '../contexts/auth-context';
import { ADMIN } from '../utils/roles-constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  unauthorizedRedirectTo?: string;
  unauthorizedRoles?: string[];
  adminPage?: boolean; // Añadido para manejar páginas específicas de administración
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = '/home',
  unauthorizedRedirectTo = '/',
  unauthorizedRoles,
  adminPage = false, // Por defecto no es una página de administración
}) => {
  const { user, loadingContext } = useAuth();

  if (loadingContext) {
    return (
      <Center sx={{ width: '100vw', height: '100vh' }}>
        <Spinner size="xl" sx={{ color: 'brand.blue' }} />
      </Center>
    );
  }

  if (!user) {
    // Usuario no autenticado
    return <Navigate to="/inicio-sesion" />;
  }

  if (adminPage && user.role !== ADMIN) {
    // Si es una página de administración y el usuario no es administrador
    return <Navigate to={unauthorizedRedirectTo} />;
  }

  if (unauthorizedRoles && user.role && unauthorizedRoles.includes(user.role)) {
    // Usuario no autorizado basado en roles no permitidos
    return <Navigate to={unauthorizedRedirectTo} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
