import api from '../utils/api';
export const getGoals = () => {
  return api.get('/goal');
};
export const getGoal = (goalId) => {
  return api.get(`/goal/${goalId}`);
};
export const createGoal = (goal) => {
  return api.post('/goal', goal);
};
export const deleteGoal = (goalId) => {
  return api.delete(`/goal/${goalId}`);
};
export const updateGoal = (goalId, updatedGoal) => {
  return api.put(`/goal/${goalId}`, updatedGoal);
};
