const Book = require('../models/book');
const { verifyToken } = require('../middlewares/authMiddleware'); // Importa el middleware de autenticación si es necesario

// Obtener todos los libros de la biblioteca del usuario autenticado
exports.getAllBooks = async (req, res) => {
  try {
    const library_id = req.user.library_id; // Obtener el library_id del usuario autenticado

    // Verificar si el library_id está disponible
    if (!library_id) {
      return res.status(400).json({ message: 'El library_id no está disponible.' });
    }

    // Obtener los libros donde el library_id coincida
    const books = await Book.findAll({
      where: { library_id }, // Filtrar los libros por el library_id del usuario autenticado
    });

    if (books.length === 0) {
      return res.status(404).json({ message: 'No se encontraron libros para esta biblioteca.' });
    }

    res.json(books);
  } catch (error) {
    console.error("Error al obtener los libros:", error);
    res.status(500).json({ message: 'Error al obtener los libros', error });
  }
};

// Obtener un libro por ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ message: 'Libro no encontrado' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el libro', error });
  }
};

// Crear un libro
exports.createBook = async (req, res) => {
  try {
    const { title, author, category, available } = req.body;
    const library_id = req.user.library_id; // Obtener el library_id del usuario autenticado

    // Verificar que el library_id está disponible
    if (!library_id) {
      return res.status(400).json({ message: 'El ID de la biblioteca no está disponible.' });
    }

    // Crear el libro con el library_id asociado
    const book = await Book.create({
      title,
      author,
      category,
      available,
      library_id,  // Asociar el libro con el library_id del usuario autenticado
    });

    res.status(201).json(book);
  } catch (error) {
    console.error("Error al crear el libro:", error);
    res.status(500).json({ message: "Error al crear el libro", error });
  }
};

// Actualizar un libro
exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Book.update(req.body, { where: { id } });

    if (!updated) return res.status(404).json({ message: 'Libro no encontrado' });
    res.json({ message: 'Libro actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el libro', error });
  }
};

// Eliminar un libro
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Book.destroy({ where: { id } });

    if (!deleted) return res.status(404).json({ message: 'Libro no encontrado' });
    res.json({ message: 'Libro eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el libro', error });
  }
};
