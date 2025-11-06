import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function PrivateRoute({ children }) {
  const { authTokens } = useContext(AuthContext);

  if (!authTokens) {
    // Si no hay token, redirige al usuario a la página de inicio de sesión
    return <Navigate to="/login" />;
  }

  // Si hay token, permite el acceso a la ruta
  return children ? children : <Outlet />;
}

export default PrivateRoute;