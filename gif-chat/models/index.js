const Sequelize = require('sequelize');
const Chat = require('./chat');
const Room = require('./room');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.Chat = Chat;
db.Room = Room;

Chat.init(sequelize);
Room.init(sequelize);

Chat.associate(db);
Room.associate(db);

module.exports = db;