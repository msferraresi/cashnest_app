// src/layouts/AuthLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom'; // <--- Esto es clave
import Header from '../components/common/Header'; 
import Footer from '../components/common/Footer'; 
import { Box } from '@mui/material';

function AuthLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Outlet /> {/* <--- Y esto es lo que hace que funcione */}
      </Box>
      <Footer />
    </Box>
  );
}

export default AuthLayout;