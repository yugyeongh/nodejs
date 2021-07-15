const express = require('express');

const Room = require('../models/room');
const Chat = require('../models/chat');
const socket = require('../socket');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const rooms = await Room.findAll({});
    res.render('main', { rooms, title: 'GIF 채팅방' });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/room', (req, res) => {
  res.render('room', { title: 'GIF 채팅방 생성' });
});

/* 채팅방을 만드는 라우터 */
router.post('/room', async (req, res, next) => {
  try {
    const newRoom = await Room.create({
      title: req.body.title,
      max: req.body.max,
      owner: req.session.color,
      password: req.body.password,
    });
    const io = req.app.get('io'); //io 객체 가져오기
    io.of('/room').emit('newRoom', newRoom); // room 네임 스페이스에 연결한 모든 클라이언트에 데이터를 보내는 메서드
    console.log(">>"+req.body.password);
    if(req.body.password>0){
      res.redirect(`/room/${newRoom.id}?password=${req.body.password}`);
    }
    else{res.redirect(`/room/${newRoom.id}`);}
  } catch (error) {
    console.error(error);
    next(error);
  }
});

/* 채팅방을 렌더링하는 라우터 */
router.get('/room/:id', async (req, res, next) => {
  try {
    const room = await Room.findOne({ where:{id: req.params.id }});
    const io = req.app.get('io');
    // 방 렌더링 전에 존재하는 방인지, 비밀번호가 옳은지, 허용인원이 초과되진 않았는지 검사
    if (!room) {
      return res.redirect('/?error=존재하지 않는 방입니다.');
    }
    if (room.password && room.password !== req.query.password) {
      return res.redirect('/?error=비밀번호가 틀렸습니다.');
    }
    const { rooms } = io.of('/chat').adapter;
    if (rooms && rooms[req.params.id] && room.max <= rooms[req.params.id].length) {
      return res.redirect('/?error=허용 인원이 초과하였습니다.');
    }
    const chats = await Chat.findAll({ where: {roomId:room.id }}); //.sort('createdAt')
    return res.render('chat', {
      room,
      title: room.title,
      chats,
      user: req.session.color,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

/* 채팅방을 삭제하는 라우터 */
router.delete('/room/:id', async (req, res, next) => {
  try {
    const room = await Room.findOne({
      include:[{
        model:Chat,
        where:{
          roomId:req.params.id,
        },
        attributes:['id'],
      }]
    });
    console.log(">>>>"+room);
    //console.log(">>>>"+chats);
    
    await Chat.destroy({ where:{roomId:req.params.id} });
    await Room.destroy({ where: {id: req.params.id} }); //여기å
    
    res.send('ok');
    setTimeout(() => {
      req.app.get('io').of('/room').emit('removeRoom', req.params.id);
    }, 2000);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

/* 채팅을 데이터베이스에 저장하고, 같은 방에 있는 소켓들에게 메시지 데이터 전송 */
router.post('/room/:id/chat', async(req,res,next) => {
  try{
    const chat = await Chat.create({
      room: req.params.id,
      user: req.session.color,
      chat: req.body.chat,
      roomId:req.params.id,
    });
    req.app.get('io').of('/chat').to(req.params.id).emit('chat',chat);
    res.send('ok');
  } catch(error){
    console.log(error);
    next(error);
  }
});

module.exports = router;