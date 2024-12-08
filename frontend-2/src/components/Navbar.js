import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext); // Obtener datos del usuario y función de logout
  const navigate = useNavigate();

  return (
    <AppBar position="static" style={{ marginBottom: "20px" }}>
      <Toolbar>
        {/* Enlaces de navegación */}
        <Box sx={{ flexGrow: 1, display: "flex", gap: "1rem" }}>
          <Button color="inherit" onClick={() => navigate("/")}>
            Inicio
          </Button>
          <Button color="inherit" onClick={() => navigate("/books")}>
            Libros
          </Button>
          <Button color="inherit" onClick={() => navigate("/users")}>
            Usuarios
          </Button>
          <Button color="inherit" onClick={() => navigate("/loans")}>
            Préstamos
          </Button>
        </Box>

        {/* Mostrar información del usuario */}
        {user && (
          <Typography
            variant="body1"
            style={{ marginRight: "20px", color: "white" }}
          >
            {user.name} ({user.role})
          </Typography>
        )}

        {/* Botón para cerrar sesión */}
        <Button color="inherit" onClick={logout}>
          Cerrar Sesión
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
