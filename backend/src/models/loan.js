const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const User = require('./user');
const Book = require('./book');
const Library = require('./library');  // Relación con librería

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
  library_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Library,
      key: 'id',
    },
  },
  fine: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    allowNull: false,
    validate: {
      isDecimal: true,
      min: 0,
    },
  },
  status: {
    type: DataTypes.ENUM('active', 'returned'),
    defaultValue: 'active',
    allowNull: false,
  },
}, {
  indexes: [
    { fields: ['userId'] },
    { fields: ['bookId'] },
  ],
});

// Relaciones
Loan.belongsTo(User, {
  foreignKey: {
    allowNull: false,
  },
  onDelete: 'CASCADE',
});
Loan.belongsTo(Library, { foreignKey: 'library_id' });

Loan.belongsTo(Book, {
  foreignKey: {
    allowNull: false,
  },
  onDelete: 'CASCADE',
});

// Relaciones inversas
User.hasMany(Loan, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

Book.hasMany(Loan, {
  foreignKey: 'bookId',
  onDelete: 'CASCADE',
});

module.exports = Loan;
