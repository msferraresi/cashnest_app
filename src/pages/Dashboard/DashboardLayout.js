import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import AppHeader from '../../components/layout/AppHeader'; // Ruta corregida al Header principal
import Footer from '../../components/common/Footer'; // Ruta corregida al Footer
import { AuthContext } from '../../context/AuthContext';
import SessionTimeoutModal from '../../components/SessionTimeoutModal';

function DashboardLayout() {
  // Obtenemos los estados y funciones del modal desde el AuthContext
  const {
    isWarningModalOpen,
    countdown,
    isRefreshing,
    refreshToken,
    logoutUser,
  } = useContext(AuthContext);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      <AppHeader />
      <Box
        component="main"
        sx={{
          flexGrow: 1, // Permite que esta caja crezca y ocupe el espacio disponible
          p: 3, // Mantenemos el padding para el contenido
          overflowY: 'auto', // Agrega scroll VERTICAL solo a esta área
        }}
      >
        {/* Aquí se renderizará el componente de la ruta actual (Profile, AddressList, etc.) */}
        <Outlet />
      </Box>
      {/* Renderizamos el modal aquí, dentro del alcance del ThemeProvider */}
      <SessionTimeoutModal
        open={isWarningModalOpen}
        countdown={countdown}
        onStay={refreshToken}
        onLogout={logoutUser}
        isRefreshing={isRefreshing}
      />
      <Footer />
    </Box>
  );
}

export default DashboardLayout;