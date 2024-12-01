const express = require('express');
const { createLoan, returnLoan, getActiveLoans, getUserLoanHistory } = require('../controllers/loanController');

const router = express.Router();

// Crear un préstamo
router.post('/', createLoan);

// Registrar la devolución de un préstamo
router.put('/:id/return', returnLoan);

// Obtener préstamos activos
router.get('/active', getActiveLoans);

// Obtener historial de préstamos de un usuario
router.get('/history/:userId', getUserLoanHistory);

module.exports = router;
