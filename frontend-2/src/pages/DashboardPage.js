import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Bienvenido al Dashboard</h1>
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
        {/* Botón para Gestión de Libros */}
        <div
          style={{
            width: "200px",
            padding: "20px",
            backgroundColor: "#007BFF",
            color: "#fff",
            borderRadius: "10px",
            cursor: "pointer",
            textAlign: "center",
          }}
          onClick={() => navigate("/books")}
        >
          <h3>Gestión de Libros</h3>
        </div>

        {/* Botón para Gestión de Usuarios */}
        <div
          style={{
            width: "200px",
            padding: "20px",
            backgroundColor: "#28A745",
            color: "#fff",
            borderRadius: "10px",
            cursor: "pointer",
            textAlign: "center",
          }}
          onClick={() => navigate("/users")}
        >
          <h3>Gestión de Usuarios</h3>
        </div>

        {/* Botón para Gestión de Préstamos */}
        <div
          style={{
            width: "200px",
            padding: "20px",
            backgroundColor: "#FFC107",
            color: "#fff",
            borderRadius: "10px",
            cursor: "pointer",
            textAlign: "center",
          }}
          onClick={() => navigate("/loans")}
        >
          <h3>Gestión de Préstamos</h3>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
