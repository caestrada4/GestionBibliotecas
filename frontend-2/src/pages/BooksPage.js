import React, { useState, useEffect } from "react";
import API from "../api/api";
import { jwtDecode } from "jwt-decode";
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
    category: "",
    available: true,
    library_id: "",  // Añadir el campo library_id
  });
  const [editBook, setEditBook] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Obtener el library_id del token JWT
  const getLibraryIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      return decoded.library_id; // Usamos el library_id del token
    }
    return null;
  };

  const libraryId = getLibraryIdFromToken(); // Obtener el library_id

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await API.get("/books");
      const sortedBooks = response.data.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
      setBooks(sortedBooks);
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

  const handleAddBookOpen = () => {
    setNewBook((prev) => ({ ...prev, library_id: libraryId })); // Asignar el library_id al libro
    setIsAddOpen(true);
  };

  const handleAddBookClose = () => {
    setNewBook({ title: "", author: "", category: "", available: true, library_id: libraryId });
    setIsAddOpen(false);
  };

  const handleAddBook = async () => {
    try {
      await API.post("/books", newBook); // El nuevo libro ahora incluye el library_id
      fetchBooks();
      handleAddBookClose();
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
        book?.author?.toLowerCase().includes(lowerSearch)
      );
    })
    .filter((book) => (filterCategory ? book.category === filterCategory : true))
    .filter((book) => (filterStatus ? book.available.toString() === filterStatus : true));

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
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <TextField
          label="Buscar por título o autor"
          variant="outlined"
          value={search}
          onChange={handleSearch}
          style={{ flex: 1, marginRight: "20px" }}
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
            <MenuItem value="true">Disponible</MenuItem>
            <MenuItem value="false">No disponible</MenuItem>
          </Select>
        </FormControl>
      </div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddBookOpen}
        style={{ marginBottom: "20px" }}
      >
        Agregar Libro
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Autor</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Disponible</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedBooks.map((book) => (
              <TableRow key={book.id}>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.category}</TableCell>
                <TableCell>
                  {book.available ? "Disponible" : "No disponible"}
                </TableCell>
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

      <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
      </Box>

      {/* Modal para agregar un nuevo libro */}
      <Dialog open={isAddOpen} onClose={handleAddBookClose}>
        <DialogTitle>Agregar Nuevo Libro</DialogTitle>
        <DialogContent>
          <TextField
            label="Título"
            name="title"
            value={newBook.title}
            onChange={handleNewBookChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Autor"
            name="author"
            value={newBook.author}
            onChange={handleNewBookChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Categoría"
            name="category"
            value={newBook.category}
            onChange={handleNewBookChange}
            fullWidth
            margin="dense"
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Disponible</InputLabel>
            <Select
              name="available"
              value={newBook.available}
              onChange={(e) =>
                setNewBook((prev) => ({ ...prev, available: e.target.value }))
              }
            >
              <MenuItem value={true}>Disponible</MenuItem>
              <MenuItem value={false}>No disponible</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddBookClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleAddBook} color="primary">
            Agregar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para editar un libro */}
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
            label="Categoría"
            name="category"
            value={editBook?.category || ""}
            onChange={handleEditBookChange}
            fullWidth
            margin="dense"
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Disponible</InputLabel>
            <Select
              name="available"
              value={editBook?.available || ""}
              onChange={(e) =>
                setEditBook((prev) => ({ ...prev, available: e.target.value }))
              }
            >
              <MenuItem value={true}>Disponible</MenuItem>
              <MenuItem value={false}>No disponible</MenuItem>
            </Select>
          </FormControl>
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
