const express = require('express');
const { login } = require('../controllers/authController');

const router = express.Router();

// Registrar un nuevo usuario
//router.post('/register', registerUser);

// Iniciar sesión
router.post('/login', login);

// Verificar token (Middleware de autenticación)
//router.get('/verify', verifyToken);

module.exports = router;
