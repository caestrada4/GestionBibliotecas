const Loan = require('../models/loan');
const Book = require('../models/book');
const User = require('../models/user');

exports.createLoan = async (req, res) => {
  try {
    const { userId, bookId, loanDate, returnDate } = req.body;

    // Validar que el usuario existe
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Validar que el libro está disponible
    const book = await Book.findByPk(bookId);
    if (!book || !book.available) return res.status(400).json({ message: 'El libro no está disponible' });

    // Crear préstamo
    const loan = await Loan.create({ userId, bookId, loanDate, returnDate });
    await Book.update({ available: false }, { where: { id: bookId } });

    res.status(201).json(loan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.returnLoan = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar que el préstamo existe
    const loan = await Loan.findByPk(id);
    if (!loan) return res.status(404).json({ message: 'Préstamo no encontrado' });

    // Actualizar estado del libro y del préstamo
    await Book.update({ available: true }, { where: { id: loan.bookId } });
    loan.returnDate = new Date();
    await loan.save();

    res.json({ message: 'Libro devuelto con éxito' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getActiveLoans = async (req, res) => {
  try {
    const loans = await Loan.findAll({
      where: { returnDate: null },
      include: [{ model: User }, { model: Book }],
    });

    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserLoanHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const loans = await Loan.findAll({
      where: { userId },
      include: [{ model: Book }],
    });

    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
