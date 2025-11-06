import React, { useState, useContext, useEffect } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import api from '../../api/axiosConfig';
import { AuthContext } from '../../context/AuthContext';

const initialFormState = {
  id_status: 2, // Default to 'Pendiente'
  id_type_payment: 1,
  id_currency: 1,
  id_concept: '',
  layer: '',
  max_ammount: '',
  min_ammount: '',
  other_ammount: '',
};

// --- Constantes para los selectores del formulario ---
const invoiceStatuses = [
  { id: 1, name: 'Pagado' },
  { id: 2, name: 'Pendiente' },
];

const paymentTypes = [
  { id: 1, name: 'Total' },
  { id: 2, name: 'Minimo' },
  { id: 3, name: 'Otro' },
];

const currencies = [
  { id: 1, name: 'Peso' },
  { id: 2, name: 'Dolar' },
  { id: 3, name: 'Euro' },
];

const concepts = [
  { id: 1, name: 'Tarjeta Credito' },
  { id: 2, name: 'Telefonia' },
  { id: 3, name: 'Credito' },
  { id: 4, name: 'Servicio' },
  { id: 5, name: 'Impuesto' },
  { id: 6, name: 'Varios' },
];

function InvoiceFormDialog({ open, onClose, onSave, month, year, houseId, invoiceToEdit }) {
  const { authTokens } = useContext(AuthContext);
  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState('');

  const isEditMode = Boolean(invoiceToEdit);

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        id_status: invoiceToEdit.id_status,
        id_type_payment: invoiceToEdit.id_type_payment,
        id_currency: invoiceToEdit.id_currency,
        id_concept: invoiceToEdit.id_concept,
        layer: invoiceToEdit.layer,
        max_ammount: invoiceToEdit.max_ammount,
        min_ammount: invoiceToEdit.min_ammount,
        other_ammount: invoiceToEdit.other_ammount,
      });
    }
  }, [invoiceToEdit, open, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setFormData(initialFormState);
      setError('');
    }, 300); // Pequeño delay para evitar parpadeo al cerrar
  };

  const handleSubmit = async () => {
    setError('');
    // Simplificamos la validación: el concepto y la descripción son siempre necesarios.
    if (!formData.id_concept || !formData.layer) {
      setError('El Concepto y la Descripción son obligatorios.');
      return;
    }

    try {
      const payload = {
        id_status: formData.id_status,
        id_type_payment: formData.id_type_payment,
        id_currency: formData.id_currency,
        id_concept: formData.id_concept,
        layer: formData.layer,
        max_ammount: parseFloat(formData.max_ammount) || 0, // Aseguramos que los montos sean numéricos
        min_ammount: parseFloat(formData.min_ammount) || 0,
        other_ammount: parseFloat(formData.other_ammount) || 0,
        id_house: parseInt(houseId, 10), // Aseguramos que los IDs sean enteros
        id_user: authTokens.user_id,
        month: parseInt(month, 10),
        year: parseInt(year, 10),
      };

      let response;
      if (isEditMode) {
        // Asumiendo que el endpoint para actualizar es PUT /payment/:id
        response = await api.put(`/payment/${invoiceToEdit.id}`, payload, { headers: { 'Content-Type': 'application/json' } });
      } else {
        // El endpoint para crear facturas es POST /payment
        response = await api.post('/payment', payload, { headers: { 'Content-Type': 'application/json' } });
      }

      onSave(response.data.data);
      handleClose();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Ocurrió un error al crear la factura.';
      setError(errorMessage);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEditMode ? 'Editar Factura' : 'Registrar Nueva Factura'}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <FormControl fullWidth margin="dense" variant="standard">
          <InputLabel>Concepto</InputLabel>
          <Select name="id_concept" value={formData.id_concept} onChange={handleChange} label="Concepto">
            {concepts.map((c) => (
              <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          margin="dense"
          name="layer"
          label="Descripción (ej: Seguro Rivadavia)"
          type="text"
          fullWidth
          variant="standard"
          value={formData.layer}
          onChange={handleChange}
        />

        <FormControl fullWidth margin="dense" variant="standard">
          <InputLabel>Tipo de Pago</InputLabel>
          <Select name="id_type_payment" value={formData.id_type_payment} onChange={handleChange} label="Tipo de Pago">
            {paymentTypes.map((p) => (
              <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField margin="dense" name="max_ammount" label="Monto Total" type="number" fullWidth variant="standard" value={formData.max_ammount} onChange={handleChange} />
        <TextField margin="dense" name="min_ammount" label="Monto Mínimo" type="number" fullWidth variant="standard" value={formData.min_ammount} onChange={handleChange} />
        <TextField margin="dense" name="other_ammount" label="Otro Monto" type="number" fullWidth variant="standard" value={formData.other_ammount} onChange={handleChange} />

        <FormControl fullWidth margin="dense" variant="standard">
          <InputLabel>Moneda</InputLabel>
          <Select name="id_currency" value={formData.id_currency} onChange={handleChange} label="Moneda">
            {currencies.map((c) => (
              <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="dense" variant="standard">
          <InputLabel>Estado</InputLabel>
          <Select name="id_status" value={formData.id_status} onChange={handleChange} label="Estado">
            {invoiceStatuses.map((status) => (
              <MenuItem key={status.id} value={status.id}>
                {status.name}
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

export default InvoiceFormDialog;