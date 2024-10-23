import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    water: null,
    waters: [],
    loading: false,
    error: null,
};

const waterSlice = createSlice({
    name: "water",
    initialState,
    reducers: {
        waterRequest: (state) => {
            state.loading = true;
        },
        waterSuccess: (state, action) => {
            state.loading = false;
            state.water = action.payload;
        },
        waterFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        waterSet: (state, action) => {
            state.loading = false;
            state.waters = action.payload;
        },
    }
});

export const { waterRequest, waterSuccess, waterFailure, waterSet } = waterSlice.actions;
export default waterSlice.reducer;