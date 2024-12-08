const express = require('express');
const { login, registerUser, validateToken } = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');
const router = express.Router();


// Registrar un nuevo usuario
router.post('/register', registerUser);

// Iniciar sesión
router.post('/login', login);

// Verificar token (Middleware de autenticación)
router.get('/validate', verifyToken, validateToken);

module.exports = router;
