const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Library = sequelize.define('Library', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Library;
