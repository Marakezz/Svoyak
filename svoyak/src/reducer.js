
const reducer =  (state, action) => {
    switch (action.type) {
        case 'JOINED': 
            return {
                ...state,
                joined: true, 
                userName: action.payload.userName,
                roomName: action.payload.roomName,
                role: action.payload.role,
            };

            case 'UNJOINED': 
            return {
                ...state,
                joined: false, 
                roomName: null,
                role: null,
                users: [],
                messages: []
            };

            case 'SET_DATA':  
            return {
                ...state,
                users: action.payload.users,
                messages: action.payload.messages,
            };

            case 'SET_USERS':  
            return {
                ...state,
                users: action.payload,
            };

            case 'NEW_MESSAGE':  
            return {
                ...state,
                messages: [...state.messages, action.payload],
            };

            case 'SWAP_ROLE_TO': 
                return {
                    ...state,
                    role: action.payload
                }

            case 'CHANGE_COLOR':
                return{
                    ...state,
                    colorToggle: !action.payload
                }

        default:
            return state; //если ничего не передали то возвращает старое состояние
    }
}

export default reducer;