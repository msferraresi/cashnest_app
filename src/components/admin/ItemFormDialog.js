import React, { useState, useEffect, useContext } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Alert,
  CircularProgress,
} from '@mui/material';
import api from '../../api/axiosConfig';
const initialFormState = {
  name: '',
};

function ItemFormDialog({ open, onClose, onSave, itemToEdit, apiEndpoint, itemName }) {
  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isEditMode = Boolean(itemToEdit);

  useEffect(() => {
    if (open) {
      if (isEditMode) {
        setFormData({ name: itemToEdit.name });
      } else {
        setFormData(initialFormState);
      }
      setError('');
      setLoading(false);
    }
  }, [itemToEdit, open, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    if (!formData.name.trim()) {
      setError('El nombre es obligatorio.');
      setLoading(false);
      return;
    }

    const payload = { name: formData.name };
    const url = isEditMode ? `/${apiEndpoint}/${itemToEdit.id}` : `/${apiEndpoint}`;
    const method = isEditMode ? 'put' : 'post';

    try {
      // La llamada es limpia, el interceptor se encarga del token de autorización.
      // Mantenemos el Content-Type para asegurar que el backend reciba JSON.
      await api[method](url, payload, { headers: { 'Content-Type': 'application/json' } });
      onSave();
      onClose();
    } catch (err) {
      const errorMessage = err.response?.data?.message || `Ocurrió un error al guardar ${itemName.toLowerCase()}.`;
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEditMode ? `Editar ${itemName}` : `Agregar Nuevo ${itemName}`}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TextField autoFocus margin="dense" name="name" label={`Nombre del ${itemName}`} type="text" fullWidth variant="standard" value={formData.name} onChange={handleChange} required disabled={loading} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ItemFormDialog;