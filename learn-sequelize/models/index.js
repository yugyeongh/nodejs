'use strict'

const Sequelize = require('sequelize');
const User = require('./user');
const Comment = require('./comment');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env]; //이 경로를 통해 데베 설정을 불러옴
const db = {};

//Sequelize 객체를 통해 MySQL연결 객체 생성
const sequelize = new Sequelize(config.database,config.username,config.password,config);

/* db 객체에 담기 */
db.sequelize = sequelize; 
db.User = User;
db.Comment = Comment;

/* 각 모델의 static.init 메서드 호출 */
User.init(sequelize);
Comment.init(sequelize);

/* 다른 테이블과의 관계 연결 */
User.associate(db);
Comment.associate(db);

module.exports = db;