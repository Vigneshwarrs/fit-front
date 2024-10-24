import api from '../utils/api';

export const getNutritionSuggestion = async () => {
  try {
    const response = await api.get('/suggestions/nutrition');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getWorkoutSuggestion = async () => {
  try {
    const response = await api.get('/suggestions/workout');
    return response.data;
  } catch (error) {
    throw error;
  }
};
