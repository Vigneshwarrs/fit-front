import api from '../utils/api';

// Fetch dynamic nutrition suggestions based on user goal and profile
export const getNutritionSuggestion = async () => {
  try {
    const response = await api.get('/suggestions/nutrition');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch dynamic workout suggestions based on fitness level and goal
export const getWorkoutSuggestion = async () => {
  try {
    const response = await api.get('/suggestions/workout');
    return response.data;
  } catch (error) {
    throw error;
  }
};
