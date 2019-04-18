import * as actions from "../actions";

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case actions.SIGNUP_USER_FAILURE: {
      return Object.assign({}, action.payload);
    }
    default:
      return state;
  }
}
