const Sequelize = require('sequelize');

module.exports = class Room extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      title: {
        type: Sequelize.STRING(40),
        allowNull: false,
      },
      max: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default:10,
      },
      owner: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
    }, {
      sequelize,
      timestamps: true,
      paranoid: false,
      modelName: 'Room',
      tableName: 'rooms',
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {//room모델에 roomid컬럼 생성
    db.Room.hasMany(db.Chat,{foreignKey:'roomId',sourceKey:'id'});
  }
};