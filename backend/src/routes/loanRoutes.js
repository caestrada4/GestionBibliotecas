const express = require('express');
const { createLoan, returnLoan, getActiveLoans, getUserLoanHistory } = require('../controllers/loanController');

const router = express.Router();

// Crear un préstamo (todos los usuarios pueden crear préstamos)
router.post('/', createLoan);

// Registrar la devolución de un préstamo (todos los usuarios pueden registrar devoluciones)
router.put('/:id/return', returnLoan);

// Obtener préstamos activos (todos los usuarios pueden ver préstamos activos)
router.get('/active', getActiveLoans);

// Obtener historial de préstamos de un usuario (todos los usuarios pueden ver su historial)
router.get('/history/:userId', getUserLoanHistory);

module.exports = router;
