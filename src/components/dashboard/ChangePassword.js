import React, { useState, useContext } from 'react';
import { TextField, Button, Box, Typography, Alert, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff, LockReset as LockResetIcon } from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

function ChangePassword() {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    old_password: '',
    password: '',
    re_password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.re_password) {
      setError('Las nuevas contraseñas no coinciden.');
      return;
    }

    if (!formData.password || formData.password.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }

    try {
      if (!authTokens?.user_id) {
        setError('Error de autenticación. No se pudo encontrar el ID del usuario.');
        return;
      }

      // Creamos un objeto FormData para enviar los datos como multipart/form-data,
      // que es lo que el backend espera (igual que en el curl).
      const data = new FormData();
      data.append('old_password', formData.old_password);
      data.append('password', formData.password);
      data.append('re_password', formData.re_password);

      await api.patch(`/user/${authTokens.user_id}`, data);

      setSuccess('Contraseña actualizada con éxito. Será redirigido a la página de inicio de sesión.');
      
      // Esperamos 3 segundos para que el usuario lea el mensaje, luego cerramos sesión.
      setTimeout(() => {
        logoutUser();
        navigate('/login');
      }, 3000);

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Ocurrió un error. Verifique su contraseña actual.';
      setError(errorMessage);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <LockResetIcon sx={{ mr: 1, fontSize: '2rem' }} />
        <Typography variant="h4" component="h1">
          Cambiar Contraseña
        </Typography>
      </Box>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', justifyContent: 'center' }}
      >
        <Box sx={{ width: '100%', maxWidth: 400, mt: 2 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          
          <TextField
            label="Contraseña Actual"
            name="old_password"
            type={showOldPassword ? 'text' : 'password'}
            value={formData.old_password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            disabled={!!success}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                  >
                    {showOldPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Nueva Contraseña"
            name="password"
            type={showNewPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            disabled={!!success}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Repetir Nueva Contraseña"
            name="re_password"
            type={showRePassword ? 'text' : 'password'}
            value={formData.re_password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            disabled={!!success}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowRePassword(!showRePassword)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                  >
                    {showRePassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" variant="contained" sx={{ mt: 2 }} fullWidth disabled={!!success}>
            Guardar Contraseña
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default ChangePassword;