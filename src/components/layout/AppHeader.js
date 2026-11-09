// src/components/layout/AppHeader.js
import React, { useContext, useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Tabs, Tab, IconButton, Menu, MenuItem, Avatar, Slider, Stack } from '@mui/material';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import logo from '../../assets/img/Logo3.png';


function AppHeader() {
  const { authTokens, logoutUser } = useContext(AuthContext); 
  const navigate = useNavigate();
  const location = useLocation();
  const { brightness, setBrightness } = useContext(ThemeContext);
  // Estado para manejar el menú desplegable
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // const handleLogout = () => {
  //   logout();
  //   navigate('/login');
  //   handleClose(); // Cierra el menú después de cerrar sesión
  // };

  const handleProfileClick = () => {
    navigate('/dashboard/profile');
    handleClose(); // Cierra el menú después de navegar
  };

  const handleChangePasswordClick = () => {
    navigate('/dashboard/change-password');
    handleClose(); // Cierra el menú después de navegar
  };

  const handleTabChange = (event, newValue) => {
    navigate(newValue);
  };

  // Esta función determina qué tab está activo basado en la URL actual
  const getCurrentTab = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard/config')) return '/dashboard/config';
    if (path.startsWith('/dashboard/addresses')) return '/dashboard/addresses';
    // Si no coincide con ninguna ruta de los tabs, no se selecciona ninguno
    return false;
  };

  const role = authTokens?.role;
  const userName = authTokens?.name; // Accedemos al nombre del contexto
  const userLastName = authTokens?.last_name; // Y al apellido
  const userImage = authTokens?.image;

  const getInitials = (name, lastName) => {
    let initials = '';
    if (name) initials += name[0];
    if (lastName) initials += lastName[0];
    return initials.toUpperCase();
  };

  const isDefaultImage = userImage === "default_user.png" || !userImage;

  // Define los menús según el rol
  const employeeMenu = (
    <Tabs value={getCurrentTab()} onChange={handleTabChange} aria-label="employee menu" textColor="inherit">
      <Tab component={RouterLink} to="/dashboard/addresses" value="/dashboard/addresses" label="Administrar Domicilios" sx={{ fontWeight: 'bold' }} />
      <Tab component={RouterLink} to="/dashboard/config" value="/dashboard/config" label="Configuración" sx={{ fontWeight: 'bold' }} />
    </Tabs>
  );

  const clientMenu = (
    <Tabs value={getCurrentTab()} onChange={handleTabChange} aria-label="client menu" textColor="inherit">
      <Tab component={RouterLink} to="/dashboard/addresses" value="/dashboard/addresses" label="Mis Domicilios" sx={{ fontWeight: 'bold' }} />
    </Tabs>
  );

  return (
    <AppBar
      position="static"
      elevation={1}
      sx={{
        // Corrección: Usamos el color del tema dinámico, igual que el Footer.
        backgroundColor: (theme) => theme.palette.background.paper,
        color: (theme) => theme.palette.text.primary,
      }}
    >
      <Toolbar>
        {/* Contenedor para el logo y el nombre de la app */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="CashNet Logo" style={{ height: 40, marginRight: 10 }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            CashNest
          </Typography>
        </Box>
        
        {/* Este Box contiene el menú, y crecerá para ocupar el espacio restante */}
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          {role === 'empleado' && employeeMenu}
          {role === 'cliente' && clientMenu}
        </Box>

        {/* Contenedor para los botones de la derecha */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Botón de perfil desplegable */}
          <IconButton onClick={handleMenu} color="inherit">
            <Avatar sx={{ bgcolor: 'secondary.main', color: 'primary.contrastText' }}>
              {/* Lógica condicional para mostrar la imagen base64 o las iniciales */}
              {!isDefaultImage ? (
                // Usamos el prefijo 'data:image/png;base64,' para que el navegador sepa que es una imagen codificada
                <img src={`data:image/png;base64,${userImage}`} alt="User Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                getInitials(userName, userLastName)
              )}
            </Avatar>
          </IconButton>

          {/* Menú desplegable */}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            sx={{ mt: 1 }}
            // Evita que el menú se cierre al interactuar con el slider
            slotProps={{ paper: { onClick: (e) => e.stopPropagation() } }}
          >
            <Box sx={{ width: 200, px: 2, pt: 1 }}>
              <Typography variant="caption">Luminosidad</Typography>
              <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                <Brightness4Icon />
                <Slider
                  aria-label="Luminosidad"
                  value={brightness}
                  onChange={(e, newValue) => setBrightness(newValue)}
                  min={0}
                  max={100}
                />
                <Brightness7Icon />
              </Stack>
            </Box>
            <MenuItem onClick={handleProfileClick}>Mi Perfil</MenuItem>
            <MenuItem onClick={handleChangePasswordClick}>Cambiar Contraseña</MenuItem>
            <MenuItem onClick={logoutUser}>Cerrar Sesión</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default AppHeader;