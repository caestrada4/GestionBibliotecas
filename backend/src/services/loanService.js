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
          // Validar que el usuario existe
          const user = await User.findByPk(userId);
          if (!user) {
            return { success: false, message: 'Usuario no encontrado' };
          }

          // Validar que el libro existe y está disponible
          const book = await Book.findByPk(bookId);
          if (!book) {
            return { success: false, message: 'El libro no existe' };
          }
          if (!book.available) {
            return { success: false, message: 'El libro no está disponible para préstamo' };
          }

          // Crear el préstamo
          const loan = await Loan.create({ userId, bookId, loanDate, returnDate });

          // Marcar el libro como no disponible
          await book.update({ available: false });

          return { success: true, loanId: loan.id, message: 'Préstamo creado con éxito' };
        } catch (error) {
          console.error('Error al crear el préstamo:', error);
          return { success: false, message: 'Error interno del servidor al crear el préstamo' };
        }
      },

      // Registrar devolución de un libro
      ReturnLoan: async ({ loanId }) => {
        try {
          // Validar que el préstamo existe
          const loan = await Loan.findByPk(loanId, { include: [{ model: Book }] });
          if (!loan) {
            return { success: false, message: 'Préstamo no encontrado' };
          }

          // Actualizar disponibilidad del libro
          await loan.Book.update({ available: true });

          // Calcular multa si la devolución es tardía
          const today = new Date();
          let fine = 0;
          if (loan.returnDate && today > new Date(loan.returnDate)) {
            const diffDays = Math.ceil((today - new Date(loan.returnDate)) / (1000 * 60 * 60 * 24));
            fine = diffDays * 2; // Multa de 2 unidades por día
          }

          // Actualizar el préstamo con la fecha de devolución
          await loan.update({ returnDate: today });

          return { success: true, message: `Libro devuelto con éxito. Multa: ${fine} unidades`, fine };
        } catch (error) {
          console.error('Error al registrar la devolución:', error);
          return { success: false, message: 'Error interno del servidor al registrar la devolución' };
        }
      },

      // Obtener préstamos activos
      GetActiveLoans: async () => {
        try {
          const loans = await Loan.findAll({
            where: { returnDate: null },
            include: [
              { model: User, attributes: ['name', 'email'] },
              { model: Book, attributes: ['title', 'author'] },
            ],
          });

          if (!loans || loans.length === 0) {
            return { success: true, loans: [], message: 'No hay préstamos activos en este momento' };
          }

          const activeLoans = loans.map((loan) => ({
            loanId: loan.id,
            user: { name: loan.User.name, email: loan.User.email },
            book: { title: loan.Book.title, author: loan.Book.author },
            loanDate: loan.loanDate,
          }));

          return { success: true, loans: activeLoans };
        } catch (error) {
          console.error('Error al obtener préstamos activos:', error);
          return { success: false, message: 'Error interno del servidor al obtener préstamos activos' };
        }
      },

      // Obtener historial de préstamos de un usuario
      GetUserLoanHistory: async ({ userId }) => {
        try {
          const loans = await Loan.findAll({
            where: { userId },
            include: [{ model: Book, attributes: ['title', 'author'] }],
          });

          if (!loans || loans.length === 0) {
            return { success: false, message: 'No se encontró historial de préstamos para este usuario' };
          }

          const loanHistory = loans.map((loan) => ({
            loanId: loan.id,
            book: { title: loan.Book.title, author: loan.Book.author },
            loanDate: loan.loanDate,
            returnDate: loan.returnDate,
          }));

          return { success: true, history: loanHistory };
        } catch (error) {
          console.error('Error al obtener el historial del usuario:', error);
          return { success: false, message: 'Error interno del servidor al obtener el historial del usuario' };
        }
      },
    },
  },
};

// Leer el archivo WSDL desde la ruta especificada
const wsdlPath = path.join(__dirname, '../../service.wsdl');
let wsdl = '';
try {
  wsdl = fs.readFileSync(wsdlPath, 'utf8');
} catch (error) {
  console.error('Error al cargar el archivo WSDL:', error.message);
}

module.exports = { loanService, wsdl };
