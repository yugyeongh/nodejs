const SSE = require('sse');

module.exports = (server) => {
    const sse = new SSE(server);
    sse.on('connection',(client) => { //connection이벤트 리스너를 사용해서 클라이언트와 연결할 때 어떤 동작을 할지 정의하기, 매개변수로 client객체를 사용해서 클라이언트에서 메시지를 보낼 때 client객체 사용
        setInterval(()=>{
            client.send(Date.now().toString());
        },1000);
    });
};