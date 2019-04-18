import { takeLatest, call, put, all } from "redux-saga/effects";
import axios from "axios";
import * as actions from "../actions";

export function* rootSaga() {
  yield all([watchSetUser()]);
}

function* watchSetUser() {
  yield takeLatest(actions.SIGNUP_USER, workerSignUpUser);
}

function* workerSignUpUser(action) {
  try {
    const response = yield call(signUpUser, action.userData);
    action.history.push('/login');
  } catch (err) {
    yield put({ type: actions.SIGNUP_USER_FAILURE, payload: err.response.data });
  }
}

const signUpUser = userData => {
    return axios.post("/api/users/register", userData)
}