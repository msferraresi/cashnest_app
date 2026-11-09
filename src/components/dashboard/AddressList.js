import React, { useState, useEffect, useContext } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, IconButton, Tooltip, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import AddIcon from '@mui/icons-material/Add';
import api from '../../api/axiosConfig';
import { AuthContext } from '../../context/AuthContext';
import AddressFormDialog from './AddressFormDialog'; // Importar el nuevo componente de formulario
import DeleteConfirmationDialog from './DeleteConfirmationDialog'; // Importar el diálogo de confirmación

// Mapping for house types to display the name in the list
const houseTypes = [
  { id: 1, name: 'Principal' },
  { id: 2, name: 'Laboral' },
  { id: 3, name: 'Particular' },
  { id: 4, name: 'Otra' },
];

const getHouseTypeName = (id) => {
  const type = houseTypes.find(t => t.id === id);
  return type ? type.name : 'Desconocido';
};

function AddressList() {
  const [addresses, setAddresses] = useState([]);
  const navigate = useNavigate();
  const { authTokens } = useContext(AuthContext);
  const [isFormOpen, setIsFormOpen] = useState(false); // Estado para el diálogo
  const [editingAddress, setEditingAddress] = useState(null); // Estado para la dirección a editar
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      // Si no hay tokens, no hacemos nada. El interceptor se encargará del resto.
      if (!authTokens) {
        return;
      }
      try {
        // Ya no es necesario añadir las cabeceras manualmente.
        // El interceptor de Axios se encarga de añadir el token de autorización.
        const response = await api.get('/house');
        setAddresses(response.data.data);
      } catch (error) {
        console.error('Error al cargar las direcciones:', error);
      }
    };

    fetchAddresses();
  }, [authTokens]);

  const handleOpenCreate = () => {
    setEditingAddress(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (address) => {
    setEditingAddress(address);
    setIsFormOpen(true);
  };

  const handleCloseDialog = () => {
    setIsFormOpen(false);
    setEditingAddress(null);
  };

  const handleSaveAddress = (savedAddress) => {
    // Si estamos editando, reemplazamos el elemento. Si no, lo agregamos.
    const isEditing = addresses.some(addr => addr.id === savedAddress.id);
    const updatedAddresses = isEditing ? addresses.map(addr => (addr.id === savedAddress.id ? savedAddress : addr)) : [...addresses, savedAddress];
    setAddresses(updatedAddresses);
  };

  const handleOpenDeleteDialog = (address) => {
    setAddressToDelete(address);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setAddressToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!addressToDelete) return;

    try {
      await api.delete(`/house/${addressToDelete.id}`);
      setAddresses(addresses.filter(addr => addr.id !== addressToDelete.id));
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error al eliminar la dirección:', error);
      handleCloseDeleteDialog(); // Cierra el diálogo incluso si hay un error
    }
  };

  const handleRowClick = (houseId) => {
    navigate(`/dashboard/payments/${houseId}`);
  };

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <HomeWorkIcon sx={{ mr: 1, fontSize: '2rem' }} />
          <Typography variant="h4" component="h1">
            Lista de Domicilios
          </Typography>
        </Box>
        <Tooltip title="Agregar Dirección">
          <IconButton
            onClick={handleOpenCreate}
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
              <TableCell>Nombre</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {addresses.map((address) => (
              <TableRow 
                key={address.id}
                hover
                onClick={() => handleRowClick(address.id)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{address.name}</TableCell>
                <TableCell>{`${address.address} ${address.number}`}</TableCell>
                <TableCell>{getHouseTypeName(address.id_type_house)}</TableCell>
                <TableCell align="right">
                  <Box onClick={(e) => e.stopPropagation()}>
                    <Tooltip title="Editar">
                      <IconButton
                        onClick={() => handleOpenEdit(address)}
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
                        onClick={() => handleOpenDeleteDialog(address)}
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <AddressFormDialog
        open={isFormOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveAddress}
        addressToEdit={editingAddress}
      />
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        itemName={addressToDelete?.name}
        itemType="la dirección"
      />
    </div>
  );
}

export default AddressList;