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
    const {id: roomName} = req.params;
    // const roomName = req.query.id; //зачем query??
    //query здесь оказался не нужен. http://localhost:9999/rooms/1?hello=123&test=qqq - в данном случае query это hello=123&test=qqq, а парамс это 1.
    const users = [];
    [...rooms.get(roomName).get('users').values()].forEach((item, index) => {
        const obj = {
            id: item.get('id'),
            userName: item.get('userName'),
            role: item.get('role'),
            points: item.get('points')
        }
        users.push(obj);
    }) 
    const obj = rooms.has(roomName) ? {
        // users: [...rooms.get(roomName).get('users').values()],
        users: users,
        messages: [...rooms.get(roomName).get('messages').values()]
    } : {users:[], messages: []};
    res.json(obj);
});

app.get('/roomUsers/:id', (req, res) => { 
    const {id: roomName} = req.params;
    const users = [];
    [...rooms.get(roomName).get('users').values()].forEach((item, index) => {
        const obj = {
            id: item.get('id'),
            userName: item.get('userName'),
            role: item.get('role'),
            points: item.get('points')
        }
        users.push(obj);
    }) 
    if(rooms.has(roomName)){
        res.json(users);
    } else {
        res.json([]);
    }
});


app.post('/rooms', (req, res) => {
    const { roomName, userName } = req.body;
    if (!rooms.has(roomName)) {
      rooms.set(
        roomName,
        new Map([
          ['users', new Map()],
          ['messages', []],
        ]),
      );
    } else {
        res.json('RoomIsAlreadyExist');
    }
    res.send();
    // console.log(req.body)
  });

  app.get('/allRooms', (req, res) => {
    const allRooms = [...rooms.keys()];
    res.json(allRooms);
    // console.log(allRooms);
  })


io.on('connection', (socket) => {
    socket.on('ROOM:JOIN', ({roomName, userName, role}) => { 
        socket.join(roomName); 
        rooms.get(roomName).get('users').set(socket.id, new Map([
            ['id', socket.id],
            ['userName', userName],
            ['role' , role],
            ['points', 0]
        ])); 
        const users = [];
        [...rooms.get(roomName).get('users').values()].forEach((item, index) => {
            const obj ={
                id: item.get('id'),
                userName: item.get('userName'),
                role: item.get('role'),
                points: item.get('points')
            }
            users.push(obj);
        }) 
        socket.to(roomName).emit('ROOM:SET_USERS', users);
        // console.log(rooms.get(roomName).get('users').get(socket.id).get('role'));
        // console.log(users);
    });

    
    socket.on('ROOM:NEW_MESSAGE', ({roomName, userName, role, text}) => {
        const obj = {
            userName,
            role,
            text,
        }
        if ( rooms.get(roomName).get('messages') ) {
            rooms.get(roomName).get('messages').push(obj); //messages у нас просто массив
            socket.to(roomName).emit('ROOM:NEW_MESSAGE', obj );
        }
    });

    socket.on('ROOM:PLAYER_DELETED', ({id, roomName, userName}) =>{
        const status = 'kicked';
        socket.to(id).emit('ROOM:PLAYER_DELETED', status);
        // console.log(userName + ' Удален из ' + roomName + ' с ID: ' + id);
    });

    socket.on('ROOM:SWAP_ADMIN', ({id, roomName}) => {
        // console.log(id + ' ---  ' + socket.id);
        rooms.get(roomName).get('users').get(socket.id).set('role' , 'player');
        rooms.get(roomName).get('users').get(id).set('role' , 'admin');

        const users = [];
        [...rooms.get(roomName).get('users').values()].forEach((item, index) => {
            const obj ={
                id: item.get('id'),
                userName: item.get('userName'),
                role: item.get('role'),
                points: item.get('points')
            }
            users.push(obj);
        }) 
        socket.to(roomName).emit('ROOM:SET_USERS', users);
        socket.to(id).emit('ROOM:SWAP_ROLE_TO', 'admin');
        // console.log(socket.id);
    });

    socket.on('ROOM:CHANGE_POINTS', ({amount, id, roomName}) => {
        rooms.get(roomName).get('users').get(id).set('points' , amount);
        const users = [];
        [...rooms.get(roomName).get('users').values()].forEach((item, index) => {
            const obj ={
                id: item.get('id'),
                userName: item.get('userName'),
                role: item.get('role'),
                points: item.get('points')
            }
            users.push(obj);
        }) 
        socket.to(roomName).emit('ROOM:SET_USERS', users);
    })


    socket.on('disconnect', () => {
        rooms.forEach((value, roomName) => {//ищем определенную комнату (здесь в другом порядке value-значение, roomName - ключ)
            // console.log('Удалился ', value.get('users').get(socket.id)); сами прописали для теста
            if(value.get('users').has(socket.id)){ 
                const obj = {
                    userName: value.get('users').get(socket.id).get('userName'),
                    role: value.get('users').get(socket.id).get('role'),
                    text: '----------Покинул чат----------'
                }
                socket.to(roomName).emit('ROOM:NEW_MESSAGE', obj );
                if(value.get('users').size == 1) {
                    console.log('Ушел последний пользователь из комнаты: ' + roomName) //Добавить удаление комнаты?
                }
                value.get('users').delete(socket.id)//это метод Map(а), возвращает тру если удалился, и фолс если нет
                const users = [];
                [...value.get('users').values()].forEach((item, index) => {
                    const obj = {
                        id: item.get('id'),
                        userName: item.get('userName'),
                        role: item.get('role'),
                        points: item.get('points')
                    }
                    users.push(obj);
                }) 
                // const users = [...value.get('users').values()]; 
                socket.to(roomName).emit('ROOM:SET_USERS', users);
            }
        });
        console.log('User DISconnected', socket.id);
    });

    socket.on('ROOM:CHANGE_COLOR', ({toggle, roomName}) => {
        socket.broadcast.to(roomName).emit('ROOM:CHANGE_COLOR', toggle);
    });

    console.log('User connected', socket.id);
});


server.listen(8888, (err) =>{  
    if(err) {
        throw Error(err);
    }
    console.log('Сервер запущен');
});