import React, { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api"; // Importamos la instancia de axios configurada

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [libraryId, setLibraryId] = useState(null); // Nuevo estado para el library_id

  const [loading, setLoading] = useState(true); // Indicador de carga inicial
  const navigate = useNavigate();

  // Función para cerrar sesión
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setLibraryId(null); // Limpiar el library_id al cerrar sesión

    localStorage.removeItem("token");
    localStorage.removeItem("library_id");

    delete API.defaults.headers.common["Authorization"]; // Eliminamos el token de las cabeceras
    navigate("/login"); // Redirigir al Login
  }, [navigate]);

  // Validar el token con el backend al cargar la aplicación
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      API.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`; // Configuramos el token para todas las solicitudes
      API.get("/auth/validate") // Endpoint para validar el token
        .then((response) => {
          setUser(response.data.user); // Configuramos el usuario si el token es válido
          setToken(storedToken);
        })
        .catch((error) => {
          console.error("Error al validar el token:", error.response?.data || error.message);
          logout(); // Si la validación falla, cerrar sesión
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false); // Finaliza la carga si no hay token
    }
  }, [logout]);

  // Función para iniciar sesión
  const login = async (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    setLibraryId(libraryId); // Guardar el library_id cuando el usuario inicia sesión
    localStorage.setItem("token", tokenData);
    localStorage.setItem("library_id", libraryId);

    API.defaults.headers.common["Authorization"] = `Bearer ${tokenData}`; // Configuramos el token para futuras solicitudes
    navigate("/"); // Redirigir al Dashboard
  };

  if (loading) {
    // Muestra un indicador mientras se valida el token
    return <div>Cargando...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, token, libraryId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
