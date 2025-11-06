import React, { createContext, useState, useMemo, useEffect, useContext, useRef } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import api from '../api/axiosConfig';

// Crear un contexto para el tema
export const ThemeContext = createContext({
  brightness: 100,
  setBrightness: () => {},
});

// Función para generar el tema dinámicamente basado en la luminosidad (0-100)
const generateTheme = (brightness) => {
  // Determinamos si es modo claro u oscuro basado en un umbral
  const mode = brightness > 50 ? 'light' : 'dark';
  
  // Calculamos el color de fondo usando HSL (Hue, Saturation, Lightness)
  // Esto nos da un gris que va de negro (0%) a blanco (100%)
  const backgroundColor = `hsl(0, 0%, ${brightness}%)`;
  
  // El color del "paper" (tarjetas, etc.) será ligeramente diferente para que se distinga
  const paperColor = mode === 'light' 
    ? `hsl(0, 0%, ${Math.max(0, brightness - 5)}%)` 
    : `hsl(0, 0%, ${Math.min(100, brightness + 5)}%)`;

  return createTheme({
    palette: {
      mode,
      background: {
        default: backgroundColor,
        paper: paperColor,
      },
    },
  });
};

export function CustomThemeProvider({ children }) {
  // AuthContext se importa aquí para evitar dependencia circular si AuthContext también usa ThemeContext
  const { AuthContext } = require('./AuthContext');
  const { authTokens } = useContext(AuthContext);
  const isSystemChange = useRef(false); // Ref para rastrear si el cambio es del sistema (login/logout)

  // Estado para mantener el modo actual, leyendo la preferencia guardada
  const [brightness, setBrightness] = useState(() => {
    try {
      const savedBrightness = localStorage.getItem('themeBrightness');
      // Si hay un valor guardado, lo usamos. Si no, por defecto es 100 (claro).
      return savedBrightness ? Number(savedBrightness) : 100;
    } catch (error) {
      console.error("No se pudo acceder a localStorage", error);
      return 100;
    }
  });

  // Efecto para sincronizar el brillo desde el perfil del usuario cuando inicia sesión
  useEffect(() => {
    // Se activa cuando el usuario inicia sesión
    if (authTokens?.theme_brightness !== undefined && authTokens?.theme_brightness !== null) {
      const userBrightness = Number(authTokens.theme_brightness);
      if (userBrightness !== brightness) {
        isSystemChange.current = true; // 1. Poner la bandera: "El sistema va a cambiar el brillo"
        setBrightness(userBrightness);
      }
    } else if (!authTokens) {
      // Se activa cuando el usuario cierra sesión
      isSystemChange.current = true; // 1. Poner la bandera: "El sistema va a cambiar el brillo"
      setBrightness(100);
    }
  }, [authTokens, brightness]); // <-- Añadimos 'brightness' para que el linter esté contento. La lógica interna ya previene bucles.

  // Efecto para guardar la preferencia cuando el usuario la cambia manualmente.
  useEffect(() => {
    // 2. Revisar la bandera: Si el cambio fue del sistema, no hacemos nada.
    if (isSystemChange.current) {
      isSystemChange.current = false; // Reseteamos la bandera para el próximo cambio manual.
      return; // Detenemos la ejecución para no guardar en la BD.
    }

    // Guardado instantáneo en localStorage para persistencia en el dispositivo
    try {
      localStorage.setItem('themeBrightness', brightness);
    } catch (error) {
      console.error("No se pudo acceder a localStorage", error);
    }

    // Guardar en el backend (con debounce) porque fue un cambio manual.
    const handler = setTimeout(() => {
      if (authTokens?.user_id && authTokens?.token) {
        const data = new FormData();
        data.append('theme_brightness', brightness);
        api.patch(`/user/setting/${authTokens.user_id}`, data).catch(error => {
          console.error('Error al guardar el brillo en el backend:', error);
        });
      }
    }, 500); // 500ms de retraso

    // Limpia el timeout si el valor de brillo cambia de nuevo antes de que se cumpla el retraso
    return () => clearTimeout(handler);
  }, [brightness, authTokens]);
  // Selecciona el objeto de tema correcto basado en el modo actual
  const theme = useMemo(() => generateTheme(brightness), [brightness]);

  return (
    <ThemeContext.Provider value={{ brightness, setBrightness }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline /> {/* Normaliza los estilos y aplica el color de fondo del tema */}
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}