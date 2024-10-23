// import { createStore, applyMiddleware, combineReducers } from 'redux';
// import {thunk} from 'redux-thunk';
// import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
// import { authReducer } from './reducer/authReducer';
// import { goalReducer } from './reducer/goalReducer';
// import { workoutReducer } from './reducer/workoutReducer';
// import { nutritionReducer } from './reducer/nutritionReducer';
// import tokenExpirationMiddleware from './tokenExpirationMiddleware';

// const persistConfig = {
//   key: 'root',
//   storage,
// };

// const rootReducer = combineReducers({
//   auth: persistReducer(persistConfig, authReducer),
//   goals: goalReducer,
//   workouts: workoutReducer,
//   nutritions: nutritionReducer,
// });

// const store = createStore(rootReducer, applyMiddleware(thunk, tokenExpirationMiddleware));
// const persistor = persistStore(store);

// export { store, persistor };

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import goalReducer from './slice/goalSlice';
import nutritionReducer from './slice/nutritionSlice';
import workoutReducer from './slice/workoutSlice';
import waterReducer from './slice/waterSlice';
import weightReducer from './slice/weightSlice';
import sleepReducer from './slice/sleepSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    goal: goalReducer,
    nutrition: nutritionReducer,
    workout: workoutReducer,
    sleep: sleepReducer,
    weight: weightReducer,
    water: waterReducer
  },
});

export default store;
