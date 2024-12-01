const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  userType: { type: DataTypes.STRING, allowNull: false }, // Ej: 'Estudiante', 'Profesor'
});

module.exports = User;
