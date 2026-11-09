// src/pages/Auth/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Link, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import api from '../../api/axiosConfig';

// Ya no necesitas importar AuthLayout aquí
// import AuthLayout from '../../layouts/AuthLayout'; 

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    last_name: '',
    email: '',
    password: '',
    re_password: '',
    role_id: 2
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // Limpiar errores al cambiar input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación en el frontend
    let newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.last_name) newErrors.last_name = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.re_password) newErrors.re_password = 'Passwords do not match';
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) { // Si no hay errores de validación
      try {
        const response = await api.post('/user', formData);
        console.log(response.data); // Mostrar la respuesta del backend
        navigate('/login'); // Redirigir al inicio de sesión
      } catch (error) {
        console.error(error);
        // Mostrar mensajes de error al usuario
        if (error.response) {
          setErrors({ general: error.response.data.message });
        } else {
          setErrors({ general: 'An error occurred during registration.' });
        }
      }
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowRePassword = () => setShowRePassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    // La lógica de layout y centrado ahora está en AuthLayout,
    // por lo tanto, este componente solo devuelve el contenido central.
    // Se elimina el <AuthLayout> exterior
    // y el <Box sx={{ display: 'flex', ... }}>
    <Box sx={{ width: 400, p: 4, border: '1px solid #ccc', borderRadius: 1 }}>
      <Typography variant="h5" align="center" gutterBottom>Registro</Typography>
      {errors.general && <Typography color="error" align="center">{errors.general}</Typography>} {/* Mostrar error general */}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nombre"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Apellido"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          error={!!errors.last_name}
          helperText={errors.last_name}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Contraseña"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
          fullWidth
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Repetir Contraseña"
          name="re_password"
          type={showRePassword ? 'text' : 'password'}
          value={formData.re_password}
          onChange={handleChange}
          error={!!errors.re_password}
          helperText={errors.re_password}
          fullWidth
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowRePassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showRePassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button type="submit" variant="contained" fullWidth>Registrar</Button>
      </form>
      {/* Aquí agregamos el enlace para el login */}
      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        ¿Ya tienes una cuenta? {' '}
        <Link 
          component="button" 
          onClick={() => navigate('/login')} // La ruta debe coincidir con la de tu componente de login
          sx={{ cursor: 'pointer' }}
        >
          Inicia sesión aquí
        </Link>
      </Typography>
    </Box>
    // Se elimina el segundo <Box> que envuelve todo el componente
  );
}

export default Register;