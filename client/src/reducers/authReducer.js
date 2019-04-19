import * as actions from "../actions";
import isEmpty from "../utils/isEmpty";

const initialState = {
  isAuthenticated: false,
  user: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case actions.LOGIN_USER_SUCCESS:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    case actions.LOGOUT_USER_SUCCESS:
      return {
          ...state,
          isAuthenticated: false,
          user: action.payload
      }
    default:
      return state;
  }
}
