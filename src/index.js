import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store  from './redux/store';
import App from './App';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <LocalizationProvider dateAdapter={AdapterDateFns}>
  <Provider store={store}>
    {/* <PersistGate loading={null} persistor={persistor}> */}
      <App />
    {/* </PersistGate> */}
  </Provider>
  </LocalizationProvider>
);
