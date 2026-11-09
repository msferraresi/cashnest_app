import React, { useContext } from 'react';
import { Box, Typography, Container, Link } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';

function Footer() {
  const { authTokens } = useContext(AuthContext);

  return (
    <Box
      component="footer"
      sx={{
        py: 1.5,
        px: 2,
        // Estilos condicionales basados en el estado de autenticación
        ...(authTokens
          ? {
              // Estilos para cuando el usuario está logueado (tema dinámico)
              backgroundColor: (theme) => theme.palette.background.paper,
              borderTop: (theme) => `1px solid ${theme.palette.divider}`,
            }
          : {
              // Estilos para cuando está deslogueado (tema estático, como el Header)
              backgroundColor: (theme) => theme.palette.primary.main,
              color: (theme) => theme.palette.primary.contrastText,
            }),
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="body2" color={authTokens ? 'text.secondary' : 'inherit'} align="center">
          {'Copyright © '}
          <Link color="inherit" href="https://cashnest.app/">
            CashNest
          </Link>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;