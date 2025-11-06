import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

function Home() {
  const { authTokens } = useContext(AuthContext);
  const role = authTokens?.role; // Obtén el rol del usuario desde el token JWT
  console.log("ROL DEL USUARIO::")
  console.log(role)
  return (
    <div>
      <h1>Bienvenido al Dashboard</h1>
      
      {role === 'cliente' ? (
        <div>
          <h2>Cliente</h2>
          <p>Aquí se mostrarán las opciones para el cliente:</p>
          <ul>
            <li>Gestionar domicilios</li>
            <li>Ver listado de pagos</li>
            <li>Gestionar facturas</li>
            <li>Administrar perfil</li>
          </ul>
        </div>
      ) : role === 'empleado' ? (
        <div>
          <h2>Empleado</h2>
          <p>Aquí se mostrarán las opciones para el empleado:</p>
          <ul>
            <li>Gestionar usuarios</li>
            <li>Gestionar domicilios</li>
            <li>Ver listado de pagos</li>
            <li>Gestionar facturas</li>
            <li>Administrar perfil</li>
          </ul>
        </div>
      ) : (
        <p>Cargando información...</p>
      )}
    </div>
  );
}

export default Home;