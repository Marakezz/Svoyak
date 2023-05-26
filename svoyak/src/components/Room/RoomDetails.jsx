import React from "react";
import socket from "../../socket";

import { FiUsers } from 'react-icons/fi';
import { RiDeleteBin7Line } from 'react-icons/ri';
import { BiLogOut, BiCrown } from 'react-icons/bi';
import { TbMicrophone2 } from 'react-icons/tb';

function RoomDetails({
    roomId,
    users,
    userName,
    onExitFromRoom
}) {
    const onSendMessage = () => {
        socket.emit('ROOM:NEW_MESSAGE', {
            roomId,
            users,
            userName,
            onExitFromRoom
        }); 
    }

    return (
        <div
            className="
                flex
                flex-col
                border-r-2
                border-gray-100
                w-full
                md:w-1/4
                lg:w-1/5
                h-auto
                md:h-screen
            "
        >   
            {/* Top 
            <div
                className="
                    border-b-2
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
                    Комната
                </div>
            </div>
            */}

            {/* Room Details */}
            <div
                className="
                    border-b-2
                    border-gray-100
                    w-full
                    p-2
                    flex
                    flex-row
                    justify-between
                    align-middle
                "
            > 
                <div className="flex flex-col gap-0 w-4/5 md:w-auto truncate md:break-words">
                    <div
                        className="
                            text-black
                            text-lg
                            font-semibold
                        "
                    >
                        {roomId}
                        {/* Лучше выводить название комнаты  */}
                    </div>
                    <div className="flex flex-row gap-3">
                        {/* Здесь можно выводить инфу о комнате, например, количество игроков, открытая/закрытая и тд. */}
                        <div className="flex flex-row gap-1 text-neutral-600 justify-center">
                            <FiUsers size={18} className="inline-block my-auto"/> <span className="inline-block text-base font-semibold align-middle">{users.length}</span>
                        </div>

                    </div>
                </div>
                <button
                    onClick={onExitFromRoom}
                    className="
                        rounded
                        bg-rose-50
                        hover:bg-rose-100
                        text-rose-500
                        text-base
                        font-semibold
                        w-12
                        h-12
                        p-2
                        py-auto
                        flex
                        md:hidden
                        justify-center
                    "
                >
                    <BiLogOut size={22} className="inline-block my-auto"/>
                </button>
            </div>

            {/* Players list */}
            <div
                className="
                    hidden
                    border-b-2
                    border-gray-100
                    w-full
                    md:flex
                    flex-col
                    p-2
                    px-1
                    gap-1
                    h-full
                    overflow-y-auto
                "
            >
                <div
                    className="
                        text-neutral-600
                        text-sm
                        font-semibold
                        px-1
                    "
                >
                    Список игроков
                </div>
                <div className="flex flex-col">
                    {users.map((name, index) =>
                        <div 
                            className="
                                flex
                                flex-row
                                justify-between
                                align-middle
                                bg-white
                                hover:bg-neutral-100
                                rounded
                                p-1
                                transition
                            " 
                            key={name + index}>
                                <div
                                    className="
                                        flex
                                        flex-row
                                        gap-1
                                    " 
                                >
                                    {/* Добавить if(тип игрока = ведущий){показываем иконку} */} 
                                    <span 
                                        title="Ведущий"
                                        className="
                                            rounded
                                            bg-purple-600
                                            text-white
                                            text-sm
                                            font-semibold
                                            p-1
                                            flex
                                            justify-center
                                            transition
                                        "
                                    >
                                        <TbMicrophone2 size={16} className="inline-block my-auto"/>
                                    </span> 
                                    <span className="text-base font-semibold">{name}</span>
                                </div>
                                {/* Добавить if(тип пользователя = ведущий, и данный игрок в списке не он){показываем кнопку удалить игрока} */} 
                                <button
                                    onClick={()=>{}}
                                    className="
                                        rounded
                                        text-neutral-300
                                        hover:text-rose-500
                                        text-base
                                        font-semibold
                                        p-1
                                        py-auto
                                        flex
                                        justify-center
                                        transition
                                    "
                                >
                                    <RiDeleteBin7Line className="inline-block my-auto"/>
                                </button>

                        </div>
                    )}
                </div>
            </div>

            {/* Bottom */}
            <div
                className="
                    hidden
                    border-b-2
                    border-gray-100
                    w-full
                    md:flex
                    flex-row
                    justify-center
                    p-2
                "
            >
                <button
                    onClick={onExitFromRoom}
                    className="
                        rounded
                        bg-rose-50
                        hover:bg-rose-100
                        text-rose-500
                        text-base
                        font-semibold
                        w-full
                        p-2
                        flex
                        flex-row
                        justify-center
                        gap-1
                    "
                >
                    <BiLogOut size={22} className="inline-block my-auto"/>
                    <span className="inline-block align-center">Выход</span> 
                </button>
            </div>
                
        </div>
    )
}

export default RoomDetails;