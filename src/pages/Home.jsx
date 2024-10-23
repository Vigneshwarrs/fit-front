import React, { useEffect, useState } from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Container,
  CircularProgress,
  IconButton,
  Card,
  CardContent,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/system';
import { 
  LocalDrinkRounded,
  LocalFireDepartmentRounded,
  RestaurantRounded,
  NightsStayRounded,
  RefreshRounded
} from '@mui/icons-material';
import { formatISO } from 'date-fns';
import WorkoutChart from '../components/workout/WorkoutChart';
import FoodChart from '../components/food/FoodChart';
import { 
  getSleepByDate, 
  getWaterByDate,
  getWorkoutByDate,
  getDailyNutrition 
} from '../services/trackerService';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));

const MetricCard = ({ title, value, unit, icon, color, isLoading }) => {
  return (
    <StyledCard>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" color="textSecondary">
            {title}
          </Typography>
          <Box sx={{ backgroundColor: `${color}20`, p: 1, borderRadius: '50%' }}>
            {icon}
          </Box>
        </Box>
        {isLoading ? (
          <CircularProgress size={24} />
        ) : (
          <Typography variant="h4" component="div" fontWeight="bold">
            {value}
            <Typography variant="subtitle1" component="span" color="textSecondary">
              {' '}{unit}
            </Typography>
          </Typography>
        )}
      </CardContent>
    </StyledCard>
  );
};

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    sleep: null,
    workout: null,
    water: null,
    calories: null,
  });

    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const [waterRes, workoutRes, sleepRes, nutritionRes] = await Promise.all([
          getWaterByDate(formatISO(Date.now())),
          getWorkoutByDate(),
          getSleepByDate(formatISO(Date.now())),
          getDailyNutrition(formatISO(Date.now())),
        ]);

        setData({
          water: waterRes.data,
          workout: workoutRes.data,
          sleep: sleepRes.data,
          calories: nutritionRes.data,
        });
        console.log({water: waterRes.data,
          workout: workoutRes.data,
          sleep: sleepRes.data,
          calories: nutritionRes.data});
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
  

  useEffect(() => {
    fetchAllData();
  }, []);

  const metrics = [
    {
      title: 'Calories Consumed',
      value: data.calories?.totalCalories || 0,
      unit: 'kcal',
      icon: <RestaurantRounded sx={{ color: '#FF6B6B' }} />,
      color: '#FF6B6B',
    },
    {
      title: 'Calories Burned',
      value: data.workout?.totalCaloriesBurned || 0,
      unit: 'kcal',
      icon: <LocalFireDepartmentRounded sx={{ color: '#4ECDC4' }} />,
      color: '#4ECDC4',
    },
    {
      title: 'Water Intake',
      value: ((data.water?.glassCount || 0) * 250 / 1000).toFixed(1),
      unit: 'L',
      icon: <LocalDrinkRounded sx={{ color: '#45B7D1' }} />,
      color: '#45B7D1',
    },
    {
      title: 'Sleep Duration',
      value: data.sleep?.duration || 0,
      unit: 'hours',
      icon: <NightsStayRounded sx={{ color: '#96C' }} />,
      color: '#96C',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Your Daily Summary
        </Typography>
        <IconButton onClick={fetchAllData} color="primary">
          <RefreshRounded />
        </IconButton>
      </Box>

      <Grid container spacing={3} mb={4}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <MetricCard
              {...metric}
              isLoading={isLoading}
            />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              height: '100%',
              minHeight: isMobile ? 300 : 400,
            }}
          >
            <Typography variant="h6" mb={2}>
              Workout Progress
            </Typography>
            <WorkoutChart />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              height: '100%',
              minHeight: isMobile ? 300 : 400,
            }}
          >
            <Typography variant="h6" mb={2}>
              Nutrition Breakdown
            </Typography>
            <FoodChart />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;