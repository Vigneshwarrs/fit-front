import axios from 'axios';
import store from '../redux/store';


const api = axios.create({
  // baseURL: 'https://fittrack-backend-mu3q.onrender.com/api',
  baseURL: 'http://localhost:5000/api',
  // baseURL: "https://fit-back-nqqi.onrender.com/api"
});

api.interceptors.request.use((config) => {
  const auth = store.getState().auth;
  const token = auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
