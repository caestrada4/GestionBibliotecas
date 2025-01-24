const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Library = require('./library');  // Relación con librería
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
  library_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Library,
      key: 'id',
    },
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
User.belongsTo(Library, { foreignKey: 'library_id' });

module.exports = User;
