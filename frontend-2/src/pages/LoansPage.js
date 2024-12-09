import React, { useState, useEffect } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import API from "../api/api"; // Usar API existente para las operaciones REST

const LoansPage = () => {
  const [loans, setLoans] = useState([]);
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [history, setHistory] = useState([]);
  const [newLoan, setNewLoan] = useState({
    bookId: "",
    userId: "",
    returnDate: "",
  });
  const [selectedUserId, setSelectedUserId] = useState("");
  const [isLoanDialogOpen, setIsLoanDialogOpen] = useState(false);

  useEffect(() => {
    fetchActiveLoans();
    fetchBooks();
    fetchUsers();
  }, []);

  // Fetch active loans from the backend (REST API)
  const fetchActiveLoans = async () => {
    try {
      const token = localStorage.getItem("token"); // Asegúrate de que el token esté guardado correctamente
      const response = await API.get("/loans/active", {
        headers: {
          Authorization: `Bearer ${token}`, // Agrega el token en la cabecera Authorization
        },
      });
      console.log("Datos obtenidos de préstamos activos:", response.data);
      setLoans(response.data || []);
    } catch (error) {
      console.error("Error al obtener préstamos activos:", error);
    }
  };

  // Fetch available books from the backend (REST API)
  const fetchBooks = async () => {
    try {
      const response = await API.get("/books");
      setBooks(response.data.filter((book) => book.available));
    } catch (error) {
      console.error("Error al obtener libros:", error);
    }
  };

  // Fetch users from the backend (REST API)
  const fetchUsers = async () => {
    try {
      const response = await API.get("/users");
      setUsers(response.data.filter((user) => !user.isSuspended));
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  // Fetch loan history of a user
  const fetchUserLoanHistory = async (userId) => {
    try {
      const response = await API.get(`/loans/history/${userId}`);
      setHistory(response.data || []); // Ajustar según el formato devuelto por REST
    } catch (error) {
      console.error("Error al obtener historial de préstamos:", error);
    }
  };

  // Handle input changes for new loan form
// Asegurándote de que el valor de bookId y userId se actualicen correctamente
const handleNewLoanChange = (e) => {
    const { name, value } = e.target;
    setNewLoan((prev) => ({ ...prev, [name]: value }));
  };
  
  // Manejo de la creación de préstamo
  const handleAddLoan = async () => {
    const { userId, bookId, returnDate } = newLoan;
  
    // Validación de los campos antes de enviar la solicitud
    if (!userId || !bookId || !returnDate) {
      alert("Por favor, selecciona un usuario, un libro y una fecha de devolución.");
      return;
    }
  
    try {
      // Imprimir para depurar
      console.log("Datos enviados para crear el préstamo:", newLoan);
  
      // Enviar la solicitud POST con los valores correctos
      await API.post("/loans", {
        userId,    // Verifica que el ID del usuario se pase correctamente
        bookId,    // Verifica que el ID del libro se pase correctamente
        loanDate: new Date().toISOString(),
        returnDate,
      });
  
      // Actualizar la lista de préstamos activos después de registrar uno
      fetchActiveLoans();
      setIsLoanDialogOpen(false);
      setNewLoan({ bookId: "", userId: "", returnDate: "" }); // Limpiar el formulario
    } catch (error) {
      console.error("Error al registrar el préstamo:", error);
    }
  };
  
  
  

  // Handle returning a loan
  const handleReturnLoan = async (loanId) => {
    try {
      if (!loanId) {
        console.error("No se encontró el ID del préstamo");
        return;
      }
      // Realizar la solicitud PUT con el loanId correcto
      await API.put(`/loans/${loanId}/return`);
      fetchActiveLoans();
      fetchBooks();
    } catch (error) {
      console.error("Error al registrar devolución:", error);
    }
  };

  // Handle user loan history
  const handleUserHistory = (userId) => {
    setSelectedUserId(userId);
    fetchUserLoanHistory(userId);
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Préstamos
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => setIsLoanDialogOpen(true)}
        sx={{ marginBottom: "20px" }}
      >
        Registrar Préstamo
      </Button>

      <Typography variant="h6" gutterBottom>
        Préstamos Activos
      </Typography>
      <TableContainer component={Paper} sx={{ marginBottom: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Libro</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell>Fecha de Préstamo</TableCell>
              <TableCell>Fecha de Devolución</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Multa</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loans.length > 0 ? (
              loans.map((loan) => (
                <TableRow key={loan.loanId}> {/* key prop added */}
                  <TableCell>{loan.book ? loan.book.title : "Sin título"}</TableCell> {/* Correct key mapping */}
                  <TableCell>{loan.user ? loan.user.name : "Sin nombre"}</TableCell> {/* Correct key mapping */}
                  <TableCell>
                    {loan.loanDate
                      ? new Date(loan.loanDate).toLocaleDateString()
                      : "No registrada"}
                  </TableCell>
                  <TableCell>
                    {loan.returnDate
                      ? new Date(loan.returnDate).toLocaleDateString()
                      : "Pendiente"}
                  </TableCell>
                  <TableCell>
                    {loan.status === "active" ? "Activo" : "Devuelto"}
                  </TableCell>
                  <TableCell>{loan.fine ? `$${loan.fine}` : "$0.00"}</TableCell>
                  <TableCell>
                    {loan.status === "active" && (
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleReturnLoan(loan.loanId)}                       >
                        Registrar Devolución
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No hay préstamos activos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" gutterBottom>
        Historial de Préstamos
      </Typography>
      <FormControl fullWidth margin="dense">
        <InputLabel>Seleccionar Usuario</InputLabel>
        <Select
          value={selectedUserId}
          onChange={(e) => handleUserHistory(e.target.value)}
        >
          {users.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Libro</TableCell>
              <TableCell>Fecha de Préstamo</TableCell>
              <TableCell>Fecha de Devolución</TableCell>
              <TableCell>Multa</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.map((loan) => (
              <TableRow key={loan.loanId}> {/* key prop added */}
                <TableCell>{loan.book?.title}</TableCell> {/* Correct key mapping */}
                <TableCell>{loan.loanDate}</TableCell>
                <TableCell>{loan.returnDate || "Pendiente"}</TableCell>
                <TableCell>{loan.fine || "0.00"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={isLoanDialogOpen} onClose={() => setIsLoanDialogOpen(false)}>
        <DialogTitle>Registrar Préstamo</DialogTitle>
        <DialogContent>
        <FormControl fullWidth margin="dense">
            <InputLabel>Libro</InputLabel>
            <Select
                name="bookId"
                value={newLoan.bookId}
                onChange={handleNewLoanChange}  // Actualizar el bookId cuando se seleccione un libro
            >
                {books.map((book) => (
                <MenuItem key={book.id} value={book.id}>
                    {book.title}
                </MenuItem>
                ))}
            </Select>
            </FormControl>

            <FormControl fullWidth margin="dense">
            <InputLabel>Usuario</InputLabel>
            <Select
                name="userId"
                value={newLoan.userId}
                onChange={handleNewLoanChange}  // Actualizar el userId cuando se seleccione un usuario
            >
                {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                    {user.name}
                </MenuItem>
                ))}
            </Select>
        </FormControl>

          <TextField
            label="Fecha de Préstamo"
            name="loanDate"
            type="date"
            value={new Date().toISOString().split("T")[0]}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
            disabled
          />
          <TextField
            label="Fecha de Devolución"
            name="returnDate"
            type="date"
            value={newLoan.returnDate}
            onChange={handleNewLoanChange}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsLoanDialogOpen(false)} color="secondary">
            Cancelar
          </Button>
          <Button
            onClick={handleAddLoan}
            color="primary"
            disabled={!newLoan.bookId || !newLoan.userId || !newLoan.returnDate}
          >
            Registrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LoansPage;
