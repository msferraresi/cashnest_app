import React, { useState, useContext, useEffect } from 'react';
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
import api from '../../api/axiosConfig';
import { AuthContext } from '../../context/AuthContext';

const initialFormState = {
  name: '',
  address: '',
  number: '',
  id_type_house: '',
};

// Mapping for house types as described
const houseTypes = [
  { id: 1, name: 'Principal' },
  { id: 2, name: 'Laboral' },
  { id: 3, name: 'Particular' },
  { id: 4, name: 'Otra' },
];

function AddressFormDialog({ open, onClose, onSave, addressToEdit }) {
  const { authTokens } = useContext(AuthContext);
  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState('');

  const isEditMode = Boolean(addressToEdit);

  useEffect(() => {
    if (isEditMode) {
      // Si estamos editando, poblamos el formulario con los datos de la dirección existente
      setFormData({ ...addressToEdit });
    } else {
      setFormData(initialFormState);
    }
  }, [addressToEdit, open, isEditMode]); // Resetea el formulario cuando se abre el diálogo o cambia la dirección a editar

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClose = () => {
    onClose();
    setFormData(initialFormState); // Reset form on close
    setError('');
  };

  const handleSubmit = async () => {
    setError('');
    if (!formData.name || !formData.address || !formData.number || !formData.id_type_house) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    const payload = {
      ...formData,
      id_user: authTokens.user_id,
    };

    try {
      let response;
      if (isEditMode) {
        // Llamada a la API para actualizar una dirección existente (PUT)
        // El interceptor se encarga del token. Solo especificamos Content-Type si es necesario.
        response = await api.put(`/house/${addressToEdit.id}`, payload, { headers: { 'Content-Type': 'application/json' } });
      } else {
        // Llamada a la API para crear una nueva dirección (POST)
        response = await api.post('/house', payload, { headers: { 'Content-Type': 'application/json' } });
      }

      onSave(response.data.data);
      handleClose();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Ocurrió un error al guardar la dirección.';
      setError(errorMessage);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEditMode ? 'Editar Dirección' : 'Agregar Nueva Dirección'}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Nombre (ej: Casa, Oficina)"
          type="text"
          fullWidth
          variant="standard"
          value={formData.name}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="address"
          label="Dirección (Calle)"
          type="text"
          fullWidth
          variant="standard"
          value={formData.address}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="number"
          label="Número"
          type="text"
          fullWidth
          variant="standard"
          value={formData.number}
          onChange={handleChange}
        />
        <FormControl fullWidth margin="dense" variant="standard">
          <InputLabel>Tipo de Domicilio</InputLabel>
          <Select name="id_type_house" value={formData.id_type_house} onChange={handleChange} label="Tipo de Domicilio">
            {houseTypes.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">Guardar</Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddressFormDialog;