import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Tooltip,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteConfirmationDialog from '../dashboard/DeleteConfirmationDialog';
import ItemFormDialog from './ItemFormDialog';

function ManagementPage({ pageTitle, apiEndpoint, itemName, itemType, pageIcon }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // La llamada es limpia, el interceptor se encarga del token.
      const response = await api.get(`/${apiEndpoint}`);
      const data = response.data.data || [];
      data.sort((a, b) => a.id - b.id);
      setItems(data);
    } catch (err) {
      setError(`Error al cargar los ${itemName.toLowerCase()}s.`);
      console.error(err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [apiEndpoint, itemName]); // Ya no necesita depender de authTokens directamente

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenDialog = (item = null) => {
    setItemToEdit(item);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setItemToEdit(null);
  };

  const handleSave = () => {
    fetchData();
  };

  const handleOpenDeleteDialog = (item) => {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setItemToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await api.delete(`/${apiEndpoint}/${itemToDelete.id}`);
      fetchData();
      handleCloseDeleteDialog();
    } catch (err) {
      const errorMessage = err.response?.data?.message || `Error al eliminar ${itemType}.`;
      setError(errorMessage);
      console.error(err);
      handleCloseDeleteDialog();
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Volver a Configuración">
            <IconButton onClick={() => navigate('/dashboard/config')} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          {pageIcon && React.cloneElement(pageIcon, { sx: { mr: 1, fontSize: '2rem' } })}
          <Typography variant="h4" component="h1">
            {pageTitle}
          </Typography>
        </Box>
        <Tooltip title={`Agregar ${itemName}`}>
          <IconButton
            onClick={() => handleOpenDialog()}
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
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? (
        <CircularProgress />
      ) : (
        <Paper>
          <List>
            {items.map((item) => (
              <ListItem
                key={item.id}
                secondaryAction={
                  <Box>
                    <Tooltip title="Editar">
                      <IconButton
                        onClick={() => handleOpenDialog(item)}
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
                        onClick={() => handleOpenDeleteDialog(item)}
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
                  </Box>
                }
              >
                <ListItemText primary={item.name} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
      <ItemFormDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSave}
        itemToEdit={itemToEdit}
        apiEndpoint={apiEndpoint}
        itemName={itemName}
      />
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.name}
        itemType={itemType}
      />
    </Box>
  );
}

export default ManagementPage;