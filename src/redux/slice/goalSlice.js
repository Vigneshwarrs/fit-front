import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    goals: [], 
    goal: null,
    loading: false,
    error: null,
};

const goalSlice = createSlice({
    name: 'goal',
    initialState,
    reducers: {
        goalRequest: (state, action) =>{
            state.loading = true;
            state.error = null;
        },
        goalSuccess: (state, action) => {
            state.loading = false;
            state.goal = action.payload;
        },
        goalFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        goalFetch: (state, action) => {
            state.goal = action.payload;
            state.loading = false;
            state.error = null;
        },
        goalUpdate: (state, action) => {
            state.goal = {...state.goal,...action.payload };
            state.loading = false;
            state.error = null;
        },
        goalListFetch: (state, action) => {
            state.goals = action.payload;
            state.loading = false;
            state.error = null;
        },
        goalDelete: (state, action) => {
            state.goals = action.payload;
            state.loading = false;
            state.error = null;
        },
    }
});

export const { goalRequest, goalSuccess, goalFailure, goalFetch, goalUpdate, goalListFetch, goalDelete } = goalSlice.actions;
export default goalSlice.reducer;