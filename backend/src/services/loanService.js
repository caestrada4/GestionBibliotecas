const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const Loan = require('../models/loan');
const Book = require('../models/book');
const User = require('../models/user');
const { verifyTokenFromSOAP } = require('../middlewares/authMiddleware'); // Importar verificación de token SOAP

const loanService = {
  LoanService: {
    LoanPort: {
      // Crear un préstamo
      CreateLoan: async (args, headers) => {
        console.log("Solicitud recibida en CreateLoan:", args);

        const { userId, bookId, loanDate, returnDate } = args;

        const authResult = await verifyTokenFromSOAP(headers);
        if (!authResult.success) {
          return {
            CreateLoanResponse: {
              success: false,
              message: authResult.message,
            },
          };
        }

        try {
          const user = await User.findByPk(userId);
          if (!user) {
            return {
              CreateLoanResponse: {
                success: false,
                message: 'Usuario no encontrado',
              },
            };
          }
          if (user.isSuspended) {
            return {
              CreateLoanResponse: {
                success: false,
                message: `Usuario suspendido. Motivo: ${user.suspensionReason || 'No especificado'}`,
              },
            };
          }

          const book = await Book.findByPk(bookId);
          if (!book) {
            return {
              CreateLoanResponse: {
                success: false,
                message: 'El libro no existe',
              },
            };
          }
          if (!book.available) {
            return {
              CreateLoanResponse: {
                success: false,
                message: 'El libro no está disponible para préstamo',
              },
            };
          }

          const loan = await Loan.create({ userId, bookId, loanDate, returnDate });
          await book.update({ available: false });

          return {
            CreateLoanResponse: {
              success: true,
              loanId: loan.id,
              message: 'Préstamo creado con éxito',
            },
          };
        } catch (error) {
          console.error('Error al crear el préstamo:', error);
          return {
            CreateLoanResponse: {
              success: false,
              message: `Error interno del servidor al crear el préstamo: ${error.message}`,
            },
          };
        }
      },

      // Registrar devolución de un libro
      ReturnLoan: async (args, headers) => {
        console.log("Solicitud recibida en ReturnLoan:", args);

        const { loanId } = args;

        const authResult = await verifyTokenFromSOAP(headers);
        if (!authResult.success) {
          return {
            ReturnLoanResponse: {
              success: false,
              message: authResult.message,
            },
          };
        }

        try {
          const loan = await Loan.findByPk(loanId, { include: [{ model: Book }] });
          if (!loan) {
            return {
              ReturnLoanResponse: {
                success: false,
                message: 'Préstamo no encontrado',
              },
            };
          }

          if (loan.returnDate) {
            return {
              ReturnLoanResponse: {
                success: false,
                message: 'El préstamo ya fue devuelto',
              },
            };
          }

          const today = new Date();
          const returnDateExpected = new Date(loan.returnDate || loan.loanDate);
          let fine = 0;

          if (today > returnDateExpected) {
            const diffDays = Math.ceil((today - returnDateExpected) / (1000 * 60 * 60 * 24));
            fine = diffDays * 2; // Multa de 2 unidades por día
          }

          await loan.Book.update({ available: true });
          loan.returnDate = today;
          loan.fine = fine;
          await loan.save();

          return {
            ReturnLoanResponse: {
              success: true,
              message: `Libro devuelto con éxito. Multa: ${fine} unidades`,
              fine,
            },
          };
        } catch (error) {
          console.error('Error al registrar la devolución:', error);
          return {
            ReturnLoanResponse: {
              success: false,
              message: `Error interno del servidor al registrar la devolución: ${error.message}`,
            },
          };
        }
      },

      // Obtener todos los préstamos
      GetAllLoans: async () => {
        console.log("Método GetAllLoans invocado");
        try {
          const loans = await Loan.findAll({
            include: [
              { model: User, attributes: ['id', 'name', 'email'] },
              { model: Book, attributes: ['id', 'title', 'author'] },
            ],
          });

          if (!loans || loans.length === 0) {
            return {
              GetAllLoansResponse: {
                success: true,
                loans: JSON.stringify([]),
                message: 'No hay préstamos registrados.',
              },
            };
          }

          const allLoans = loans.map((loan) => ({
            loanId: loan.id,
            user: {
              id: loan.User.id,
              name: loan.User.name,
              email: loan.User.email,
            },
            book: {
              id: loan.Book.id,
              title: loan.Book.title,
              author: loan.Book.author,
            },
            loanDate: loan.loanDate,
            returnDate: loan.returnDate || 'Pendiente',
            fine: loan.fine || 0,
          }));

          return {
            GetAllLoansResponse: {
              success: true,
              loans: JSON.stringify(allLoans),
              message: 'Préstamos obtenidos con éxito.',
            },
          };
        } catch (error) {
          console.error("Error al obtener préstamos:", error);
          return {
            GetAllLoansResponse: {
              success: false,
              loans: JSON.stringify([]),
              message: `Error interno al obtener préstamos: ${error.message}`,
            },
          };
        }
      },
    },
  },
};

const wsdlPath = path.join(__dirname, '../../service.wsdl');
let wsdl = '';
try {
  wsdl = fs.readFileSync(wsdlPath, 'utf8');
} catch (error) {
  console.error('Error al cargar el archivo WSDL:', error.message);
}

module.exports = { loanService, wsdl };
