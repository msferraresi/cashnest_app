import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Tooltip, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api from '../../api/axiosConfig';
import { AuthContext } from '../../context/AuthContext';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import CopyInvoicesDialog from './CopyInvoicesDialog';
import InvoiceFormDialog from './InvoiceFormDialog'; // Import the dialog

// --- Constantes para mostrar nombres en la lista ---
const invoiceStatuses = [
  { id: 1, name: 'Pagado' },
  { id: 2, name: 'Pendiente' },
];
const concepts = [
  { id: 1, name: 'Tarjeta Credito' }, { id: 2, name: 'Telefonia' },
  { id: 3, name: 'Credito' }, { id: 4, name: 'Servicio' },
  { id: 5, name: 'Impuesto' }, { id: 6, name: 'Varios' },
];

const paymentTypes = [
  { id: 1, name: 'Total' },
  { id: 2, name: 'Minimo' },
  { id: 3, name: 'Otro' },
];

const currencies = [
  { id: 1, name: 'Peso', symbol: '$' },
  { id: 2, name: 'Dolar', symbol: 'U$S' },
  { id: 3, name: 'Euro', symbol: '€' },
];

// --- Funciones de ayuda para obtener nombres a partir de IDs ---
const getStatusName = (id) => invoiceStatuses.find(s => s.id === id)?.name || 'Desconocido';
const getConceptName = (id) => concepts.find(c => c.id === id)?.name || 'Desconocido';
const getPaymentTypeName = (id) => paymentTypes.find(p => p.id === id)?.name || 'Desconocido';
const getCurrencySymbol = (id) => {
  const currency = currencies.find(c => c.id === id);
  return currency ? currency.symbol : '$';
};

const formatAmount = (amount) => {
  const number = Number(amount);
  return !isNaN(number) ? number.toFixed(2) : '0.00';
};

