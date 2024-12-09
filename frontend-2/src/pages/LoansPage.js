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
import axios from "axios";

const REST_API_URL = "http://localhost:3000/api";
const SOAP_URL = "http://localhost:3000/loanService";

const LoansPage = () => {
  const [loans, setLoans] = useState([]);
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [newLoan, setNewLoan] = useState({
    bookId: "",
    userId: "",
    returnDate: "",
  });
  const [isLoanDialogOpen, setIsLoanDialogOpen] = useState(false);

  useEffect(() => {
    fetchLoans();
    fetchBooks();
    fetchUsers();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await axios.get(`${REST_API_URL}/loans/active`);
      setLoans(response.data);
    } catch (error) {
      console.error("Error al obtener préstamos:", error);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${REST_API_URL}/books`);
      setBooks(response.data.filter((book) => book.available)); // Solo libros disponibles
    } catch (error) {
      console.error("Error al obtener libros:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${REST_API_URL}/users`);
      setUsers(response.data.filter((user) => !user.isSuspended)); // Solo usuarios no suspendidos
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  const sendSOAPRequest = async (soapAction, soapBody) => {
    const headers = {
      "Content-Type": "text/xml;charset=UTF-8",
      SOAPAction: soapAction,
    };
    try {
      const response = await axios.post(SOAP_URL, soapBody, { headers });
      return response.data;
    } catch (error) {
      console.error("Error SOAP:", error);
      throw error;
    }
  };

  const handleNewLoanChange = (e) => {
    const { name, value } = e.target;
    setNewLoan((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddLoan = async () => {
    const { userId, bookId, returnDate } = newLoan;
    const soapBody = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://example.com/LoanService/">
        <soapenv:Header/>
        <soapenv:Body>
          <tns:CreateLoan>
            <userId>${userId}</userId>
            <bookId>${bookId}</bookId>
            <loanDate>${new Date().toISOString()}</loanDate>
            <returnDate>${returnDate}</returnDate>
          </tns:CreateLoan>
        </soapenv:Body>
      </soapenv:Envelope>
    `;

    try {
      await sendSOAPRequest(
        "http://example.com/LoanService/CreateLoan",
        soapBody
      );
      fetchLoans();
      setIsLoanDialogOpen(false);
      setNewLoan({ bookId: "", userId: "", returnDate: "" });
    } catch (error) {
      console.error("Error al registrar préstamo:", error);
    }
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
            </TableRow>
          </TableHead>
          <TableBody>
            {loans.map((loan) => (
              <TableRow key={loan.id}>
                <TableCell>{loan.bookTitle}</TableCell>
                <TableCell>{loan.userName}</TableCell>
                <TableCell>{loan.loanDate}</TableCell>
                <TableCell>{loan.returnDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal para Registrar Préstamo */}
      <Dialog open={isLoanDialogOpen} onClose={() => setIsLoanDialogOpen(false)}>
        <DialogTitle>Registrar Préstamo</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Libro</InputLabel>
            <Select
              name="bookId"
              value={newLoan.bookId}
              onChange={handleNewLoanChange}
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
              onChange={handleNewLoanChange}
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
          <Button onClick={handleAddLoan} color="primary">
            Registrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LoansPage;
