import axios from "axios";
import store from "../redux/store";

export const baseURL = "https://fit-back-nqqi.onrender.com/api";
const api = axios.create({
  baseURL,
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
