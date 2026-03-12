const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Block = sequelize.define('Block', {
  blocker_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  blocked_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  }
}, {
  timestamps: false,
});

module.exports = Block;
