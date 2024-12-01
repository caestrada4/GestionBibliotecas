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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar el usuario en la base de datos
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    req.user = user; // Agregar el usuario a la solicitud para uso posterior
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

// Middleware para verificar roles
exports.verifyRole = (allowedRoles) => {
  return (req, res, next) => {
    // Verifica si el rol del usuario está incluido en los roles permitidos
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
    }
    next();
  };
};

// Middleware opcional: Autenticación básica (sin token, para desarrollo)
exports.basicAuth = async (req, res, next) => {
  try {
    const { email, password } = req.headers;

    if (!email || !password) {
      return res.status(401).json({ message: 'Credenciales no proporcionadas' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    req.user = user; // Agregar el usuario a la solicitud
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error en la autenticación' });
  }
};
