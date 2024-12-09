const User = require('../models/user');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, userType, role } = req.body;

    // Validar que el rol sea asignado solo por administradores
    if (role && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No tienes permiso para asignar roles.' });
    }

    // Crear el nuevo usuario
    const newUser = await User.create({
      name,
      email,
      password,
      userType,
      role: role || 'user', // Por defecto, se asigna el rol 'user' si no se especifica
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, userType, role } = req.body;

    // Validar que el rol solo pueda ser actualizado por administradores
    if (role && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No tienes permiso para actualizar roles.' });
    }

    const [updated] = await User.update(
      { name, email, password, userType, role },
      { where: { id } }
    );

    if (!updated) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.json({ message: 'Usuario actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Asignar un rol a un usuario (solo accesible para administradores)
exports.assignRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validar que solo un administrador puede asignar roles
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No tienes permiso para asignar roles.' });
    }

    // Validar que el rol sea válido
    const validRoles = ['admin', 'librarian', 'user'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Rol inválido. Roles permitidos: admin, librarian, user' });
    }

    // Actualizar el rol del usuario
    const [updated] = await User.update({ role }, { where: { id } });
    if (!updated) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.json({ message: 'Rol asignado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.suspendUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { justification } = req.body;

    // Validar que el usuario es admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No tienes permiso para suspender usuarios.' });
    }

    // Validar que se proporcione una justificación
    if (!justification || typeof justification !== 'string' || justification.trim() === '') {
      return res.status(400).json({ message: 'Se requiere una justificación válida para suspender al usuario.' });
    }

    // Actualizar el usuario en la base de datos
    const [updated] = await User.update(
      { isSuspended: true, suspensionReason: justification },
      { where: { id } }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.json({ message: 'Usuario suspendido correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.unsuspendUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar que solo un administrador puede reactivar usuarios
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No tienes permiso para reactivar usuarios.' });
    }

    const [updated] = await User.update(
      { isSuspended: false, suspensionReason: null }, // Reactivar al usuario
      { where: { id } }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.json({ message: 'Usuario reactivado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
