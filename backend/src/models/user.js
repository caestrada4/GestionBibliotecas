const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'librarian', 'user'),
    allowNull: false,
    defaultValue: 'user', // Por defecto, los nuevos usuarios serán 'user'
  },
  userType: {
    type: DataTypes.STRING,
    allowNull: true, // Esto puede incluir valores como 'Estudiante' o 'Profesor'
  },
  isSuspended: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false, // Por defecto, los usuarios no están suspendidos
  },
  suspensionReason: {
    type: DataTypes.STRING,
    allowNull: true, // Permite almacenar la justificación de la suspensión
  },
});

module.exports = User;
