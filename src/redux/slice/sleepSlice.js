import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    error: null,
    sleep: null,
    sleeps: [],
};

const sleepSlice = createSlice({
   name: "sleep",
   initialState,
   reducers: {
     getSleepRequest: (state) => {
        state.loading = true;
     },
     getSleepSuccess: (state, action) => {
        state.loading = false;
        state.sleep = action.payload;
     },
     getSleepFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
     },
     sleepSet: (state, action) => {
       state.sleeps = action.payload;
       state.loading = false;
     }
   } 
});

export const {getSleepFailure, getSleepRequest, getSleepSuccess, sleepSet} = sleepSlice.actions;

export default sleepSlice.reducer;