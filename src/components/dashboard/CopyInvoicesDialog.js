import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Box,
  Checkbox,
  FormControlLabel,
} from '@mui/material';

// Helper para generar una lista de años
const generateYearList = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear + 2; i >= currentYear - 5; i--) {
    years.push(i);
  }
  return years;
};

const months = [
  { value: 1, name: 'Enero' }, { value: 2, name: 'Febrero' }, { value: 3, name: 'Marzo' },
  { value: 4, name: 'Abril' }, { value: 5, name: 'Mayo' }, { value: 6, name: 'Junio' },
  { value: 7, name: 'Julio' }, { value: 8, name: 'Agosto' }, { value: 9, name: 'Septiembre' },
  { value: 10, name: 'Octubre' }, { value: 11, name: 'Noviembre' }, { value: 12, name: 'Diciembre' },
];

function CopyInvoicesDialog({ open, onClose, onCopy, currentTarget }) {
  const [sourceYear, setSourceYear] = useState(new Date().getFullYear());
  const [sourceMonth, setSourceMonth] = useState(new Date().getMonth() + 1);
  const [error, setError] = useState('');
  const [copyAmounts, setCopyAmounts] = useState(true);
  const [copyPaymentType, setCopyPaymentType] = useState(true);

  useEffect(() => {
    // Resetea el error cuando se abre el diálogo
    if (open) {
      setError('');
      // Resetea los checkboxes a su estado por defecto al abrir
      setCopyAmounts(true);
      setCopyPaymentType(true);
    }
  }, [open]);

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = () => {
    setError('');
    if (parseInt(currentTarget.year, 10) === sourceYear && parseInt(currentTarget.month, 10) === sourceMonth) {
      setError('No se puede copiar desde el mismo período.');
      return;
    }
    onCopy(sourceMonth, sourceYear, copyAmounts, copyPaymentType);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>Copiar Facturas Desde</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Año</InputLabel>
            <Select value={sourceYear} label="Año" onChange={(e) => setSourceYear(e.target.value)}>
              {generateYearList().map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Mes</InputLabel>
            <Select value={sourceMonth} label="Mes" onChange={(e) => setSourceMonth(e.target.value)}>
              {months.map(m => <MenuItem key={m.value} value={m.value}>{m.name}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={copyAmounts}
                onChange={(e) => setCopyAmounts(e.target.checked)}
                name="copyAmounts"
              />
            }
            label="Copiar Montos"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={copyPaymentType}
                onChange={(e) => setCopyPaymentType(e.target.checked)}
                name="copyPaymentType"
              />
            }
            label="Copiar Tipo de Pago"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">Copiar</Button>
      </DialogActions>
    </Dialog>
  );
}

export default CopyInvoicesDialog;