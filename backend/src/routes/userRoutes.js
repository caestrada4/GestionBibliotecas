const express = require('express');
const { getAllUsers, createUser, updateUser, getUserById, assignRole } = require('../controllers/userController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

const router = express.Router();

// Rutas
router.get('/', verifyToken, verifyRole(['admin']), getAllUsers); // Solo admin puede listar usuarios
router.get('/:id', verifyToken, verifyRole(['admin', 'librarian']), getUserById); // Admin y bibliotecario pueden consultar usuarios
router.post('/', verifyToken, verifyRole(['admin']), createUser); // Solo admin puede crear usuarios
router.put('/:id', verifyToken, verifyRole(['admin']), updateUser); // Solo admin puede actualizar usuarios
router.put('/:id/role', verifyToken, verifyRole(['admin']), assignRole); // Solo admin puede asignar roles

module.exports = router;
