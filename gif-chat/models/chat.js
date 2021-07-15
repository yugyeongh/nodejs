const Sequelize = require('sequelize');

module.exports = class Chat extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      room: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: 0,
      },
      user: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      chat: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      gif: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
    }, {
      sequelize,
      timestamps: true,
      paranoid: false,
      modelName: 'Chat',
      tableName: 'chats',
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    db.Chat.belongsTo(db.Room,{foreignKey:'roomId',sourceKey:'id'});
  }
};