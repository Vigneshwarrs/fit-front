import axios from 'axios';
import api from '../utils/api';
export const getUserProfile = () => {
  return api.get('/user/profile');
};
export const getUser = (id) => {
  return axios.get('http://localhost:5000/user/profile', {headers:{}})
}
export const updateUserProfile = (data) => {
  return api.put('/user/profile', data, {headers: {'Content-Type': 'multipart/form-data'}});
};