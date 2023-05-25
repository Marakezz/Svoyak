import React from "react";
import socket from "../socket";

function Chat({users, messages, userName, roomId, onAddMessage, onExitFromRoom}) {
    const [messageValue, setMessageValue ] = React.useState('');
    const messagesRef = React.useRef(null);


    const onSendMessage = () => {
        socket.emit('ROOM:NEW_MESSAGE', {
            userName,
            roomId,
            text: messageValue
        }); 
        onAddMessage({
            userName,
            text: messageValue
        });
        setMessageValue('');
    }

    React.useEffect(() => {
        messagesRef.current.scrollTo(0,99999);
    }, [messages]);

    return (
        <div className="chat mb-4 mx-4 w-full ">
            <div className="chat-users border-b-2 border-gray-600">
                Комната: <b>{roomId}</b>
                <button className='btn btn-success border-2 border-blue-300 rounded-md p-0.5 my-2 font-bold ml-4'
                onClick={onExitFromRoom}>Выйти из комнаты</button>
                <hr />
                <b>Онлайн ({users.length}):</b>
                <ul>
                    {users.map((name, index) => <li key={name + index}>Пользователь: {name}</li>)}
                </ul>
            </div>
            <div className="chat-messages">
                {/* Тут стили для прокрутки height-[100vw] overflow-scroll */}
                <div ref={messagesRef} className="messages">
                    {
                        messages.map((message, index) => (
                        <div key={index} className="message flex flex-row">
                            <span className=' mr-4'>{message.userName} : </span>
                             <p className="font-bold font-sans text-blue-700">{message.text}</p>
                             
                        </div>
                        ))
                    }

                </div>
                <form>
                    <textarea 
                    className='form-control border-4 rounded-md bg-gray-300 w-2/3 '
                    value={messageValue}
                    onChange={(e) => setMessageValue(e.target.value)}
                    rows="3"></textarea>
                    <button 
                    onClick={onSendMessage}
                    type='button'
                    className="btn btn-primary">
                        Отправить
                    </button>
                </form>
            </div>
        </div>
    );

}

export default Chat;