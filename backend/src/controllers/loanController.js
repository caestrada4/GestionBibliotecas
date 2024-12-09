const Loan = require('../models/loan');
const Book = require('../models/book');
const User = require('../models/user');
const sequelize = require('../config/config'); // Asegúrate de tener la configuración de Sequelize

// Crear un préstamo
exports.createLoan = async (req, res) => {
  const { userId, bookId, loanDate, returnDate } = req.body;

  // Verificación si los valores userId o bookId están vacíos o son nulos
  if (!userId || !bookId || !loanDate || !returnDate) {
    return res.status(400).json({ message: "Por favor, complete todos los campos (usuario, libro, fecha de préstamo y devolución)" });
  }

  const transaction = await sequelize.transaction();
  try {
    // Validar que el usuario existe
    const user = await User.findByPk(userId);
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Validar que el libro existe
    const book = await Book.findByPk(bookId);
    if (!book) {
      await transaction.rollback();
      return res.status(404).json({ message: 'El libro no existe' });
    }

    // Validar si el libro está disponible
    if (!book.available) {
      await transaction.rollback();
      return res.status(400).json({ message: 'El libro no está disponible' });
    }

    // Crear préstamo
    const loan = await Loan.create(
      { userId, bookId, loanDate, returnDate },
      { transaction }
    );

    // Actualizar estado del libro a no disponible
    await Book.update(
      { available: false },
      { where: { id: bookId }, transaction }
    );

    await transaction.commit();
    res.status(201).json({
      message: 'Préstamo creado con éxito',
      loan,
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al crear el préstamo:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};



// Registrar la devolución de un préstamo
exports.returnLoan = async (req, res) => {
  try {
    const { id } = req.params;
    const loan = await Loan.findByPk(id, { include: [{ model: Book }] });
    if (!loan) {
      return res.status(404).json({ message: 'Préstamo no encontrado' });
    }

    if (loan.returnDate) {
      return res.status(400).json({ message: 'El préstamo ya fue devuelto' });
    }

    const today = new Date();
    let fine = 0;
    if (loan.returnDate && today > new Date(loan.returnDate)) {
      const diffDays = Math.ceil(
        (today - new Date(loan.returnDate)) / (1000 * 60 * 60 * 24)
      );
      fine = diffDays * 2; // Multa de 2 unidades por día
    }

    await loan.Book.update({ available: true });
    loan.returnDate = today;
    await loan.save();

    res.json({
      message: `Libro devuelto con éxito. Multa: ${fine} unidades`,
      fine,
    });
  } catch (error) {
    console.error('Error al registrar la devolución:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener préstamos activos
exports.getActiveLoans = async (req, res) => {
  try {
    const loans = await Loan.findAll({
      where: { returnDate: null }, // Solo préstamos activos
      include: [
        { model: User, attributes: ['id', 'name', 'email'] }, // Información del usuario
        { model: Book, attributes: ['id', 'title', 'author'] }, // Información del libro
      ],
    });

    if (!loans || loans.length === 0) {
      return res.status(404).json({ message: 'No hay préstamos activos' });
    }

    res.json(loans);
  } catch (error) {
    console.error('Error al obtener préstamos activos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener historial de préstamos de un usuario
exports.getUserLoanHistory = async (req, res) => {
  const { userId } = req.params;
  try {
    const loans = await Loan.findAll({
      where: { userId },
      include: [{ model: Book, attributes: ['id', 'title', 'author'] }],
    });

    if (!loans || loans.length === 0) {
      return res.status(404).json({ message: 'No se encontró historial de préstamos' });
    }

    res.json(loans);
  } catch (error) {
    console.error('Error al obtener el historial del usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
