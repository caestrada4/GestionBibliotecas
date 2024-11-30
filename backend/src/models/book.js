const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");

const Book = sequelize.define("Book", {
  title: DataTypes.STRING,
  author: DataTypes.STRING,
  category: DataTypes.STRING,
  available: DataTypes.BOOLEAN,
});

module.exports = Book;
