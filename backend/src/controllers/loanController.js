const { Sequelize } = require('sequelize');
const Loan = require('../models/loan');
const Book = require('../models/book');
const User = require('../models/user');

exports.createLoan = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { userId, bookId, loanDate, returnDate } = req.body;

    // Validar que el usuario existe
    const user = await User.findByPk(userId);
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Validar que el libro está disponible
    const book = await Book.findByPk(bookId);
    if (!book) {
      await transaction.rollback();
      return res.status(404).json({ message: 'El libro no existe' });
    }
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

exports.returnLoan = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar que el préstamo existe
    const loan = await Loan.findByPk(id, { include: [Book] });
    if (!loan) return res.status(404).json({ message: 'Préstamo no encontrado' });

    // Validar si el préstamo ya fue devuelto
    if (loan.returnDate) {
      return res.status(400).json({ message: 'El préstamo ya fue devuelto' });
    }

    // Calcular multa si aplica
    const today = new Date();
    let fine = 0;
    if (loan.returnDate && today > new Date(loan.returnDate)) {
      const diffDays = Math.ceil(
        (today - new Date(loan.returnDate)) / (1000 * 60 * 60 * 24)
      );
      fine = diffDays * 2; // Multa de 2 unidades por día
    }

    // Actualizar el estado del libro y del préstamo
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

exports.getActiveLoans = async (req, res) => {
  try {
    const loans = await Loan.findAll({
      where: { returnDate: null },
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        { model: Book, attributes: ['id', 'title', 'author'] },
      ],
    });

    if (loans.length === 0) {
      return res.status(404).json({ message: 'No hay préstamos activos' });
    }

    const formattedLoans = loans.map((loan) => ({
      loanId: loan.id,
      user: { id: loan.User.id, name: loan.User.name, email: loan.User.email },
      book: { id: loan.Book.id, title: loan.Book.title, author: loan.Book.author },
      loanDate: loan.loanDate,
    }));

    res.json(formattedLoans);
  } catch (error) {
    console.error('Error al obtener préstamos activos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.getUserLoanHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const loans = await Loan.findAll({
      where: { userId },
      include: [{ model: Book, attributes: ['id', 'title', 'author'] }],
    });

    if (loans.length === 0) {
      return res
        .status(404)
        .json({ message: 'No hay historial de préstamos para este usuario' });
    }

    const formattedHistory = loans.map((loan) => ({
      loanId: loan.id,
      book: { id: loan.Book.id, title: loan.Book.title, author: loan.Book.author },
      loanDate: loan.loanDate,
      returnDate: loan.returnDate,
    }));

    res.json(formattedHistory);
  } catch (error) {
    console.error('Error al obtener el historial del usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
