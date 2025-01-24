const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Library = require('./library');  // Relación con librería

const Book = sequelize.define('Book', {
  title: { type: DataTypes.STRING, allowNull: false },
  author: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING },
  available: { type: DataTypes.BOOLEAN, defaultValue: true },
  library_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Library,
      key: 'id',
    },
  },
});
Book.belongsTo(Library, { foreignKey: 'library_id' });

module.exports = Book;
