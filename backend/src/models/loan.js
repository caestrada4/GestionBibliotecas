const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const User = require('./user');
const Book = require('./book');

const Loan = sequelize.define('Loan', {
  loanDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  returnDate: { type: DataTypes.DATE },
});

Loan.belongsTo(User);
Loan.belongsTo(Book);

module.exports = Loan;
