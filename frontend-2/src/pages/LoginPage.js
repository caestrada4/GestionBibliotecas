import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { login } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login: handleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email || !password) {
      setError("Todos los campos son obligatorios.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const data = await login(email, password);
      handleLogin(data.user, data.token); // Almacenar datos en el contexto
      navigate("/"); // Redirige al Dashboard
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Error al iniciar sesión. Inténtalo de nuevo.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: "50px auto",
        padding: 3,
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Iniciar Sesión
      </Typography>
      <form onSubmit={handleSubmit}>
        {error && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          label="Correo Electrónico"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
          autoComplete="username"
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
          autoComplete="current-password"
          sx={{ marginBottom: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          color="primary"
          disabled={loading}
          sx={{ padding: 1.5 }}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: "#fff" }} />
          ) : (
            "Ingresar"
          )}
        </Button>
      </form>
    </Box>
  );
};

export default LoginPage;
