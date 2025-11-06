import React from 'react';
import { Modal, Box, Typography, Button, CircularProgress } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  textAlign: 'center',
};

const SessionTimeoutModal = ({ open, countdown, onStay, onLogout, isRefreshing }) => {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <Modal
      open={open}
      aria-labelledby="session-timeout-title"
      aria-describedby="session-timeout-description"
    >
      <Box sx={style}>
        <Typography id="session-timeout-title" variant="h6" component="h2">
          Tu sesión está a punto de expirar
        </Typography>
        <Typography id="session-timeout-description" sx={{ mt: 2, mb: 3 }}>
          {isRefreshing ? (
            'Renovando sesión...'
          ) : (
            `Tu sesión se cerrará en ${formatTime(countdown)}.`
          )}
        </Typography>
        
        {isRefreshing ? (
          <CircularProgress />
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
            <Button variant="contained" color="primary" onClick={onStay}>
              Seguir Conectado
            </Button>
            <Button variant="outlined" color="secondary" onClick={onLogout}>
              Cerrar Sesión
            </Button>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default SessionTimeoutModal;
