const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar usuario por email
    const user = await User.findOne({ where: { email } });

    // Verificar si el usuario existe
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Verificar si el usuario está suspendido
    if (user.isSuspended) {
      return res.status(403).json({
        message: `Usuario suspendido. Motivo: ${user.suspensionReason || 'No especificado'}`,
      });
    }

    // Verificar credenciales en texto plano
    if (user.password !== password) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role, library_id: user.library_id }, // Agregar library_id aquí
      process.env.JWT_SECRET || 'Andrew254195',
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        userType: user.userType,
      },
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Validar Token
exports.validateToken = async (req, res) => {
  try {
    // Verificar si req.user está definido (en caso de que algo falle en el middleware verifyToken)
    if (!req.user) {
      return res.status(401).json({ message: 'Token inválido o expirado' });
    }

    const user = req.user;

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        userType: user.userType,
        library_id: user.library_id,  // Agregar el `library_id` si es necesario
      },
    });
  } catch (error) {
    console.error('Error al validar el token:', error);
    res.status(500).json({ message: 'Error al validar el token' });
  }
};


// Registrar usuario
exports.registerUser = async (req, res) => {
  const { name, email, password, userType } = req.body;

  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
    }

    // Crear el nuevo usuario
    const newUser = await User.create({
      name,
      email,
      password, // Guardar contraseña en texto plano
      userType: userType || 'Estudiante', // Valor predeterminado
      role: 'user', // El rol predeterminado es "user"
    });

    res.status(201).json({
      message: 'Usuario registrado exitosamente.',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        userType: newUser.userType,
      },
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};
