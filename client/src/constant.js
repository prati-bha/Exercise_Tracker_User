// export const API_URL = "https://exercise-tracker-mern-stack.herokuapp.com";
export const API_URL = "http://bf1a77b7d8e4.ngrok.io";

export const ENDPOINTS = {
  LOGIN: `${API_URL}/users/login`,
  SIGN_UP: `${API_URL}/users/signUp`,
  USERS: `${API_URL}/users`,
  CHECK_USERNAME: `${API_URL}/users/username`,
  EXERCISES: `${API_URL}/exercises`,
  ADD_EXERCISE: `${API_URL}/exercises/add`,
  ADD_USER: `${API_URL}/users/username`,
  UPDATE_EXERCISE: `${API_URL}/exercises/update/`,
  LOGOUT: `${API_URL}/users/logout`,
};

export const getToken = {
  Authorization: `Bearer ${localStorage.getItem("token")}`,
};
