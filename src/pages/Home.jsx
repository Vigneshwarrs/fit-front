import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';
import { getSleepByDate, getWaterByDate } from '../services/trackerService';
import { getWorkoutByDate } from '../services/workoutService';
import { formatISO } from 'date-fns';
import WorkoutChart from '../components/workout/WorkoutChart';
import FoodChart from '../components/food/FoodChart';
import { getDailyNutrition } from '../services/nutritionService';
const Home = () => {
  const[sleep, setSleep] = useState(null);
  const [workout, setWorkout] = useState(null);
  const [water, setWater] = useState(null);
  const [caloies, setCalories] = useState(null);

  useEffect(()=>{
    async function fecthData() {
      await getWaterByDate(formatISO(Date.now())).then((res)=>{
        setWater(res.data);
      }).catch((err)=>{
        console.error(err);
      });
      await getWorkoutByDate(formatISO(Date.now())).then((res)=>{
        setWorkout(res.data);
      }).catch((err)=>{
        console.error(err);
      });
      await getSleepByDate(formatISO(Date.now())).then((res)=>{
        setSleep(res.data);
      }).catch((err)=>{
        console.error(err);
      });
      await getDailyNutrition(formatISO(Date.now())).then((res)=>{
        setCalories(res.data);
      }).catch((err)=>{
        console.log(err);
      });
    }
    fecthData();
  }, []);

  const metrics = [
    { title: 'Calories Consumed', value: caloies?.totalCalories || 0, unit: 'kcal' },
    { title: 'Calories Burned', value: workout?.totalCalories || "0", unit: 'kcal' },
    { title: 'Water Intake', value: (water?.glassCount * 250)/1000 || "0", unit: 'L' },
    { title: 'Sleep Duration', value: sleep?.durtion || '0', unit: 'hours' },
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Your Daily Summary
      </Typography>
      <Grid container spacing={2}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <MetricCard title={metric.title} value={metric.value} unit={metric.unit} />
          </Grid>
        ))}
      </Grid>
        <WorkoutChart />
        <FoodChart />
    </Box>
  );
};

const MetricCard = ({ title, value, unit }) => {
  const Card = styled(Paper)({
    padding: '20px',
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#3f51b5',
  });

  return (
    <Card elevation={3}>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="h3" component="p">
        {value} <Typography variant="body1" component="span">{unit}</Typography>
      </Typography>
    </Card>
  );
};

export default Home;