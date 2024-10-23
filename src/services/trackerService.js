import api from "../utils/api";

export const createSleep = (object) => {
    return api.post('/sleep', object);
}

export const getSleep = () => {
    return api.get('/sleep');
}

export const getDailyNutrition = (date) => {
    return api.get(`/nutrition/daily/${date}`);
  };
  export const getWorkoutByDate = (date) => {
    return api.get(`/workout/${date}`);
  };
export const getSleepByDate = (date) => {
    return api.get(`/sleep/${date}`);
}

export const updateSleep = (data, object) => {
    return api.put(`/sleep/${data}`, object);
}

export const deleteSleep = (data) => {
    return api.delete(`/sleep/${data}`);
}

export const getWeights = () => {
    return api.get('/weight');
}

export const getWeightByDate = (date) => {
    return api.get(`/weight/${date}`);
}

export const createWeight = (object) => {
    return api.post('/weight', object);
}

export const updateWeight = (data, object) => {
    return api.put(`/weight/${data}`, object);
}

export const deleteWeight = (data) => {
    return api.delete(`/weight/${data}`);
}

export const getWaters = () =>{
    return api.get('/water');
}

export const getWaterByDate = (date) => {
    console.log('getWaterByDate', date);
    return api.get(`/water/${date}`);
}

export const createWater = (object) => {
    return api.post('/water', object);
}

export const updateWater = (data, object) => {
    return api.put(`/water/${data}`, object);
}

export const deleteWater = (data) => {
    return api.delete(`/water/${data}`);
}