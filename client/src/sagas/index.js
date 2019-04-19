import { takeLatest, call, put, all } from "redux-saga/effects";
import * as actions from "../actions";
import * as API from "./api";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

export function* rootSaga() {
  yield all([watchSetUser(), watchLoginUser()]);
}

function* watchSetUser() {
  yield takeLatest(actions.SIGNUP_USER, workerSignUpUser);
}

function* watchLoginUser() {
  yield takeLatest(actions.LOGIN_USER, workerLoginUser);
}

function* workerSignUpUser(action) {
  try {
    yield call(API.signUpUser, action.userData);
    action.history.push("/login");
  } catch (err) {
    yield put({
      type: actions.SIGNUP_USER_FAILURE,
      payload: err.response.data
    });
  }
}

function* workerLoginUser(action) {
  try {
    const response = yield call(API.loginUser, action.userData);
    const { token } = response.data;
    localStorage.setItem("jwtToken", token);
    //set token to auth header
    setAuthToken(token);
    //decode jwt
    const decoded = jwt_decode(token);
    //set current user
    yield put({ type: actions.LOGIN_USER_SUCCESS, payload: decoded });
  } catch (err) {
    yield put({ type: actions.LOGIN_USER_FAILURE, payload: err.response.data });
  }
}
