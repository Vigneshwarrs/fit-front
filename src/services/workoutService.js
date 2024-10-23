import api from '../utils/api';
export const getWorkouts = () => {
  return api.get('/workout');
};
export const addWorkout = (workout) => {
  return api.post('/workout', workout);
};
export const getExercises = () => {
  return api.get('/workoutOption');
};

export const getWorkoutByDate = (date) => {
  return api.get(`/workout?date=${date}`);
};