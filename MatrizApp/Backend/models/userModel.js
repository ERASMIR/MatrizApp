const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('developer', 'admin', 'operator'),
    defaultValue: 'operator'
  }
}, {
  timestamps: true // Opcional: para agregar campos de `createdAt` y `updatedAt`
});

module.exports = User;
