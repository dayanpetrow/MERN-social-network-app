import * as actions from '../actions';

const initialState = {
    isAuthenticated: false,
    user: {}
};

export default function(state = initialState, action) {
    switch (action.type) {
        case actions.TEST_DISPATCH:
            return {
                ...state,
                user: action.user
            }
        default:
         return state;
    }
};