const SocketIO = require('socket.io');

module.exports = (server,app) => {
    const io = SocketIO(server,{ path: '/socket.io'});
    app.set('io',io);
    io.on('connection',(socket) => {
        const req = socket.request;
        const { headers: { referer } } = req;
        const roomId = referer.split('/')[referer.split('/').length-1];
        socket.join(roomId); //방 입장하기
        socket.on('disconnect',()=>{
            socket.leave(roomId); //해당 방에서 나가기
        });
    });
};