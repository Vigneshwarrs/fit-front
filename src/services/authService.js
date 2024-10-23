import axios from 'axios';

// const API_URL = 'https://fit-back-nqqi.onrender.com/api/auth/';
const API_URL = "http://localhost:5000/api/auth/";

export const signIn = (email, password) => {
  return axios.post(`${API_URL}sign-in`, { email, password });
};

export const signUp = (data) => {
  return axios.post(`${API_URL}sign-up`, data);
};

export const forgotPassword = (email) => {
  return axios.post(`${API_URL}forgot-password`, email);
};

export const resetPassword = (token, password) => {
  return axios.post(`${API_URL}reset-password/${token}`, password );
};

export const activateUser = (token) => {
  return axios.get(`${API_URL}activate/${token}`);
}