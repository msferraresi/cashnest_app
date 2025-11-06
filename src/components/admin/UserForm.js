import React, { useState, useEffect, useContext } from 'react';
import { TextField, Button, Box, Typography, Select, MenuItem, FormControl, InputLabel, Alert, CircularProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/axiosConfig';

function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authTokens } = useContext(AuthContext);

  const [user, setUser] = useState({
    name: '',
    last_name: '',
    email: '', // El formulario usará 'email' para consistencia con Profile.js
    role_id: ''
  });
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // El modo de edición está determinado por la presencia del ID en la URL
  const isEditing = Boolean(id);

  useEffect(() => {
    if (authTokens?.token) {
      fetchRoles();
      if (isEditing) {
        fetchUser();
      }
    }
  }, [id, authTokens]); // Depende del token para hacer las llamadas

  const fetchRoles = async () => {
    try {
      const response = await api.get('/role', {
        headers: { 'Authorization': `Bearer ${authTokens.token}` }
      });
      setRoles(response.data.data);
    } catch (error) {
      console.error('Error al cargar los roles:', error);
      setError('No se pudieron cargar los roles.');
    }
  };

  const fetchUser = async () => {
    try {
      const response = await api.get(`/user/${id}`, {
        headers: { 'Authorization': `Bearer ${authTokens.token}` }
      });
      const userData = response.data.data;
      // Adaptamos la respuesta de la API a la estructura del estado del formulario
      setUser({
        name: userData.name || '',
        last_name: userData.last_name || '',
        email: userData.mail || '', // Mapeamos 'mail' a 'email'
        role_id: userData.role?.id || '' // Mapeamos 'role.id' a 'role_id'
      });
    } catch (error) {
      console.error('Error al cargar el usuario:', error);
      setError('No se pudo cargar la información del usuario.');
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // El backend espera 'email' y 'role_id' para la actualización, igual que en Profile.js
    const payload = {
      name: user.name,
      last_name: user.last_name,
      email: user.email,
      role_id: user.role_id,
    };

    try {
      await api.put(`/user/${id}`, payload, {
        headers: {
          'Authorization': `Bearer ${authTokens.token}`,
          'Content-Type': 'application/json'
        }
      });
      setSuccess('Usuario actualizado con éxito. Redirigiendo a la lista...');
      setTimeout(() => {
        navigate('/dashboard/config/users');
      }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Ocurrió un error al guardar los cambios.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
      <Box sx={{ width: '100%', maxWidth: 500, p: 4, border: '1px solid #ccc', borderRadius: 1 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Editar Usuario
        </Typography>
        <form onSubmit={handleSubmit}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <TextField
            label="Nombre"
            name="name"
            value={user.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            disabled={!!success || loading}
          />
          <TextField
            label="Apellido"
            name="last_name"
            value={user.last_name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            disabled={!!success || loading}
          />
          <TextField
            label="Email"
            name="email"
            value={user.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            disabled={!!success || loading}
          />
          <FormControl fullWidth margin="normal" disabled={!!success || loading}>
            <InputLabel id="role-label">Rol</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              name="role_id"
              value={user.role_id}
              label="Rol"
              onChange={handleChange}
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={!!success || loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Guardar Cambios'}
          </Button>
          <Button variant="outlined" fullWidth sx={{ mt: 1 }} onClick={() => navigate('/dashboard/config/users')} disabled={!!success || loading}>
            Cancelar
          </Button>
        </form>
      </Box>
    </Box>
  );
}

export default UserForm;