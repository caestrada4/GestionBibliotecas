const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware para verificar el token JWT
exports.verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token no proporcionado o inválido' });
    }

    const token = authHeader.split(' ')[1];

    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret');

    // Buscar el usuario en la base de datos
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      userType: user.userType,
    }; // Agregar solo información necesaria a req.user

    next();
  } catch (error) {
    console.error('Error al verificar el token:', error);
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

// Middleware para verificar roles
exports.verifyRole = (allowedRoles) => {
  return (req, res, next) => {
    try {
      const userRole = req.user?.role; // Suponiendo que el rol está en req.user
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
      }
      next();
    } catch (error) {
      console.error('Error al verificar rol:', error);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  };
};

// Middleware opcional: Autenticación básica (sin token, para desarrollo)
exports.basicAuth = async (req, res, next) => {
  try {
    const { email, password } = req.headers;

    if (!email || !password) {
      return res.status(401).json({ message: 'Credenciales no proporcionadas' });
    }

    // Buscar el usuario por email
    const user = await User.findOne({ where: { email } });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      userType: user.userType,
    }; // Agregar solo información necesaria a req.user

    next();
  } catch (error) {
    console.error('Error en la autenticación básica:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
