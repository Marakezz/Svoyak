const express = require('express');
const app = express(); 
// const useSocket = require('socket.io');
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
    }
});
app.use(express.json());

const rooms = new Map();

app.get('/rooms/:id', (req, res) => { 
    const {id: roomId} = req.params;
    // const roomId = req.query.id; //зачем query??
    //query здесь оказался не нужен. http://localhost:9999/rooms/1?hello=123&test=qqq - в данном случае query это hello=123&test=qqq, а парамс это 1.
    const obj = rooms.has(roomId) ? {
        users: [...rooms.get(roomId).get('users').values()],
        messages: [...rooms.get(roomId).get('messages').values()]
    } : {users:[], messages: []};
    res.json(obj);
});


app.post('/rooms', (req, res) => {
    const { roomId, userName } = req.body;
    if (!rooms.has(roomId)) {
      rooms.set(
        roomId,
        new Map([
          ['users', new Map()],
          ['messages', []],
        ]),
      );
    }
    res.send();
    // console.log(req.body)
  });


io.on('connection', (socket) => {
    socket.on('ROOM:JOIN', ({roomId, userName}) => { 
        socket.join(roomId); 
        rooms.get(roomId).get('users').set(socket.id, userName); 
        const users = [...rooms.get(roomId).get('users').values()]; 
        socket.to(roomId).emit('ROOM:SET_USERS', users);
        // console.log(users); 
    });

    
    socket.on('ROOM:NEW_MESSAGE', ({roomId, userName, text}) => {
        const obj = {
            userName,
            text,
        }
        rooms.get(roomId).get('messages').push(obj); //messages у нас просто массив
        socket.to(roomId).emit('ROOM:NEW_MESSAGE', obj );
    });

    socket.on('disconnect', () => {
        rooms.forEach((value, roomId) => {//ищем определенную комнату (здесь в другом порядке value-значение, roomId - ключ)
            // console.log('Удалился ', value.get('users').get(socket.id)); сами прописали для теста
            if(value.get('users').delete(socket.id)){ //это метод Map(а), возвращает тру если удалился, и фолс если нет
                const users = [...value.get('users').values()]; 
                socket.to(roomId).emit('ROOM:SET_USERS', users);
            }
        });
    });

    socket.on('ROOM:CHANGE_COLOR', ({toggle, roomId}) => {
        socket.broadcast.to(roomId).emit('ROOM:CHANGE_COLOR', toggle);
    });

    console.log('User connected', socket.id);
});


server.listen(8888, (err) =>{  
    if(err) {
        throw Error(err);
    }
    console.log('Сервер запущен');
});