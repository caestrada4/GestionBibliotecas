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

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    quantity: "",
  });
  const [editBook, setEditBook] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await API.get("/books");
      setBooks(response.data);
    } catch (error) {
      console.error("Error al obtener libros:", error);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleFilterCategory = (e) => {
    setFilterCategory(e.target.value);
  };

  const handleFilterStatus = (e) => {
    setFilterStatus(e.target.value);
  };

  const handleNewBookChange = (e) => {
    const { name, value } = e.target;
    setNewBook((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddBook = async () => {
    try {
      await API.post("/books", newBook);
      fetchBooks();
      setNewBook({ title: "", author: "", isbn: "", category: "", quantity: "" });
    } catch (error) {
      console.error("Error al agregar el libro:", error);
    }
  };

  const handleEditBookOpen = (book) => {
    setEditBook(book);
    setIsEditOpen(true);
  };

  const handleEditBookClose = () => {
    setEditBook(null);
    setIsEditOpen(false);
  };

  const handleEditBookChange = (e) => {
    const { name, value } = e.target;
    setEditBook((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditBookSave = async () => {
    try {
      await API.put(`/books/${editBook.id}`, editBook);
      fetchBooks();
      handleEditBookClose();
    } catch (error) {
      console.error("Error al editar el libro:", error);
    }
  };

  const handleDeleteBook = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este libro?")) {
      try {
        await API.delete(`/books/${id}`);
        setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
      } catch (error) {
        console.error("Error al eliminar el libro:", error);
      }
    }
  };

  const filteredBooks = books
    .filter((book) => {
      const lowerSearch = search.toLowerCase();
      return (
        book?.title?.toLowerCase().includes(lowerSearch) ||
        book?.author?.toLowerCase().includes(lowerSearch) ||
        book?.isbn?.includes(lowerSearch)
      );
    })
    .filter((book) => (filterCategory ? book.category === filterCategory : true))
    .filter((book) => (filterStatus ? book.status === filterStatus : true));

  // Lógica de paginación
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBooks = filteredBooks.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Libros
      </Typography>
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <TextField
          label="Buscar por título, autor o ISBN"
          variant="outlined"
          value={search}
          onChange={handleSearch}
          style={{ flex: 1 }}
        />
        <FormControl variant="outlined" style={{ minWidth: "150px" }}>
          <InputLabel>Categoría</InputLabel>
          <Select value={filterCategory} onChange={handleFilterCategory} label="Categoría">
            <MenuItem value="">Todas</MenuItem>
            <MenuItem value="Ficción">Ficción</MenuItem>
            <MenuItem value="No Ficción">No Ficción</MenuItem>
            <MenuItem value="Infantil">Infantil</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" style={{ minWidth: "150px" }}>
          <InputLabel>Estado</InputLabel>
          <Select value={filterStatus} onChange={handleFilterStatus} label="Estado">
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="Disponible">Disponible</MenuItem>
            <MenuItem value="Prestado">Prestado</MenuItem>
          </Select>
        </FormControl>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Autor</TableCell>
              <TableCell>ISBN</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedBooks.map((book) => (
              <TableRow key={book.id}>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.isbn}</TableCell>
                <TableCell>{book.category}</TableCell>
                <TableCell>{book.quantity}</TableCell>
                <TableCell>
                  <Button color="primary" onClick={() => handleEditBookOpen(book)}>
                    Editar
                  </Button>
                  <Button color="secondary" onClick={() => handleDeleteBook(book.id)}>
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación */}
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
      </Box>

      {/* Formulario para agregar un nuevo libro */}
      <div style={{ marginTop: "20px" }}>
        <Typography variant="h6">Agregar un nuevo libro</Typography>
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <TextField
            label="Título"
            name="title"
            value={newBook.title}
            onChange={handleNewBookChange}
            variant="outlined"
          />
          <TextField
            label="Autor"
            name="author"
            value={newBook.author}
            onChange={handleNewBookChange}
            variant="outlined"
          />
          <TextField
            label="ISBN"
            name="isbn"
            value={newBook.isbn}
            onChange={handleNewBookChange}
            variant="outlined"
          />
          <TextField
            label="Categoría"
            name="category"
            value={newBook.category}
            onChange={handleNewBookChange}
            variant="outlined"
          />
          <TextField
            label="Cantidad"
            name="quantity"
            value={newBook.quantity}
            onChange={handleNewBookChange}
            variant="outlined"
            type="number"
          />
          <Button variant="contained" color="primary" onClick={handleAddBook}>
            Agregar
          </Button>
        </div>
      </div>

      {/* Diálogo para editar un libro */}
      <Dialog open={isEditOpen} onClose={handleEditBookClose}>
        <DialogTitle>Editar Libro</DialogTitle>
        <DialogContent>
          <TextField
            label="Título"
            name="title"
            value={editBook?.title || ""}
            onChange={handleEditBookChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Autor"
            name="author"
            value={editBook?.author || ""}
            onChange={handleEditBookChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="ISBN"
            name="isbn"
            value={editBook?.isbn || ""}
            onChange={handleEditBookChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Categoría"
            name="category"
            value={editBook?.category || ""}
            onChange={handleEditBookChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Cantidad"
            name="quantity"
            value={editBook?.quantity || ""}
            onChange={handleEditBookChange}
            fullWidth
            margin="dense"
            type="number"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditBookClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleEditBookSave} color="primary">
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BooksPage;
