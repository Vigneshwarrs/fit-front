import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    nutritions: [],
    loading: false,
    error: null,
    nutrition: null,
};

const nutritionSlice = createSlice({
    name: "nutrition",
    initialState,
    reducers: {
        nutritionRequest: (state) => {
            state.loading = true;
        },
        nutritionSuccess: (state, action) => {
            state.loading = false;
            state.nutrition = action.payload;
        },
        nutritionError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        nutritionListSet: (state, action) => {
            state.loading = false;
            state.nutritions = action.payload;
        },
        nutritionFetch: (state, action) => {
            state.loading = false;
            state.nutrition = action.payload;
        },
        nutritionUpdate: (state, action) => {
            state.loading = false;
            state.nutritions = action.payload;
        },
        nutritionDelete: (state, action) => {
            state.loading = false;
            state.nutritions = action.payload;
        },
    },
});

export const {nutritionRequest, nutritionSuccess, nutritionError, nutritionFetch, nutritionListSet, nutritionDelete, nutritionUpdate} = nutritionSlice.actions;
export default nutritionSlice.reducer;