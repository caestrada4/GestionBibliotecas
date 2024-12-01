const fs = require('fs');
const path = require('path');
const Loan = require('../models/loan');
const Book = require('../models/book');
const User = require('../models/user');

const loanService = {
  LoanService: {
    LoanPort: {
      // Crear un préstamo
      CreateLoan: async ({ userId, bookId, loanDate, returnDate }) => {
        try {
          // Validar que el usuario exista
          const user = await User.findByPk(userId);
          if (!user) {
            return { success: false, message: 'Usuario no encontrado' };
          }

          // Validar que el libro exista y esté disponible
          const book = await Book.findByPk(bookId);
          if (!book || !book.available) {
            return { success: false, message: 'El libro no está disponible' };
          }

          // Crear el préstamo
          const loan = await Loan.create({ userId, bookId, loanDate, returnDate });

          // Marcar el libro como no disponible
          await Book.update({ available: false }, { where: { id: bookId } });

          return { success: true, loanId: loan.id, message: 'Préstamo creado con éxito' };
        } catch (error) {
          return { success: false, message: error.message };
        }
      },

      // Registrar devolución de un libro
      ReturnLoan: async ({ loanId }) => {
        try {
          // Encontrar el préstamo
          const loan = await Loan.findByPk(loanId);
          if (!loan) {
            return { success: false, message: 'Préstamo no encontrado' };
          }

          // Actualizar la disponibilidad del libro
          await Book.update({ available: true }, { where: { id: loan.bookId } });

          // Calcular multa si la devolución es tardía
          const today = new Date();
          let fine = 0;
          if (loan.returnDate && today > new Date(loan.returnDate)) {
            const diffDays = Math.ceil((today - new Date(loan.returnDate)) / (1000 * 60 * 60 * 24));
            fine = diffDays * 2; // Multa de 2 unidades por día
          }

          loan.returnDate = today;
          await loan.save();

          return { success: true, message: `Libro devuelto con éxito. Multa: ${fine} unidades`, fine };
        } catch (error) {
          return { success: false, message: error.message };
        }
      },

      // Obtener préstamos activos
      GetActiveLoans: async () => {
        try {
          const loans = await Loan.findAll({
            where: { returnDate: null },
            include: [{ model: User }, { model: Book }],
          });

          const activeLoans = loans.map((loan) => ({
            loanId: loan.id,
            user: loan.User.name,
            book: loan.Book.title,
            loanDate: loan.loanDate,
          }));

          return { success: true, loans: JSON.stringify(activeLoans) };
        } catch (error) {
          return { success: false, message: error.message };
        }
      },

      // Obtener historial de préstamos de un usuario
      GetUserLoanHistory: async ({ userId }) => {
        try {
          const loans = await Loan.findAll({
            where: { userId },
            include: [{ model: Book }],
          });

          const loanHistory = loans.map((loan) => ({
            loanId: loan.id,
            book: loan.Book.title,
            loanDate: loan.loanDate,
            returnDate: loan.returnDate,
          }));

          return { success: true, history: JSON.stringify(loanHistory) };
        } catch (error) {
          return { success: false, message: error.message };
        }
      },
    },
  },
};

// Leer el archivo WSDL desde la ruta especificada
const wsdlPath = path.join(__dirname, '../../service.wsdl');
const wsdl = fs.readFileSync(wsdlPath, 'utf8');

module.exports = { loanService, wsdl };
