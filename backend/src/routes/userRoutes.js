const express = require('express');
const { getAllUsers, createUser, updateUser, getUserById } = require('../controllers/userController');

const router = express.Router();

// Obtener todos los usuarios
router.get('/', getAllUsers);

// Obtener un usuario por ID
router.get('/:id', getUserById);

// Crear un nuevo usuario
router.post('/', createUser);

// Actualizar un usuario existente
router.put('/:id', updateUser);

module.exports = router;
