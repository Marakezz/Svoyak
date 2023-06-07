import React from 'react';
import axios from 'axios';
import socket from '../socket';



function JoinBlock({onLogin}) {
   
    const [roomName, setRoomName] = React.useState('');
    const [userName, setUserName] = React.useState('');
    const [isLoading, setLoading] = React.useState(false);
    const [showAllRoomsToggle, setShowAllRoomsToggle] = React.useState(false);
    const [allRooms, setAllRooms] = React.useState([]);
    const [isChosen, setIsChosen] = React.useState(false);

    const showAllRooms = async () => {
        const data = await axios.get(`/allRooms`); 
        setRoomName('');
        setShowAllRoomsToggle(true);
        setIsChosen(true);
        setAllRooms(data.data);
        if (!socket.connected) {
            socket.connect();
        }
    }

    const makeNewRoom = () => {
        setShowAllRoomsToggle(false);
        setIsChosen(true);
        if (!socket.connected) {
            socket.connect();
        }
    }

    const onMakeNewRoom = async () => {
        if(!roomName || !userName){
           return alert('Неверные данные');
        }
        const obj =  {
            roomName,
            userName, 
            role : 'admin'
        }
        setLoading(true);
        await axios.post('/rooms', obj).then((res) => {
            if(res.data === 'RoomIsAlreadyExist'){
                alert('Такая комната уже существует');
                setLoading(false);
            }  else {
                onLogin(obj); 
            }
        })
    };

    const onEnterToRoom =  (name) => {
        if(!userName){
           return alert('Неверные данные');
        }
        setRoomName(name);
        const obj =  {
            roomName: name, //Стоит изменить(мб промисами) потому что функция почти как onEnter, но не успевает срабатывать смена стейта комнаты, перед подключением
            userName, 
            role : 'player'
        }
        setLoading(true);
        // await axios.post('/rooms', obj); - нужен только для создания комнаты
        onLogin(obj); 
    };


    return (
        <>
            <div>
                {isChosen ? <div>
                    {showAllRoomsToggle ?
                        <div className='ml-2'>
                            <button className='btn btn-success border-2 border-blue-300 rounded-md p-0.5 my-2 font-bold bg-gray-300' onClick={() => setShowAllRoomsToggle(false)}>Создать новую комнату</button>
                            <h2 className='font-bold'>Ваше имя:</h2>
                            <input className='border-2 border-blue-300 rounded-md p-0.5 mr-10 mb-5'
                                type="text" placeholder='Ваше имя' value={userName} onChange={e => setUserName(e.target.value)} />
                                <h2>Количество комнат: {allRooms.length}</h2>
                            <ul>
                                {allRooms.map((name, index) =>
                                    <li key={name + index}>
                                        Комната: {name}
                                        <button onClick={() => onEnterToRoom(name)}
                                            className='btn btn-success border-2 border-blue-300 rounded-md p-0.5 ml-2 mb-1'>Присоединиться</button>
                                    </li>)}
                            </ul>
                        </div>
                        :
                        <div className="join-block text-center border-double border-b-8 mt-4">
                            <input className='border-2 border-blue-300 rounded-md p-0.5 mr-10'
                                type="text" placeholder='Название комнаты' value={roomName} onChange={e => setRoomName(e.target.value)} />
                            <input className='border-2 border-blue-300 rounded-md p-0.5 mr-10'
                                type="text" placeholder='Ваше имя' value={userName} onChange={e => setUserName(e.target.value)} />
                            <button disabled={isLoading} onClick={onMakeNewRoom}
                                className='btn btn-success border-2 border-blue-300 rounded-md p-0.5' >
                                {isLoading ? 'Создаем...' : 'Создать комнату'}
                            </button>
                            <button className='btn btn-success border-2 border-blue-300 rounded-md p-0.5 ml-4 font-bold bg-gray-300'
                                onClick={showAllRooms}>Войти в комнату</button>
                        </div>}
                </div>
                    :
                    <div className='mt-2'>
                        <button className='btn btn-success border-2 border-blue-300 rounded-md p-0.5 ml-4 font-bold'
                            onClick={showAllRooms}>Войти в комнату</button>
                        <button className='btn btn-success border-2 border-blue-300 rounded-md p-0.5 ml-4 font-bold'
                            onClick={makeNewRoom}>Создать комнату</button>
                    </div>}

            </div>
        </>
    );
}

export default JoinBlock;