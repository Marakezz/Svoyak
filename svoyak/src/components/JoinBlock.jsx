import React from 'react';
import axios from 'axios';
import socket from '../socket';



function JoinBlock({onLogin}) {
   
    const [roomId, setRoomId] = React.useState('');
    const [userName, setUserName] = React.useState('');
    const [isLoading, setLoading] = React.useState(false);
    const [showAllRoomsToggle, setShowAllRoomsToggle] = React.useState(false);
    const [allRooms, setAllRooms] = React.useState([]);
    const [isChosen, setIsChosen] = React.useState(false);

    const showAllRooms = async () => {
        const data = await axios.get(`/allRooms`); 
        setRoomId('');
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

    const onEnter = async () => {
        if(!roomId || !userName){
           return alert('Неверные данные');
        }
        const obj =  {
            roomId,
            userName, 
        }
        setLoading(true);
        await axios.post('/rooms', obj).then((res) => {
            if(res.data == 'RoomIsAlreadyExist'){
                alert('Такая комната уже существует');
                setLoading(false);
            }  else {
                onLogin(obj); 
            }
        })
    };

    const onEnter2 =  (name) => {
        if(!userName){
           return alert('Неверные данные');
        }
        setRoomId(name);
        const obj =  {
            roomId: name, //Стоит изменить(мб промисами) потому что функция почти как onEnter, но не успевает срабатывать смена стейта комнаты, перед подключением
            userName, 
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
                                        <button onClick={() => onEnter2(name)}
                                            className='btn btn-success border-2 border-blue-300 rounded-md p-0.5 ml-2 mb-1'>Присоединиться</button>
                                    </li>)}
                            </ul>
                        </div>
                        :
                        <div className="join-block text-center border-double border-b-8 mt-4">
                            <input className='border-2 border-blue-300 rounded-md p-0.5 mr-10'
                                type="text" placeholder='Room ID' value={roomId} onChange={e => setRoomId(e.target.value)} />
                            <input className='border-2 border-blue-300 rounded-md p-0.5 mr-10'
                                type="text" placeholder='Ваше имя' value={userName} onChange={e => setUserName(e.target.value)} />
                            <button disabled={isLoading} onClick={onEnter}
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