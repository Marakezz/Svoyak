import React from "react";
import socket from "../socket";
import { AiOutlineArrowRight } from 'react-icons/ai';

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
        //chat
        <div
            className="
                flex
                flex-col
                border-l-2
                border-gray-100
                w-full
                md:w-1/4
                lg:w-1/5
                h-1/2
                md:h-screen
            "
        >  
            {/* Top */}
            <div
                className="
                    border-t-2
                    border-b-2
                    md:border-0
                    md:border-b-2
                    border-gray-100
                    w-full
                    flex
                    flex-row
                    justify-center
                    p-4
                    py-2
                "
            >
                <div
                    className="
                        text-neutral-600
                        text-base
                        font-semibold
                        text-center
                    "
                >
                    Чат комнаты
                </div>
            </div>
            <div 
                ref={messagesRef}
                className="
                    border-b-2
                    border-gray-100
                    w-full
                    flex
                    flex-col
                    py-1
                    gap-1
                    h-full
                    overflow-y-auto
                    scrolling-touch
                "
            >   
                {
                    messages.map((message, index) => (
                        <div 
                            key={index} 
                            className="relative message px-2"
                        >
                            <span className='float-left font-semibold text-blue-700'>{message.userName}</span>
                            <span className="text-black mr-2">:</span>
                            <span className="text-black break-words">{message.text}</span>
                        </div>
                        ))
                }    
            </div>
            <div 
                ref={messagesRef}
                className="
                    border-b-2
                    border-gray-100
                    w-full
                    flex
                    flex-row
                    p-2
                    gap-2
                    bg-white
                "
            > 
                <textarea 
                    placeholder="Отправить сообщение"
                    className="
                        transition
                        px-2
                        py-2
                        leading-tight
                        border-2
                        hover:border-2
                        border-gray-200
                        hover:border-blue-700
                        rounded-md
                        bg-white
                        w-full
                        resize-none
                        hover:resize-y
                        h-[40px]
                        hover:max-h-[80px]
                        overflow-hidden
                        truncate 
                    "
                    value={messageValue}
                    onChange={(e) => setMessageValue(e.target.value)}
                    rows="3"/>
                <button 
                        onClick={onSendMessage}
                        type='button'
                        className="
                            transition
                            py-2
                            px-4
                            bg-blue-700
                            hover:opacity-70
                            rounded
                            text-white
                        ">
                        <AiOutlineArrowRight />
                    </button>    
                </div>
        </div>
    );

}

export default Chat;