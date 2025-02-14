import { createStore } from "redux";

const store = createStore(rootReducer);

const initialState = {
    userName: '',
};

function rootReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_USER_NAME':
            return {
                ...state,
                userName: action.payload
            };
        default: return state;
    }
}

export default store;