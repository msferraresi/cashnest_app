import React, { useState, useEffect, useContext } from 'react';
import { TextField, Button, Box, Typography, Avatar, MenuItem, Select, InputLabel, FormControl, Grid } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/axiosConfig';

function Profile() {
  // Obtenemos 'user' del contexto, que ya está decodificado y es más limpio.
  // 'authTokens' todavía es útil para obtener datos que no están en el JWT (payload).
  const { authTokens, user, setAuthTokens } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: '',
    last_name: '',
    email: '',
    role_id: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [fileError, setFileError] = useState(''); // Estado para el error del archivo
  
  useEffect(() => {
    if (authTokens) {
      setFormData({
        name: authTokens.name || '',
        last_name: authTokens.last_name || '',
        email: authTokens.email || '',
        role_id: authTokens.role_id || '',
      });
    }
  }, [authTokens]);

  useEffect(() => {
    // Esta función se encarga de recargar los datos del perfil si no están completos
    // en el contexto, por ejemplo, después de un refresh de página.
    const fetchFullProfile = async () => {
      // Si tenemos 'user' (del token) pero no 'authTokens.image' (de la API de login)
      if (user && !authTokens.image) {
        try {
          // El interceptor de Axios añadirá el token automáticamente.
          const response = await api.get(`/user/${user.user_id}`);
          // Actualizamos el contexto con la información completa, incluyendo la imagen
          const newProfileData = response.data.data;
          setAuthTokens(prevTokens => ({
            ...prevTokens, // Mantenemos tokens existentes
            ...newProfileData, // Sobrescribimos con data fresca de la API
            role: newProfileData.role.name // Aseguramos que el rol sea un string
          }));
        } catch (error) {
          console.error('Error al recargar la información del perfil:', error);
        }
      }
    };
    fetchFullProfile();
  }, [user, authTokens, setAuthTokens]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB en bytes

    if (file.size > MAX_FILE_SIZE) {
      setFileError('El archivo es demasiado grande. El tamaño máximo es de 2 MB.');
      setSelectedFile(null);
      e.target.value = null; // Limpia el input para poder seleccionar otro archivo
      return;
    }

    // Si el archivo es válido
    setSelectedFile(file);
    setFileError(''); // Limpia cualquier error previo
  };

  const getRoleName = (id) => {
    switch (id) {
      case 1:
        return 'empleado';
      case 2:
        return 'cliente';
      default:
        return '';
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const updatedData = new FormData();
      updatedData.append('name', formData.name);
      updatedData.append('last_name', formData.last_name);
      updatedData.append('email', formData.email); 
      updatedData.append('role_id', formData.role_id); 

      if (selectedFile) {
        updatedData.append('avatar_user', selectedFile.name); 
        updatedData.append('photo', selectedFile);
      }else{
        updatedData.append('avatar_user', authTokens.avatar_user); 
      }

      // La llamada a la API ya no necesita cabeceras manuales.
      await api.put(`/user/${user.user_id}`, updatedData);
      
      // Después de actualizar, volvemos a solicitar los datos completos del usuario
      const updatedProfileResponse = await api.get(`/user/${user.user_id}`);

      const newProfileData = updatedProfileResponse.data.data;

      // Reconstrucción final y segura del estado de autenticación.
      // Tomamos cada pieza de información de su fuente más fiable para evitar inconsistencias.
      setAuthTokens({
        // 1. El token y el user_id se mantienen del estado anterior.
        access: authTokens.access, // Mantenemos el token de acceso
        user_id: user.user_id,
        // 2. Los datos del formulario son la fuente de verdad para lo que el usuario acaba de editar.
        name: formData.name,
        last_name: formData.last_name,
        email: formData.email,
        role_id: formData.role_id,
        // 3. El nombre del rol se deriva del role_id del formulario para garantizar que los tabs se muestren.
        role: getRoleName(formData.role_id),
        // 4. La nueva imagen y su nombre vienen de la respuesta del servidor tras el refresco.
        image: newProfileData.image,
        avatar_user: newProfileData.avatar_user,
        // 5. ¡IMPORTANTE! Mantenemos el brillo del tema para que no se pierda.
        theme_brightness: authTokens.theme_brightness,
      });

      setIsEditing(false);
      setSelectedFile(null);
      setFileError('');
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
    }
  };

  const getInitials = (name, lastName) => {
    let initials = '';
    if (name) initials += name[0];
    if (lastName) initials += lastName[0];
    return initials.toUpperCase();
  };
  
  const isDefaultAvatar = !authTokens?.image;
  const avatarSrc = !isDefaultAvatar ? `data:image/png;base64,${authTokens.image}` : '';

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <AccountCircleIcon sx={{ mr: 1, fontSize: '2rem' }} />
        <Typography variant="h4" component="h1">
          Perfil de Usuario
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar src={avatarSrc} alt={`${authTokens?.name} ${authTokens?.last_name}`} sx={{ width: 150, height: 150, mb: 2 }}>
          {isDefaultAvatar && getInitials(authTokens?.name, authTokens?.last_name)}
        </Avatar>

        <Box sx={{ width: '100%', maxWidth: 600, mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nombre"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Apellido"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Rol</InputLabel>
                <Select
                  label="Rol"
                  name="role_id"
                  value={formData.role_id}
                  onChange={handleChange}
                  disabled={!isEditing || authTokens?.role !== 'empleado'}
                >
                  <MenuItem value={1}>Empleado</MenuItem>
                  <MenuItem value={2}>Cliente</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          {isEditing && (
            <>
              <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} id="avatar-upload" />
              <label htmlFor="avatar-upload">
                <Button variant="contained" component="span" sx={{ mt: 2 }} fullWidth>
                  Cambiar Foto de Perfil
                </Button>
              </label>
              {/* Muestra el nombre del archivo solo si es válido */}
              {selectedFile && !fileError && (
                <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                  Archivo seleccionado: {selectedFile.name}
                </Typography>
              )}
              {/* Muestra el mensaje de error si existe */}
              {fileError && (
                <Typography color="error" variant="body2" sx={{ mt: 1, textAlign: 'center' }}>{fileError}</Typography>
              )}
            </>
          )}
          
          {!isEditing ? (
            <Button variant="contained" onClick={() => setIsEditing(true)} sx={{ mt: 2 }} fullWidth>
              Editar Perfil
            </Button>
          ) : (
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button variant="outlined" onClick={() => setIsEditing(false)} fullWidth>
                Cancelar
              </Button>
              <Button variant="contained" onClick={handleUpdateProfile} fullWidth>
                Guardar Cambios
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default Profile;