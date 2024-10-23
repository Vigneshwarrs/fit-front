import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { addDays, startOfDay, format } from 'date-fns';

// Async Thunks
export const fetchWaterData = createAsyncThunk(
  'water/fetchWaterData',
  async () => {
    const response = await api.get('/water');
    return response.data;
  }
);

export const updateWaterIntake = createAsyncThunk(
  'water/updateWaterIntake',
  async ({ date, glassCount, goal }) => {
    const response = await api.post('/water', {
      date,
      glassCount,
      goal
    });
    return response.data;
  }
);

export const fetchWaterHistory = createAsyncThunk(
  'water/fetchHistory',
  async (dateRange) => {
    const response = await api.get('/water/stats', {
      params: dateRange
    });
    return response.data;
  }
);

const waterSlice = createSlice({
  name: 'water',
  initialState: {
    currentDay: {
      date: new Date(),
      glassCount: 0,
      goal: 8,
    },
    chartData: [],
    history: [],
    loading: false,
    error: null,
    stats: {
      weeklyAverage: 0,
      monthlyAverage: 0,
      bestStreak: 0,
      totalWaterConsumed: 0,
      achievementRate: 0
    }
  },
  reducers: {
    incrementGlass: (state) => {
      state.currentDay.glassCount += 1;
    },
    decrementGlass: (state) => {
      if (state.currentDay.glassCount > 0) {
        state.currentDay.glassCount -= 1;
      }
    },
    setGoal: (state, action) => {
      state.currentDay.goal = action.payload;
    },
    setDate: (state, action) => {
      state.currentDay.date = action.payload;
    },
    resetDaily: (state) => {
      state.currentDay.glassCount = 0;
    },
    updateChartData: (state, action) => {
      state.chartData = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Water Data Cases
      .addCase(fetchWaterData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWaterData.fulfilled, (state, action) => {
        state.loading = false;
        state.chartData = action.payload;
        state.error = null;
        state.stats = calculateStats([...state.history, ...action.payload]);
      })
      .addCase(fetchWaterData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update Water Intake Cases
      .addCase(updateWaterIntake.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateWaterIntake.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(state.history)) {
          state.history.push(action.payload);
        } else {
          state.history = [action.payload];
        }
        
        state.stats = calculateStats(state.history);
        if (isToday(new Date(action.payload.date))) {
          state.chartData = updateTodayInChartData(state.chartData, action.payload);
        }
      })
      .addCase(updateWaterIntake.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch History Cases
      .addCase(fetchWaterHistory.fulfilled, (state, action) => {
        state.history = action.payload;
        state.stats = calculateStats(action.payload);
      });
  }
});

// Helper Functions
const calculateStats = (history) => {
  if (!history.length) return {
    weeklyAverage: 0,
    monthlyAverage: 0,
    bestStreak: 0,
    totalWaterConsumed: 0,
    achievementRate: 0
  };

  const now = new Date();
  const weekAgo = addDays(now, -7);
  const monthAgo = addDays(now, -30);
  
  const weeklyEntries = history.filter(entry => 
    new Date(entry.date) >= weekAgo
  );
  
  const monthlyEntries = history.filter(entry => 
    new Date(entry.date) >= monthAgo
  );

  const totalWaterConsumed = history.reduce(
    (total, entry) => total + (entry.glassCount * 250), // 250ml per glass
    0
  );

  const achievedDays = history.filter(
    entry => entry.glassCount >= entry.goal
  ).length;

  return {
    weeklyAverage: weeklyEntries.length > 0 
      ? weeklyEntries.reduce((acc, curr) => acc + curr.glassCount, 0) / weeklyEntries.length 
      : 0,
    monthlyAverage: monthlyEntries.length > 0 
      ? monthlyEntries.reduce((acc, curr) => acc + curr.glassCount, 0) / monthlyEntries.length 
      : 0,
    bestStreak: calculateBestStreak(history),
    totalWaterConsumed,
    achievementRate: history.length > 0 
      ? (achievedDays / history.length) * 100 
      : 0
  };
};

const calculateBestStreak = (history) => {
  if (!history.length) return 0;
  
  let currentStreak = 1;
  let bestStreak = 1;
  const sortedHistory = [...history].sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );
  
  for (let i = 1; i < sortedHistory.length; i++) {
    const prevDate = new Date(sortedHistory[i-1].date);
    const currDate = new Date(sortedHistory[i].date);
    const dayDiff = Math.abs(
      (startOfDay(currDate) - startOfDay(prevDate)) / (1000 * 60 * 60 * 24)
    );
    
    if (dayDiff === 1 && sortedHistory[i].glassCount >= sortedHistory[i].goal) {
      currentStreak++;
      bestStreak = Math.max(bestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }
  
  return bestStreak;
};

const isToday = (date) => {
  const today = new Date();
  return format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
};

const updateTodayInChartData = (chartData, newEntry) => {
  const updatedData = [...chartData];
  const todayIndex = updatedData.findIndex(
    entry => format(new Date(entry.date), 'yyyy-MM-dd') === format(new Date(newEntry.date), 'yyyy-MM-dd')
  );
  
  if (todayIndex >= 0) {
    updatedData[todayIndex] = newEntry;
  } else {
    updatedData.push(newEntry);
  }
  
  return updatedData;
};

export const { 
  incrementGlass, 
  decrementGlass, 
  setGoal, 
  setDate, 
  resetDaily,
  updateChartData
} = waterSlice.actions;

export default waterSlice.reducer;