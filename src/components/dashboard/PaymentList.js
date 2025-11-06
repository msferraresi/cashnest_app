import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Tooltip, IconButton } from '@mui/material';
import PaymentsIcon from '@mui/icons-material/Payments';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import api from '../../api/axiosConfig';
import { AuthContext } from '../../context/AuthContext';
import NewPaymentPeriodDialog from './NewPaymentPeriodDialog'; // Importar el nuevo diálogo

const formatAmount = (amount) => {
  const number = Number(amount);
  return `$ ${!isNaN(number) ? number.toFixed(2) : '0.00'}`;
};

const months = [
  { value: 1, name: 'Enero' }, { value: 2, name: 'Febrero' }, { value: 3, name: 'Marzo' },
  { value: 4, name: 'Abril' }, { value: 5, name: 'Mayo' }, { value: 6, name: 'Junio' },
  { value: 7, name: 'Julio' }, { value: 8, name: 'Agosto' }, { value: 9, name: 'Septiembre' },
  { value: 10, name: 'Octubre' }, { value: 11, name: 'Noviembre' }, { value: 12, name: 'Diciembre' },
];

const getMonthName = (monthNumber) => {
  const month = months.find(m => m.value === monthNumber);
  return month ? month.name : 'Desconocido';
};

function PaymentList() {
  const [payments, setPayments] = useState([]);
  const navigate = useNavigate();
  const { authTokens } = useContext(AuthContext);
  const { houseId } = useParams(); // Obtener el ID del domicilio desde la URL
  const [isNewPeriodDialogOpen, setIsNewPeriodDialogOpen] = useState(false);

  // Encapsulamos la lógica de fetching para poder re-llamarla
  useEffect(() => {
    const fetchPayments = async () => {
      if (!authTokens) return;
      try {
        const response = await api.get(`/payment/${houseId}`); // Usar el ID del domicilio
        setPayments(response.data.data);
      } catch (error) {
        console.error('Error al cargar la lista de pagos:', error);
      }
    };

    fetchPayments();
  }, [authTokens, houseId]);

  const handleNavigateToNewPeriod = (month, year) => {
    navigate(`/dashboard/invoices/${houseId}/${month}/${year}`);
  };

  const handleRowClick = (month, year) => {
    navigate(`/dashboard/invoices/${houseId}/${month}/${year}`);
  };

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Volver a Domicilios">
            {/* Navegación explícita a la lista de domicilios */}
            <IconButton onClick={() => navigate('/dashboard/addresses')} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <PaymentsIcon sx={{ mr: 1, fontSize: '2rem' }} />
          <Typography variant="h4" component="h1">Lista de Pagos</Typography>
        </Box>
        <Tooltip title="Crear Período">
          <IconButton
            onClick={() => setIsNewPeriodDialogOpen(true)}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': { bgcolor: 'primary.dark' },
            }}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={(theme) => ({
              '& th': { fontWeight: 'bold' },
              bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.200',
            })}>
              <TableCell>Mes</TableCell>
              <TableCell>Año</TableCell>
              <TableCell align="right">Total Pagado</TableCell>
              <TableCell align="right">Total Adeudado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((payment) => (
                <TableRow
                  key={`${payment.month}-${payment.year}`}
                  hover
                  onClick={() => handleRowClick(payment.month, payment.year)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>{getMonthName(payment.month)}</TableCell>
                  <TableCell>{payment.year}</TableCell>
                  <TableCell align="right">{formatAmount(payment.total_paid)}</TableCell>
                  <TableCell align="right">{formatAmount(payment.total_due)}</TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <NewPaymentPeriodDialog
        open={isNewPeriodDialogOpen}
        onClose={() => setIsNewPeriodDialogOpen(false)}
        onNavigate={handleNavigateToNewPeriod}
        existingPeriods={payments}
      />
    </div>
  );
}

export default PaymentList;
