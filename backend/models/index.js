const { sequelize } = require('../config/db');
const User = require('./User');
const Message = require('./Message');
const Alias = require('./Alias');
const Block = require('./Block');

// User <-> Message (Sender)
User.hasMany(Message, { foreignKey: 'sender_id', as: 'sentMessages' });
Message.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });

// User <-> Message (Receiver)
User.hasMany(Message, { foreignKey: 'receiver_id', as: 'receivedMessages' });
Message.belongsTo(User, { foreignKey: 'receiver_id', as: 'receiver' });

// User <-> Alias
User.hasMany(Alias, { foreignKey: 'user_id', as: 'aliases' });
Alias.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User <-> Block (Blocker)
User.hasMany(Block, { foreignKey: 'blocker_id', as: 'blockedUsers' });
Block.belongsTo(User, { foreignKey: 'blocker_id', as: 'blocker' });

// User <-> Block (Blocked)
User.hasMany(Block, { foreignKey: 'blocked_id', as: 'blockers' });
Block.belongsTo(User, { foreignKey: 'blocked_id', as: 'blockedUser' });

module.exports = {
  sequelize,
  User,
  Message,
  Alias,
  Block
};
