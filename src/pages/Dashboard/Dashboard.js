import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirige a la lista de direcciones cuando se carga el dashboard
    navigate('addresses');
  }, [navigate]);
  
  // Este componente no necesita renderizar nada, ya que su única
  // función es redirigir al usuario a la página por defecto del dashboard.
  return null;
}

export default Dashboard;