import axios from 'axios';
import { baseURL } from '../utils/api';

// const API_URL = 'https://fit-back-nqqi.onrender.com/api/auth/';
// const API_URL = "http://localhost:5000/api/auth/";

export const signIn = (email, password) => {
  return axios.post(`${baseURL}/auth/sign-in`, { email, password });
};

export const signUp = (data) => {
  return axios.post(`${baseURL}/auth/sign-up`, data);
};

export const forgotPassword = (email) => {
  return axios.post(`${baseURL}/auth/forgot-password`, email);
};

export const resetPassword = (token, password) => {
  return axios.post(`${baseURL}/auth/reset-password/${token}`, password );
};

export const activateUser = (token) => {
  return axios.get(`${baseURL}/auth/activate/${token}`);
}