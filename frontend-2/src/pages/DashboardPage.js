import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Box, Button, Card, CardContent, Typography, Grid } from "@mui/material";

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Accede al usuario desde el contexto

  const sections = [
    {
      title: "Gestión de Libros",
      color: "#007BFF",
      path: "/books",
    },
    {
      title: "Gestión de Usuarios",
      color: "#28A745",
      path: "/users",
    },
    {
      title: "Gestión de Préstamos",
      color: "#FFC107",
      path: "/loans",
    },
  ];

  return (
    <Box sx={{ padding: "20px", textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Bienvenido, {user?.name || "Usuario"}
      </Typography>
      <Grid container spacing={3} justifyContent="center" mt={2}>
        {sections.map((section, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                backgroundColor: section.color,
                color: "#fff",
                cursor: "pointer",
                borderRadius: "10px",
                "&:hover": {
                  boxShadow: 6,
                },
              }}
              onClick={() => navigate(section.path)}
            >
              <CardContent>
                <Typography variant="h6" align="center">
                  {section.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box mt={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/")}
        >
          Volver al Inicio
        </Button>
      </Box>
    </Box>
  );
}

export default Dashboard;