function InvoiceList() {
  const { month, year, houseId } = useParams(); // Get houseId from URL
  const [invoices, setInvoices] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [isCopyDialogOpen, setIsCopyDialogOpen] = useState(false);
  const { authTokens } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchInvoices = useCallback(async () => {
    if (!authTokens || !houseId) return;
    try {
      // El endpoint para obtener facturas es /payment/:houseId/:month/:year
      const response = await api.get(`/payment/${houseId}/${month}/${year}`);
      // Ordenamos las facturas: pendientes (id=2) primero, luego pagadas (id=1)
      const sortedInvoices = response.data.data.sort((a, b) => b.id_status - a.id_status);
      setInvoices(sortedInvoices);
    } catch (error) {
      console.error('Error al cargar las facturas:', error);
      // Si no hay facturas, la API puede devolver un 404, lo cual es esperado.
      // Mantenemos la lista vacía.
      if (error.response?.status !== 404) {
        // Handle other errors if needed
      }
      setInvoices([]);
    }
  }, [month, year, houseId, authTokens]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleSaveInvoice = (newInvoice) => {
    const isEditing = invoices.some(inv => inv.id === newInvoice.id);
    let updatedInvoices;
    if (isEditing) {
      updatedInvoices = invoices.map(inv => (inv.id === newInvoice.id ? newInvoice : inv));
    } else {
      updatedInvoices = [...invoices, newInvoice];
    }
    // Reordenamos la lista después de guardar
    setInvoices(updatedInvoices.sort((a, b) => b.id_status - a.id_status));
  };

  const handleOpenEditDialog = (invoice) => {
    setEditingInvoice(invoice);
    setIsFormOpen(true);
  };

  const handleCloseFormDialog = () => {
    setIsFormOpen(false);
    setEditingInvoice(null);
  };

  const handleOpenDeleteDialog = (invoice) => {
    setInvoiceToDelete(invoice);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setInvoiceToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!invoiceToDelete) return;
    try {
      // Asumiendo que el endpoint para borrar es DELETE /payment/:id
      await api.delete(`/payment/${invoiceToDelete.id}`);
      setInvoices(invoices.filter(inv => inv.id !== invoiceToDelete.id));
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error al eliminar la factura:', error);
      handleCloseDeleteDialog();
    }
  };

  const handleCopyInvoices = async (sourceMonth, sourceYear, copyAmounts, copyPaymentType) => {
    try {
      // Para que esto funcione, necesitas un endpoint en tu backend que maneje esta lógica.
      // Por ejemplo: POST /payment/copy
      const payload = {
        source_month: sourceMonth,
        source_year: sourceYear,
        target_month: parseInt(month, 10),
        target_year: parseInt(year, 10),
        id_house: parseInt(houseId, 10),
        id_user: authTokens.user_id,
        copy_amounts: copyAmounts,
        copy_payment_type: copyPaymentType,
      };
      await api.post('/payment/copy', payload);
      // Después de copiar, volvemos a cargar las facturas del período actual.
      fetchInvoices();
    } catch (error) {
      console.error('Error al copiar las facturas:', error);
      // Aquí podrías mostrar una notificación de error al usuario.
    }
  };

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Volver a la Lista de Pagos">
            {/* Navegación explícita a la lista de pagos del domicilio actual */}
            <IconButton onClick={() => navigate(`/dashboard/payments/${houseId}`)} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <DescriptionIcon sx={{ mr: 1, fontSize: '2rem' }} />
          <Typography variant="h4" component="h1">Facturas para {month}/{year}</Typography>
        </Box>
        <Box>
          <Tooltip title="Copiar Facturas de otro período">
            <IconButton
              onClick={() => setIsCopyDialogOpen(true)}
              sx={{
                bgcolor: 'secondary.main',
                color: 'white',
                mr: 1,
                '&:hover': { bgcolor: 'secondary.dark' },
              }}
            >
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Agregar Factura">
            <IconButton
              onClick={() => setIsFormOpen(true)}
              sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={(theme) => ({
              '& th': { fontWeight: 'bold' },
              bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.200',
            })}>
              <TableCell>Descripción</TableCell>
              <TableCell align="right">Monto Total</TableCell>
              <TableCell align="right">Monto Mínimo</TableCell>
              <TableCell align="right">Otro Monto</TableCell>
              <TableCell align="center">Tipo de Pago</TableCell>
              <TableCell align="center">Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((invoice) => {
              const isPaid = invoice.id_status === 1;
              const rowStyle = {
                backgroundColor: isPaid ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.1)',
              };

              return (
              <TableRow 
                key={invoice.id}
                sx={rowStyle}
              >                
                <TableCell>
                  <Typography variant="body2">{invoice.layer}</Typography>
                  <Typography variant="caption" color="textSecondary">{getConceptName(invoice.id_concept)}</Typography>
                </TableCell>                
                <TableCell align="right">{`${getCurrencySymbol(invoice.id_currency)} ${formatAmount(invoice.max_ammount)}`}</TableCell>
                <TableCell align="right">{`${getCurrencySymbol(invoice.id_currency)} ${formatAmount(invoice.min_ammount)}`}</TableCell>
                <TableCell align="right">{`${getCurrencySymbol(invoice.id_currency)} ${formatAmount(invoice.other_ammount)}`}</TableCell>
                <TableCell align="center">{getPaymentTypeName(invoice.id_type_payment)}</TableCell>
                <TableCell align="center">{getStatusName(invoice.id_status)}</TableCell>
                <TableCell align="right">                  
                  <Tooltip title="Editar">
                    <IconButton
                      onClick={() => handleOpenEditDialog(invoice)}
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        mr: 1,
                        width: 32, height: 32,
                        '&:hover': { bgcolor: 'primary.dark' },
                      }}
                    >
                      <EditIcon sx={{ fontSize: '1.1rem' }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton
                      onClick={() => handleOpenDeleteDialog(invoice)}
                      sx={{
                        bgcolor: 'error.main',
                        color: 'white',
                        width: 32, height: 32,
                        '&:hover': { bgcolor: 'error.dark' },
                      }}
                    >
                      <DeleteIcon sx={{ fontSize: '1.1rem' }} />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <InvoiceFormDialog
        open={isFormOpen}
        onClose={handleCloseFormDialog}
        onSave={handleSaveInvoice}
        month={month}
        year={year}
        houseId={houseId}
        invoiceToEdit={editingInvoice}
      />
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        itemName={invoiceToDelete?.layer}
        itemType="la factura"
      />
      <CopyInvoicesDialog
        open={isCopyDialogOpen}
        onClose={() => setIsCopyDialogOpen(false)}
        onCopy={handleCopyInvoices}
        currentTarget={{ month, year }}
      />
    </div>
  );
}

export default InvoiceList;