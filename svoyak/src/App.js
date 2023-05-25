import './App.css';
import React from 'react';
import socket from './socket';
import JoinBlock from './components/JoinBlock';
import Chat from './components/Chat';
import RoomDetails from './components/RoomDetails';
import reducer from './reducer';
import axios from 'axios';
import TestComponentt from './components/test';
import GameDisplay from './components/GameDisplay';


function App() {
  const [state, dispatch] = React.useReducer(reducer, {
    joined: false,
    roomId: null,
    userName: null,
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
  console.log('Написал сообщение'); //Почему дублируется??
  dispatch({
    type: 'NEW_MESSAGE',
    payload: message,
  });
}

React.useEffect( () => {
  socket.on('ROOM:SET_USERS', setUsers);
  socket.on('ROOM:NEW_MESSAGE', addMessage);

  return() => { 
    socket.off('ROOM:SET_USERS', setUsers);
    socket.off('ROOM:NEW_MESSAGE', addMessage); } //Создал unmount (сам) чтоб не вызывалось по нескольку раз
}, []);

  const onLogin = async (obj) => {
    dispatch({
      type: 'JOINED',
      payload: obj,
    });
    socket.emit('ROOM:JOIN',obj);
    const {data} = await axios.get(`/rooms/${obj.roomId}`); 
    dispatch({ 
      type: 'SET_DATA',
      payload: data
    })
  };

  const onExitFromRoom = () => {
    dispatch({
      type: 'UNJOINED',
    })
    // socket.emit('ROOM:UNJOIN', state.roomId, state.userName)
    socket.disconnect();
  }

  // window.socket = socket; Зачем это?

  return (
<div className='wrapper'>
  {!state.joined ? (<JoinBlock onLogin={onLogin}/>) : (
    <>
     <div 
      className='
        flex 
        flex-col
        md:flex-row
        h-screen
      '
     >
      <RoomDetails {...state} onExitFromRoom={onExitFromRoom} />
      <GameDisplay />
      <Chat {...state} onAddMessage={addMessage} onExitFromRoom={onExitFromRoom}/>
      {/*<TestComponentt {...state}/>*/}
     </div>
    </>
  )}
  
  
</div>

  );
}

export default App;


//Проблемы:
// Добавить пароли?
// Если люди выходят с комнаты, то их переписка остается
//Tailwind добавили с -D, т.е. только для разработки
//Если слишком много сообщений то уходит вниз совсем, поправить стили
//Когда только 1 пользователь, показывает что их 0, или нет???
//Когда человек в списке комнат, новые появляющиеся в этот момент комнаты не отображаются
//Если пытаются создать комнату которая уже существует то просто зайдет в нее
//Сделали что при нажатии на "выйти из комнаты" разрывается сокет-соединение, мб не лучший вариант при нагрузке
//Добавить удаление комнаты?