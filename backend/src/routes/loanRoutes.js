const express = require('express');
const { createLoan, returnLoan, getActiveLoans, getUserLoanHistory } = require('../controllers/loanController');
const { verifyRole } = require('../middlewares/authMiddleware'); // Asegúrate de tener este middleware configurado

const router = express.Router();

// Crear un préstamo (solo bibliotecarios o administradores)
router.post('/', verifyRole(['librarian', 'admin']), createLoan);

// Registrar la devolución de un préstamo (solo bibliotecarios o administradores)
router.put('/:id/return', verifyRole(['librarian', 'admin']), returnLoan);

// Obtener préstamos activos (solo bibliotecarios o administradores)
router.get('/active', verifyRole(['librarian', 'admin']), getActiveLoans);

// Obtener historial de préstamos de un usuario (usuarios y roles superiores)
router.get('/history/:userId', verifyRole(['user', 'librarian', 'admin']), getUserLoanHistory);

module.exports = router;
