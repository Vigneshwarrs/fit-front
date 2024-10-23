import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    workout: null,
    workouts: [],
    loading: false,
    error: null,
};

const workoutSlice = createSlice({
    name: "workout",
    initialState,
    reducers: {
        workoutRequest: (state)=>{
            state.loading = true;
        },
        workoutSuccess: (state, action) => {
            state.loading = false;
            state.workout = action.payload;
        },
        workoutFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        workoutUpdate: (state, action) => {
            state.workout = action.payload;
        },
        workoutsSet: (state, action) => {
            state.loading = false;
            state.workouts = action.payload;
        },
        workoutDelete: (state, action) => {
            state.workouts = action.payload;
        },
        clearWorkoutState: (state, action) => {
            state.workouts = [];
            state.workout = null;
            state.loading = false;
            state.error = null;
        }
    }
});

export const { workoutRequest, workoutSuccess, workoutFailure, workoutUpdate, workoutsSet, workoutDelete, clearWorkoutState } = workoutSlice.actions;

export default workoutSlice.reducer;