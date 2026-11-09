// src/pages/Auth/Login.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Link, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext'; 

function Login() {
  // 1. Volvemos a añadir los estados para controlar los inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { loginUser, error } = useContext(AuthContext); 
  const [showPassword, setShowPassword] = useState(false);

  // 2. Modificamos handleSubmit para que pase los valores de los estados
  const handleSubmit = (e) => {
    e.preventDefault();
    // Llamamos a loginUser con el email y la contraseña
    loginUser(email, password);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Box sx={{ width: 400, p: 4, border: '1px solid #ccc', borderRadius: 1 }}>
      <Typography variant="h5" align="center" gutterBottom>Login</Typography>
      {/* 3. Mostramos el error que ahora viene del contexto */}
      {error && <Typography color="error" align="center">{error}</Typography>} 
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          name="email"
          value={email} // 3. Conectamos el valor al estado
          onChange={(e) => setEmail(e.target.value)} // 4. Conectamos el cambio al estado
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Contraseña"
          name="password"
          value={password} // 3. Conectamos el valor al estado
          onChange={(e) => setPassword(e.target.value)} // 4. Conectamos el cambio al estado
          type={showPassword ? 'text' : 'password'}
          fullWidth
          margin="normal"
          required
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
        <Button type="submit" variant="contained" fullWidth>Iniciar sesión</Button>
      </form>
      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        ¿No tienes una cuenta? {' '}
        <Link 
          component="button" 
          onClick={() => navigate('/register')}
          sx={{ cursor: 'pointer' }}
        >
          Regístrate aquí
        </Link>
      </Typography>
    </Box>
  );
}

export default Login;