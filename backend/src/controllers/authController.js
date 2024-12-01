const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar usuario por email
    const user = await User.findOne({ where: { email } });

    // Verificar credenciales
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role }, // Payload
      process.env.JWT_SECRET || 'Andrew254195', // Clave secreta
      { expiresIn: '1h' } // Expiración
    );

    res.json({ token }); // Responder con el token
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};
