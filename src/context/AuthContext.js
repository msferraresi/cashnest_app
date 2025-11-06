// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Correcto para v4+
import api from '../api/axiosConfig';

export const AuthContext = createContext();

// Para pruebas: haz que el modal aparezca 10 segundos antes de que expire la sesión.
const WARNING_TIME = 2 * 60 * 1000; // 10 segundos en milisegundos

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() => 
    localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
  );
  const [user, setUser] = useState(() => 
    localStorage.getItem('authTokens') ? jwtDecode(JSON.parse(localStorage.getItem('authTokens')).access) : null
  );
  const [loading, setLoading] = useState(true);

  // --- Estados para el modal de sesión ---
  const [isWarningModalOpen, setWarningModalOpen] = useState(false);
  const [countdown, setCountdown] = useState(WARNING_TIME / 1000);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null); // <-- Añadimos estado para errores de login
  // ------------------------------------

  const navigate = useNavigate();

  // Cambiamos la firma para aceptar email y password, no el evento 'e'
  const loginUser = async (email, password) => {
    setError(null); // Limpiamos errores previos
    try {
      // 1. Apuntamos al endpoint de login correcto de tu backend.
      const response = await api.post('/user/login', {
        email: email,
        password: password,
      });

      // 2. Adaptamos el código a la estructura de respuesta de tu backend.
      // La data útil viene dentro de `response.data.data`.
      const responseData = response.data.data;

      // 3. Creamos el objeto 'authTokens' con la estructura que espera el resto de la app.
      // Tu backend devuelve 'access_token', lo renombramos a 'access' para consistencia.
      const tokens = { 
        ...responseData, 
        access: responseData.access_token,
        refresh: responseData.refresh_token, // Guardamos el nuevo refresh_token
      };
      setAuthTokens(tokens);
      setUser(jwtDecode(tokens.access));
      localStorage.setItem('authTokens', JSON.stringify(tokens));
      navigate('/dashboard'); // Redirigimos al dashboard tras un login exitoso
    } catch (error) {
      console.error('Login failed:', error);
      // Establecemos un mensaje de error que se mostrará en la página de Login
      setError('Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.');
    }
  };

  const logoutUser = useCallback(() => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem('authTokens');
    setWarningModalOpen(false); // Asegúrate de cerrar el modal al desloguear
    navigate('/login');
  }, [navigate]);

  const refreshToken = async () => {
    // Si tu backend no devuelve un 'refresh' token, esta función fallará.
    if (!authTokens?.refresh) {
      console.error("No refresh token available. Logging out.");
      logoutUser();
      return;
    }

    setIsRefreshing(true);
    try {
      // 1. Apuntamos al nuevo endpoint y pasamos el refresh token en el header.
      const response = await api.post('/user/refresh', {}, {
        headers: { 'Authorization': `Bearer ${authTokens.refresh}` }
      });

      // 2. La respuesta del backend ahora contiene 'access_token'.
      const newAccessToken = response.data.access_token;

      // 3. Actualizamos solo el token de acceso, manteniendo el resto de datos.
      const newAuthTokens = { ...authTokens, access: newAccessToken };
      setAuthTokens(newAuthTokens);
      setUser(jwtDecode(newAccessToken)); // Corregido: usar newAccessToken
      localStorage.setItem('authTokens', JSON.stringify(newAuthTokens));
      
      setWarningModalOpen(false);
      setCountdown(WARNING_TIME / 1000);
    } catch (error) {
      console.error('Failed to refresh token', error);
      logoutUser(); // Si el refresh token también expiró, deslogueamos
    } finally {
      setIsRefreshing(false);
    }
  };

  // --- Lógica de temporizadores de sesión ---
  useEffect(() => {
    if (!authTokens) {
      return;
    }

    const accessToken = jwtDecode(authTokens.access);
    const expirationTime = (accessToken.exp * 1000) - Date.now();
    
    // 1. Temporizador para mostrar el modal de advertencia
    const warningTimer = setTimeout(() => {
      setWarningModalOpen(true);
    }, expirationTime - WARNING_TIME);

    // 2. Temporizador para desloguear si el token expira
    const logoutTimer = setTimeout(() => {
      logoutUser();
    }, expirationTime);

    // Limpieza de temporizadores
    return () => {
      clearTimeout(warningTimer);
      clearTimeout(logoutTimer);
    };
  }, [authTokens, logoutUser]);

  // --- Lógica de la cuenta regresiva del modal ---
  useEffect(() => {
    let interval;
    if (isWarningModalOpen && !isRefreshing) {
      interval = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(interval);
            logoutUser();
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWarningModalOpen, isRefreshing, logoutUser]);


  const contextData = {
    user,
    authTokens,
    loginUser,
    logoutUser,
    error, // <-- Exponemos el error al contexto
    // Exponemos los estados del modal para que otro componente los pueda usar
    isWarningModalOpen,
    countdown,
    isRefreshing,
    refreshToken,
  };

  useEffect(() => {
    if (loading) {
      setLoading(false);
    }
  }, [loading]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
