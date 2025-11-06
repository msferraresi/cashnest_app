import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import logo from '../../assets/img/Logo3.png';

function Header() {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        {/* Usamos un Box para contener el logo y el texto */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <img src={logo} alt="CashNest Logo" style={{ height: 40, marginRight: 10 }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            CashNest
          </Typography>
        </Box>
        {/* Aquí puedes añadir otros elementos de navegación si lo deseas */}
      </Toolbar>
    </AppBar>
  );
}

export default Header;