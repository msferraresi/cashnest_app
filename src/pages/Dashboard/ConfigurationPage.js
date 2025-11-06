import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Button, CardActions } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

const configItems = [
  { title: 'Usuarios', description: 'Administrar los usuarios y sus roles en el sistema.', path: 'users' },
  { title: 'Conceptos', description: 'Gestionar los tipos de conceptos para las facturas.', path: 'concepts' },
  { title: 'Monedas', description: 'Administrar las monedas disponibles en el sistema.', path: 'currencies' },
  { title: 'Estados', description: 'Configurar los estados de las facturas (ej: Pendiente, Pagado).', path: 'statuses' },
  { title: 'Tipos de Domicilio', description: 'Definir los tipos de domicilios (ej: Principal, Laboral).', path: 'type-houses' },
  { title: 'Tipos de Pago', description: 'Gestionar los métodos de pago (ej: Total, Mínimo).', path: 'type-payments' },
];

function ConfigurationPage() {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(`/dashboard/config/${path}`);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <SettingsIcon sx={{ mr: 1, fontSize: '2rem' }} />
        <Typography variant="h4" component="h1">
          Panel de Configuración
        </Typography>
      </Box>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Desde aquí puedes administrar las tablas auxiliares del sistema. Selecciona una categoría para comenzar.
      </Typography>
      <Grid container spacing={3}>
        {configItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.path}>
            <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  variant="contained" 
                  onClick={() => handleNavigate(item.path)}
                >
                  Gestionar
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ConfigurationPage;