import './App.css';
import React from 'react';
import socket from './socket';
import JoinBlock from './components/JoinBlock';
import RoomChat from './components/Room/RoomChat';
import RoomDetails from './components/Room/RoomDetails';
import reducer from './reducer';
import axios from 'axios';
import TestComponentt from './components/test';
import GameDisplay from './components/Room/GameDisplay';


function App() {
  const [state, dispatch] = React.useReducer(reducer, {
    joined: false,
    roomName: null,
    userName: null,
    role: null,
    id: null,
    users: [],
    messages: [] //массив объектов из userName, message
  });

  const setUsers = (users) => {
    console.log('новый пользователь', users); //Те самые 4 уведомления
    dispatch({
      type: 'SET_USERS',
      payload: users,
    });
}

const addMessage = (message) => {
  // console.log('Написал сообщение'); //Почему дублируется??
  dispatch({
    type: 'NEW_MESSAGE',
    payload: message,
  });
}


const changePoints = async (obj) => {
  // console.log(obj.amount);
  socket.emit('ROOM:CHANGE_POINTS', obj);
  const {data} = await axios.get(`/roomUsers/${obj.roomName}`); 
  dispatch({ 
    type: 'SET_USERS',
    payload: data
  })
}

const deletePlayer = (obj) => {
  socket.emit('ROOM:PLAYER_DELETED', obj);
}

const makePlayerToAdmin = async (obj) => {
  // console.log('From: ' + obj.idFrom + ' To: ' + obj.idTo );
  swapRoleTo('player');
  socket.emit('ROOM:SWAP_ADMIN', obj);
  const {data} = await axios.get(`/roomUsers/${obj.roomName}`); 
  dispatch({ 
    type: 'SET_USERS',
    payload: data
  })
}

const swapRoleTo= (role) => {
  dispatch({
    type: 'SWAP_ROLE_TO',
    payload: role,
  });
}

React.useEffect( () => {
  socket.on('ROOM:SWAP_ROLE_TO', swapRoleTo);
  socket.on('ROOM:PLAYER_DELETED', onExitFromRoom);
  socket.on('ROOM:SET_USERS', setUsers);
  socket.on('ROOM:NEW_MESSAGE', addMessage);
 
  

  return() => { 
    socket.off('ROOM:SWAP_ROLE_TO', swapRoleTo);
    socket.off('ROOM:PLAYER_DELETED', onExitFromRoom);
    socket.off('ROOM:SET_USERS', setUsers);
    socket.off('ROOM:NEW_MESSAGE', addMessage); } //Создал unmount (сам) чтоб не вызывалось по нескольку раз
}, []);

  const onLogin = async (obj) => {
    dispatch({
      type: 'JOINED',
      payload: obj,
    });
    socket.emit('ROOM:JOIN',obj);
    const {data} = await axios.get(`/rooms/${obj.roomName}`); 
    dispatch({ 
      type: 'SET_DATA',
      payload: data
    })
  };

  const onExitFromRoom = (status) => {
    dispatch({
      type: 'UNJOINED',
    })
    socket.disconnect();
    if(status === 'kicked') {
      alert('Вы были кикнуты из комнаты');
    }
  }

  // window.socket = socket; Зачем это?

  return (
<div className='wrapper'>
  {!state.joined ? (<JoinBlock onLogin={onLogin}/>) : (
     <div 
      className='
        flex 
        flex-col
        md:flex-row
        h-screen
      '
     >
      <RoomDetails {...state} onExitFromRoom={onExitFromRoom} deletePlayer={deletePlayer} makePlayerToAdmin={makePlayerToAdmin} changePoints={changePoints} />
      <GameDisplay {...state} />
      <RoomChat {...state} onAddMessage={addMessage}/>
      {/*<TestComponentt {...state}/>*/}
     </div>
  )}
  
  
</div>

  );
}

export default App;


//Проблемы:
// Добавить пароли?
// Если люди выходят с комнаты, то их переписка остается
//Tailwind добавили с -D, т.е. только для разработки
//Когда только 1 пользователь, показывает что их 0, или нет???
//Когда человек в списке комнат, новые появляющиеся в этот момент комнаты не отображаются
//Сделали что при нажатии на "выйти из комнаты" разрывается сокет-соединение, мб не лучший вариант при нагрузке (мб socket.leave нужно)
//Добавить удаление комнаты?
//Когда игрок вышел сам и когда его кикнули, в чате одинаковое сообщение, нужно ли различить?