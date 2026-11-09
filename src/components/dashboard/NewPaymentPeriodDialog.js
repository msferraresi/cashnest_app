import React, { useState, useContext } from 'react';
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
} from '@mui/material';
import { AuthContext } from '../../context/AuthContext';

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

function NewPaymentPeriodDialog({ open, onClose, onNavigate, existingPeriods }) {
  const { authTokens } = useContext(AuthContext);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [error, setError] = useState('');

  const handleClose = () => {
    onClose();
    setError('');
  };

  const handleSubmit = () => {
    setError('');

    // Comprueba si el período ya existe para evitar duplicados
    const periodExists = existingPeriods.some(p => p.year === year && p.month === month);
    if (periodExists) {
      setError('Este período ya existe en la lista. Puede registrar facturas directamente en esa fila.');
      return;
    }

    // En lugar de hacer un POST, simplemente llamamos a la función de navegación
    onNavigate(month, year);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>Ir a un Nuevo Período</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Año</InputLabel>
            <Select value={year} label="Año" onChange={(e) => setYear(e.target.value)}>
              {generateYearList().map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Mes</InputLabel>
            <Select value={month} label="Mes" onChange={(e) => setMonth(e.target.value)}>
              {months.map(m => <MenuItem key={m.value} value={m.value}>{m.name}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">Ir</Button>
      </DialogActions>
    </Dialog>
  );
}

export default NewPaymentPeriodDialog;