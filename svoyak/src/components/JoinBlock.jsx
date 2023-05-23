import React, { Component, useState } from 'react';
import axios from 'axios';



function JoinBlock({onLogin}) {
   
    const [roomId, setRoomId] = React.useState('');
    const [userName, setUserName] = React.useState('');
    const [isLoading, setLoading] = React.useState(false);


    const onEnter = async () => {
        if(!roomId || !userName){
           return alert('Неверные данные');
        }
        const obj =  {
            roomId,
            userName, 
        }
        setLoading(true);
        await axios.post('/rooms', obj); 
        onLogin(obj); 
    };

    return (
        <div className="join-block text-center border-double border-b-8 mt-4">
        <input className='border-2 border-blue-300 rounded-md p-0.5 mr-10' 
        type="text" placeholder='Room ID' value={roomId} onChange={e => setRoomId(e.target.value)}/>
        <input className='border-2 border-blue-300 rounded-md p-0.5 mr-10'  
        type="text" placeholder='Ваше имя' value={userName} onChange={e => setUserName(e.target.value)}/>
        <button disabled={isLoading} onClick={onEnter}
            className='btn btn-success border-2 border-blue-300 rounded-md p-0.5' >
            {isLoading ? 'Входим...' : 'Войти/Создать комнату'}
        </button>
        </div>
    );
}

export default JoinBlock;