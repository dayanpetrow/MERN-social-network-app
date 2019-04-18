import { takeLatest, call, put, all } from "redux-saga/effects";
import axios from "axios";
import * as actions from "../actions";

export function* rootSaga() {
  yield all([watchSetUser()]);
}

function* watchSetUser() {
    yield takeLatest(actions.TEST_DISPATCH, workerSetUser);
  }

function* workerSetUser(action) {
  try {
      const response = yield call(setUser, action.user);
    yield console.log('success');
  } catch (error) {
    yield console.log('error');
  }
}


function setUser(user) {
    return user;
}