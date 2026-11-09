import React from 'react';
import AppHeader from '../components/layout/AppHeader'; // El nuevo header
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom'; // Importa Outlet

function AppLayout() {
  return (
    <Box>
      <AppHeader />
      <Box sx={{ p: 3 }}>
        <Outlet /> {/* Aquí se renderizará el contenido de las rutas anidadas (el Dashboard) */}
      </Box>
    </Box>
  );
}

export default AppLayout;