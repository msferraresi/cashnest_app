import React, { useState, useEffect, useContext } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material';
import api from '../../api/axiosConfig'; // <-- Usamos la instancia 'api'
import { AuthContext } from '../../context/AuthContext';

function UserFormDialog({ open, onClose, onSave, userToEdit }) {
  const { authTokens } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: '',
    last_name: '',
    email: '',
    role_id: '',
  });
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState('');

  const isEditing = Boolean(userToEdit);

  useEffect(() => {
    // Si el diálogo no está abierto, no hacemos nada.
    if (!open) {
      // Limpiamos el formulario al cerrar para evitar mostrar datos viejos.
      setFormData({ name: '', last_name: '', email: '', role_id: '' });
      setError('');
      return;
    }

    const fetchRoles = async () => {
      try {
        // La llamada es limpia, el interceptor se encarga del token.
        const response = await api.get('/role');
        setRoles(response.data.data);
      } catch (err) {
        console.error('Error al cargar los roles:', err);
        setError('No se pudieron cargar los roles.');
      }
    };

    fetchRoles();

    if (isEditing) {
      // Adaptamos los datos del usuario pasado por props
      setFormData({
        name: userToEdit.name || '',
        last_name: userToEdit.last_name || '',
        email: userToEdit.mail || '', // El backend devuelve 'mail'
        role_id: userToEdit.role?.id || '',
      });
    }
  }, [userToEdit, open, isEditing]); // Se ejecuta cuando cambia el usuario a editar o cuando se abre/cierra el diálogo.

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const payload = {
      name: formData.name,
      last_name: formData.last_name,
      email: formData.email,
      role_id: formData.role_id,
    };

    try {
      // La llamada es limpia, el interceptor se encarga del token.
      const response = await api.put(`/user/${userToEdit.id}`, payload, {
        headers: { 'Content-Type': 'application/json' },
      });
      onSave(response.data.data);
      handleClose();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Ocurrió un error al guardar los cambios.';
      setError(errorMessage);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Editar Usuario</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField
          autoFocus
          label="Nombre"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="dense"
          variant="standard"
        />
        <TextField
          label="Apellido"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          fullWidth
          margin="dense"
          variant="standard"
        />
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="dense"
          variant="standard"
        />
        <FormControl fullWidth margin="dense" variant="standard">
          <InputLabel>Rol</InputLabel>
          <Select
            label="Rol"
            name="role_id"
            value={formData.role_id}
            onChange={handleChange}
          >
            {roles.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">Guardar Cambios</Button>
      </DialogActions>
    </Dialog>
  );
}

export default UserFormDialog;