import React, { useState, useEffect } from "react";
import API from "../api/api";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Pagination,
  Box,
} from "@mui/material";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [libraries, setLibraries] = useState([]); // Lista de librerías
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    userType: "",
    role: "user",
    isSuspended: false,
    suspensionReason: "",
    library_id: "", // Agregar librería
  });
  const [editUser, setEditUser] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [selectedLibrary, setSelectedLibrary] = useState(""); // Filtro por librería

  useEffect(() => {
    fetchUsers();
    fetchLibraries();
  }, [selectedLibrary]);
  
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token'); // Recuperar el token de localStorage
  
      // Verificar que el token esté disponible
      if (!token) {
        console.error("No se encontró el token");
        return;
      }
  
      // Realizar la solicitud GET para obtener los usuarios
      const response = await API.get("/users", {
        headers: {
          Authorization: `Bearer ${token}`,  // Enviar el token en los encabezados de la solicitud
        },
        params: { library_id: selectedLibrary },  // Enviar el library_id para filtrar usuarios
      });
  
      setUsers(response.data); // Almacenar los usuarios en el estado
    } catch (error) {
      console.error("Error al obtener usuarios:", error.response?.data || error.message);
      // Puedes agregar aquí un mensaje para mostrar al usuario si el error fue muy específico.
    }
  };
  
  

  const fetchLibraries = async () => {
    try {
      const response = await API.get("/libraries"); // Asegúrate de tener esta API para obtener librerías
      setLibraries(response.data);
    } catch (error) {
      console.error("Error al obtener librerías:", error);
    }
  };

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async () => {
    try {
      await API.post("/users", newUser);
      fetchUsers();
      setNewUser({
        name: "",
        email: "",
        password: "",
        userType: "",
        role: "user",
        isSuspended: false,
        suspensionReason: "",
        library_id: "", // Reset
      });
    } catch (error) {
      console.error("Error al agregar usuario:", error);
    }
  };

  const handleEditUserOpen = (user) => {
    setEditUser(user);
    setIsEditOpen(true);
  };

  const handleEditUserClose = () => {
    setEditUser(null);
    setIsEditOpen(false);
  };

  const handleEditUserChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditUserSave = async () => {
    try {
      await API.put(`/users/${editUser.id}`, editUser);
      fetchUsers();
      handleEditUserClose();
    } catch (error) {
      console.error("Error al editar usuario:", error);
    }
  };

  const handleSuspendUser = async (id) => {
    const justification = prompt("Proporcione una justificación para suspender al usuario:");
    if (justification) {
      try {
        await API.put(`/users/${id}/suspend`, { justification });
        fetchUsers();
      } catch (error) {
        console.error("Error al suspender usuario:", error);
      }
    }
  };

  const handleUnsuspendUser = async (id) => {
    try {
      await API.put(`/users/${id}/unsuspend`);
      fetchUsers();
    } catch (error) {
      console.error("Error al reactivar usuario:", error);
    }
  };

  const paginatedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Usuarios
      </Typography>

      {/* Filtro por librería */}
      <FormControl fullWidth margin="dense">
        <InputLabel>Librería</InputLabel>
        <Select
          value={selectedLibrary}
          onChange={(e) => setSelectedLibrary(e.target.value)}
          label="Librería"
        >
          <MenuItem value="">Todas</MenuItem>
          {libraries.map((library) => (
            <MenuItem key={library.id} value={library.id}>
              {library.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TableContainer component={Paper} style={{ marginBottom: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.userType}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  {user.isSuspended ? `Suspendido: ${user.suspensionReason}` : "Activo"}
                </TableCell>
                <TableCell>
                  <Button color="primary" onClick={() => handleEditUserOpen(user)}>
                    Editar
                  </Button>
                  {user.isSuspended ? (
                    <Button color="primary" onClick={() => handleUnsuspendUser(user.id)}>
                      Reactivar
                    </Button>
                  ) : (
                    <Button color="secondary" onClick={() => handleSuspendUser(user.id)}>
                      Suspender
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
      </Box>

      {/* Formulario para agregar un nuevo usuario */}
      <div style={{ marginTop: "20px" }}>
        <Typography variant="h6">Registrar un nuevo usuario</Typography>
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <TextField
            label="Nombre"
            name="name"
            value={newUser.name}
            onChange={handleNewUserChange}
            variant="outlined"
          />
          <TextField
            label="Correo"
            name="email"
            value={newUser.email}
            onChange={handleNewUserChange}
            variant="outlined"
          />
          <TextField
            label="Contraseña"
            name="password"
            type="password"
            value={newUser.password}
            onChange={handleNewUserChange}
            variant="outlined"
          />
          <TextField
            label="Tipo"
            name="userType"
            value={newUser.userType}
            onChange={handleNewUserChange}
            variant="outlined"
          />
          <FormControl variant="outlined" style={{ minWidth: "150px" }}>
            <InputLabel>Rol</InputLabel>
            <Select
              name="role"
              value={newUser.role}
              onChange={handleNewUserChange}
              label="Rol"
            >
              <MenuItem value="user">Usuario</MenuItem>
              <MenuItem value="librarian">Bibliotecario</MenuItem>
              <MenuItem value="admin">Administrador</MenuItem>
            </Select>
          </FormControl>

          {/* Seleccionar la librería para el usuario */}
          <FormControl variant="outlined" style={{ minWidth: "150px" }}>
            <InputLabel>Librería</InputLabel>
            <Select
              name="library_id"
              value={newUser.library_id}
              onChange={handleNewUserChange}
              label="Librería"
            >
              {libraries.map((library) => (
                <MenuItem key={library.id} value={library.id}>
                  {library.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button variant="contained" color="primary" onClick={handleAddUser}>
            Agregar
          </Button>
        </div>
      </div>

      {/* Editar usuario */}
      <Dialog open={isEditOpen} onClose={handleEditUserClose}>
        <DialogTitle>Editar Usuario</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre"
            name="name"
            value={editUser?.name || ""}
            onChange={handleEditUserChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Correo"
            name="email"
            value={editUser?.email || ""}
            onChange={handleEditUserChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Tipo"
            name="userType"
            value={editUser?.userType || ""}
            onChange={handleEditUserChange}
            fullWidth
            margin="dense"
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Rol</InputLabel>
            <Select
              name="role"
              value={editUser?.role || ""}
              onChange={handleEditUserChange}
              label="Rol"
            >
              <MenuItem value="user">Usuario</MenuItem>
              <MenuItem value="librarian">Bibliotecario</MenuItem>
              <MenuItem value="admin">Administrador</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditUserClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleEditUserSave} color="primary">
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UsersPage;
