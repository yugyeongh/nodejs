'use strict'

const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model{
    /* 테이블에 대한 설정 */
    static init(sequelize) {
        return super.init({
            name: {
                type: Sequelize.STRING(20),
                allowNull: false,
                unique: true,
            },
            age: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
            },
            married: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull:false,
                defaultValue: Sequelize.NOW,
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    /* 다른 모델과의 관계 */
    static associate(db){
        db.User.hasMany(db.Comment, { foreignKey:'commenter',sourceKey:'id'});
    }
};