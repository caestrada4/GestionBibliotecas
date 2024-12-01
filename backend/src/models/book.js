const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Book = sequelize.define('Book', {
  title: { type: DataTypes.STRING, allowNull: false },
  author: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING },
  available: { type: DataTypes.BOOLEAN, defaultValue: true },
});

module.exports = Book;
