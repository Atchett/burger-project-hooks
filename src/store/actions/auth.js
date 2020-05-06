import axios from "../../axios/axios-auth";
import * as actionTypes from "./actionTypes";

const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

const authSuccess = (token, userId) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    idToken: token,
    userId: userId,
  };
};

const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAILED,
    error: error,
  };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("expirationDate");
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

const checkAuthTimeout = (expirationTime) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

const API_KEY = `${process.env.REACT_APP_API_KEY}`;

export const auth = (email, password, isSignup) => {
  return (dispatch) => {
    dispatch(authStart());
    const authData = {
      email: email,
      password: password,
      returnSecureToken: true,
    };
    let url = "/accounts:signUp?key=" + API_KEY;
    if (!isSignup) {
      url = "/accounts:signInWithPassword?key=" + API_KEY;
    }
    axios
      .post(url, authData)
      .then((response) => {
        const expirationDate = new Date(
          new Date().getTime() + response.data.expiresIn * 1000
        );
        localStorage.setItem("token", response.data.idToken);
        localStorage.setItem("expirationDate", expirationDate);
        dispatch(authSuccess(response.data.idToken, response.data.localId));
        dispatch(checkAuthTimeout(response.data.expiresIn));
      })
      .catch((err) => {
        dispatch(authFail(err.response.data.error));
      });
  };
};

export const setAuthRedirectPath = (path) => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path: path,
  };
};

export const authCheckState = () => {
  return (dispatch) => {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem("expirationDate"));
      const currDate = new Date();
      if (expirationDate > currDate) {
        dispatch(authGetUserID(token, expirationDate));
      } else {
        dispatch(logout());
      }
    }
  };
};

const authGetUserID = (token, expirationDate) => {
  return (dispatch) => {
    const authData = {
      idToken: token,
    };
    const url = "/accounts:lookup?key=AIzaSyD1OHnmDmjsolSN4COv3dADp5MrZCcLLSw";
    axios
      .post(url, authData)
      .then((response) => {
        const userId = response.data.users[0].localId;
        dispatch(authSuccess(token, userId));
        dispatch(
          checkAuthTimeout(
            (expirationDate.getTime() - new Date().getTime()) / 1000
          )
        );
      })
      .catch((err) => {
        dispatch(authFail(err));
      });
  };
};
