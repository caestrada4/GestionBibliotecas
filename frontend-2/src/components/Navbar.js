import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext); // Obtener datos del usuario y función de logout
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" sx={{ marginBottom: "20px" }}>
      <Toolbar>
        {/* Botón de menú para pantallas pequeñas */}
        <IconButton
          color="inherit"
          edge="start"
          sx={{ display: { xs: "block", md: "none" } }}
          onClick={handleMenuOpen}
        >
          <MenuIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => navigate("/")}>Inicio</MenuItem>
          <MenuItem onClick={() => navigate("/books")}>Libros</MenuItem>
          <MenuItem onClick={() => navigate("/users")}>Usuarios</MenuItem>
          <MenuItem onClick={() => navigate("/loans")}>Préstamos</MenuItem>
        </Menu>

        {/* Links de navegación para pantallas medianas y grandes */}
        <Box
          sx={{
            flexGrow: 1,
            display: { xs: "none", md: "flex" },
            gap: "1rem",
          }}
        >
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
          <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <AccountCircleIcon />
            <Typography variant="body1" sx={{ color: "white" }}>
              {user.name} ({user.role})
            </Typography>
          </Box>
        )}

        {/* Botón para cerrar sesión */}
        <Button
          color="inherit"
          onClick={logout}
          sx={{ marginLeft: { xs: "auto", md: "20px" } }}
        >
          Cerrar Sesión
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
