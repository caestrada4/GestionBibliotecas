// frontend-2/src/pages/AdminPanel.js
import React, { useState } from "react";
import API from "../api/api";
import { TextField, Button, Typography } from "@mui/material";

const AdminPanel = () => {
  const [libraryName, setLibraryName] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleCreateLibrary = async () => {
    try {
      const response = await API.post("/libraries", { name: libraryName });
      alert("Librería creada con éxito");
      setLibraryName("");
      console.log("Librería creada:", response.data);
    } catch (error) {
      console.error("Error al crear la librería:", error);
    }
  };

  const handleAssignUser = async () => {
    try {
      await API.put(`/users/${selectedUser.id}/assign-library`, { libraryId: "newLibraryId" });
      alert("Usuario asignado correctamente a la librería");
    } catch (error) {
      console.error("Error al asignar usuario:", error);
    }
  };

  return (
    <div>
      <Typography variant="h4">Administrador de Librerías</Typography>
      <TextField
        label="Nombre de la nueva librería"
        value={libraryName}
        onChange={(e) => setLibraryName(e.target.value)}
      />
      <Button variant="contained" onClick={handleCreateLibrary}>Crear Librería</Button>
      <div>
        <h5>Asignar Usuario a la Librería</h5>
        <select onChange={(e) => setSelectedUser(JSON.parse(e.target.value))}>
          <option value="">Seleccionar Usuario</option>
          {users.map((user) => (
            <option key={user.id} value={JSON.stringify(user)}>
              {user.name}
            </option>
          ))}
        </select>
        <Button variant="contained" onClick={handleAssignUser}>Asignar Usuario</Button>
      </div>
    </div>
  );
};

export default AdminPanel;
