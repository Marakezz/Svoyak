import './App.css';
import React from 'react';
import socket from './socket';
import JoinBlock from './components/JoinBlock';
import Chat from './components/Chat';
import reducer from './reducer';
import axios from 'axios';
import TestComponentt from './components/test';


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

  // window.socket = socket; Зачем это?

  return (
<div className='wrapper'>
  {!state.joined ? (<JoinBlock onLogin={onLogin}/>) : (
    <>
  <Chat {...state} onAddMessage={addMessage}/>
  <TestComponentt {...state}/>
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
//Когда только 1 пользователь, показывает что их 0