const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const User = require('./user');
const Book = require('./book');

const Loan = sequelize.define('Loan', {
  loanDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
    validate: {
      isDate: true,
    },
  },
  returnDate: {
    type: DataTypes.DATE,
    allowNull: true,
    validate: {
      isDate: true,
      isAfterLoanDate(value) {
        if (value && this.loanDate && value < this.loanDate) {
          throw new Error('La fecha de devolución no puede ser anterior a la fecha de préstamo');
        }
      },
    },
  },
});

// Relaciones
Loan.belongsTo(User, {
  foreignKey: {
    allowNull: false,
  },
  onDelete: 'CASCADE',
});

Loan.belongsTo(Book, {
  foreignKey: {
    allowNull: false,
  },
  onDelete: 'CASCADE',
});

module.exports = Loan;
