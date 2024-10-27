import axios from 'axios';
import { baseURL } from '../utils/api';

const apiURL = `${baseURL}/api/auth`;

export const signIn = (email, password) => {
  return axios.post(`${apiURL}/sign-in`, { email, password });
};

export const signUp = (data) => {
  return axios.post(`${apiURL}/sign-up`, data);
};

export const forgotPassword = (email) => {
  return axios.post(`${apiURL}/forgot-password`, email);
};

export const resetPassword = (token, password) => {
  return axios.post(`${apiURL}/reset-password/${token}`, password );
};

export const activateUser = (token) => {
  return axios.get(`${apiURL}/activate/${token}`);
}