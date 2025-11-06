import React, { useState, useEffect, useContext } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  IconButton,
  Tooltip,
  Typography,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleIcon from '@mui/icons-material/People';
import api from '../../api/axiosConfig';
import { AuthContext } from '../../context/AuthContext';
import UserFormDialog from './UserFormDialog';
import DeleteConfirmationDialog from '../dashboard/DeleteConfirmationDialog';

const getRoleName = (role) => {
  if (!role) return 'No asignado';
  // Capitaliza el nombre del rol para mostrarlo
  return role.name.charAt(0).toUpperCase() + role.name.slice(1);
};

function UserList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  // Obtenemos 'authTokens' del contexto, que contiene el user_id.
  const { authTokens } = useContext(AuthContext);

  // Estados para los diálogos
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      // Solo intentamos cargar si el usuario está autenticado (tenemos su info del token).
      if (!authTokens?.user_id) return;

      try {
        // La llamada es limpia, el interceptor se encarga del token.
        const response = await api.get('/user');
        const allUsers = response.data.data || []; // Aseguramos que sea un array

        // Filtramos la lista para excluir al usuario logueado usando el ID de authTokens.
        const filteredUsers = allUsers.filter(user => user.id !== authTokens.user_id);

        setUsers(filteredUsers);
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'No se pudieron cargar los usuarios. Es posible que no tengas permisos de administrador.';
        setError(errorMessage);
        console.error('Error al cargar usuarios:', err);
      }
    };

    fetchUsers();
  }, [authTokens]);

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleCloseDialogs = () => {
    setIsFormOpen(false);
    setEditingUser(null);
    setIsDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleSaveUser = (savedUser) => {
    setUsers(users.map(u => (u.id === savedUser.id ? savedUser : u)));
    handleCloseDialogs();
  };

  const handleOpenDelete = (user) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await api.delete(`/user/${userToDelete.id}`);
      setUsers(users.filter(u => u.id !== userToDelete.id));
      handleCloseDialogs();
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
      setError(err.response?.data?.message || 'Ocurrió un error al eliminar el usuario.');
      handleCloseDialogs();
    }
  };

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <PeopleIcon sx={{ mr: 1, fontSize: '2rem' }} />
          <Typography variant="h4" component="h1">
            Gestión de Usuarios
          </Typography>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={(theme) => ({ '& th': { fontWeight: 'bold' }, bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.200' })}>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>{`${user.name} ${user.last_name}`}</TableCell>
                <TableCell>{user.mail}</TableCell>
                <TableCell>{getRoleName(user.role)}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Editar">
                    <IconButton onClick={() => handleOpenEdit(user)} color="primary">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton onClick={() => handleOpenDelete(user)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <UserFormDialog
        open={isFormOpen}
        onClose={handleCloseDialogs}
        onSave={handleSaveUser}
        userToEdit={editingUser}
      />

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDialogs}
        onConfirm={handleConfirmDelete}
        itemName={userToDelete ? `${userToDelete.name} ${userToDelete.last_name}` : ''}
        itemType="al usuario"
      />
    </div>
  );
}

export default UserList;