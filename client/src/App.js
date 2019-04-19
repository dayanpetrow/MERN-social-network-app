import React, { Component } from "react";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import rootReducer from "./reducers";
import { rootSaga } from "./sagas";
import { BrowserRouter as Router, Route } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { LOGIN_USER_SUCCESS, LOGOUT_USER } from "./actions";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/Auth/LoginPage";
import SignupPage from "./pages/Auth/SignupPage";

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

// create store
const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(sagaMiddleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

// run the saga middleware
sagaMiddleware.run(rootSaga);

/* 
  CHECK LOCAL STORAGE FOR THE BEARER TOKEN,
  ADD AUTHORIZATION TO AXIOS DEFAULTS (setAuthToken)
  AND SET THE USER DATA IN THE APPLICATION STATE 
*/
if (localStorage.jwtToken) {
  setAuthToken(localStorage.jwtToken);
  const decodedUserFromToken = jwt_decode(localStorage.jwtToken);
  store.dispatch({ type: LOGIN_USER_SUCCESS, payload: decodedUserFromToken });
  //check for expired token
  const currentTime = Date.now() / 1000;
  if(decodedUserFromToken.exp < currentTime) {
    store.dispatch({ type: LOGOUT_USER });
    window.location.href = '/login';
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={HomePage} />
            <div className="container">
              <Route exact path="/login" component={LoginPage} />
              <Route exact path="/signup" component={SignupPage} />
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
