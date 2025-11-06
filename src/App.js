import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Importa el contexto de autenticación
import { CustomThemeProvider } from './context/ThemeContext'; // Importa el proveedor de tema
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './pages/Dashboard/DashboardLayout'; // <-- Usamos el layout correcto

// Componentes de la aplicación principal
import Dashboard from './pages/Dashboard/Dashboard'; // Este componente redirige
import AddressList from './components/dashboard/AddressList';
import PaymentList from './components/dashboard/PaymentList';
import InvoiceList from './components/dashboard/InvoiceList';
import Profile from  './components/dashboard/Profile.js'
import UserList from './components/admin/UserList';
import ConfigurationPage from './pages/Dashboard/ConfigurationPage';
import ConceptManagementPage from './pages/Dashboard/config/ConceptManagementPage';
import StatusManagementPage from './pages/Dashboard/config/StatusManagementPage';
import TypeHouseManagementPage from './pages/Dashboard/config/TypeHouseManagementPage';
import TypePaymentManagementPage from './pages/Dashboard/config/TypePaymentManagementPage';
import CurrencyManagementPage from './pages/Dashboard/config/CurrencyManagementPage';
import ChangePassword from './components/dashboard/ChangePassword';

// Importa el componente de ruta privada
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CustomThemeProvider>
            <Routes>
              {/* Rutas de autenticación */}
              <Route path="/" element={<AuthLayout />}>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route index element={<Navigate to="/login" />} />
              </Route>

              {/* Rutas protegidas de la aplicación principal */}
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<DashboardLayout />}> {/* <-- Reemplazamos AppLayout */}
                  <Route index element={<Dashboard />} /> {/* Este es el punto de entrada que redirige */}
                  {/* Rutas anidadas que se renderizarán dentro de <Dashboard /> */}
                  <Route path="addresses" element={<AddressList />} />
                  <Route path="payments/:houseId" element={<PaymentList />} />
                  <Route path="invoices/:houseId/:month/:year" element={<InvoiceList />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="change-password" element={<ChangePassword />} />
                  <Route path="config/users" element={<UserList />} />
                  <Route path="config" element={<ConfigurationPage />} />
                  <Route path="config/concepts" element={<ConceptManagementPage />} />
                  <Route path="config/statuses" element={<StatusManagementPage />} />
                  <Route path="config/type-houses" element={<TypeHouseManagementPage />} />
                  <Route path="config/type-payments" element={<TypePaymentManagementPage />} />
                  <Route path="config/currencies" element={<CurrencyManagementPage />} />
                </Route>
              </Route>
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </CustomThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;