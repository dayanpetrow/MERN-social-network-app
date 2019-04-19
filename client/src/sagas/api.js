import axios from "axios";

/* SIGN UP USER */
export const signUpUser = userData => {
  return axios.post("/api/users/register", userData);
};

/* LOGIN USER - GET USER TOKEN */
export const loginUser = userData => {
  return axios.post("/api/users/login", userData);
};
