import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    error: null,
    weight: null,
    weights: []
};

const weightSlice = createSlice({
    name: "weight",
    initialState,
    reducers: {
        weightSet: (state, action) => {
            state.weights = action.payload;
        },
        getWeightRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        getWeightSuccess: (state, action) => {
            state.loading = false;
            state.weight = action.payload.weight;
        },
        getWeightFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }
    },
});

export const { getWeightFailure, getWeightRequest, getWeightSuccess, weightSet } = weightSlice.actions;
export default weightSlice.reducer;