import api from '../utils/api';
export const getNutrition = () => {
  return api.get('/nutrition');
};
export const getNutritionById = (nutritionId) => {
  return api.get(`/nutrition/${nutritionId}`);
};
export const createNutrition = (date, meals) => {
  return api.post('/nutrition',  {date,meals  });
};
export const updNutrition = (nutritionId, updatedNutrition) => {
  return api.put(`/nutrition/${nutritionId}`, updatedNutrition);
};
export const delNutrition = (nutritionId) => {
  return api.delete(`/nutrition/${nutritionId}`);
};
export const getFoodItems = () => {
  return api.get('/foodItem');
};

export const getDailyNutrition = (date) => {
  return api.get(`/nutrition/daily/${date}`);
};