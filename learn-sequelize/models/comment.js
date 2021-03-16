'use strict'

const Sequelize = require('sequelize');

module.exports = class Comment extends Sequelize.Model {
    /* 테이블에 대한 설정 */
    static init (sequelize) {
        return super.init({
            comment: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.NOW,
            },
        }, {
            sequelize,
            timestamps: false,
            modelName: 'Comment',
            tableName: 'comments',
            paranoid: false,
            charset: 'utf8mb4',
            collate:'utf8mb4_general_ci',
        });
    }
    /* 다른 모델과의 관계 */
    static associate(db){
        db.Comment.belongsTo(db.User, {foreignKey:'commenter',targetkey:'id'});
    }
};