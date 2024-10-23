import {jwtDecode} from 'jwt-decode';
import { logout } from "./action/authAction"; // Your logout action

const tokenExpirationMiddleware = (store) => (next) => (action) => {
  const token = store.getState().auth.token;

  if (token) {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Current time in seconds

    if (decodedToken.exp < currentTime) {
      store.dispatch(logout());
    }
  }
  next(action);
};

export default tokenExpirationMiddleware;
