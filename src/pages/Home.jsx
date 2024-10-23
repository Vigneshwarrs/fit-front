import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';
import { getSleepByDate, getWaterByDate } from '../services/trackerService';
import { getWorkoutByDate } from '../services/workoutService';
import { formatISO, parseISO } from 'date-fns';

const Home = () => {
  // const {sleep} = useSelector((state)=>state.sleep);
  // const {workout} = useSelector((state)=>state.workout);
  // const {water} = useSelector((state)=>state.water);
  const[sleep, setSleep] = useState(null);
  const [workout, setWorkout] = useState(null);
  const [water, setWater] = useState(null);

  useEffect(()=>{
    async function h(){
      await getWaterByDate(formatISO(Date.now())).then((res)=>{
        setWater(res.data);
      }).catch((err)=>{
        console.error(err);
      });
    };
    h()
    async function fecthData() {
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
    }
    fecthData();
    fecthData();
  }, []);

  const metrics = [
    { title: 'Steps', value: '7500', unit: 'steps' },
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




// import React from 'react';
// import { Box, Grid, Typography, Button, Card, CardContent, Container } from '@mui/material';
// import { Line } from 'react-chartjs-2';
// import { Chart, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';
// Chart.register(LineElement, PointElement, CategoryScale, LinearScale);


// const Home = () => {
//   // Sample data for charts and progress
//   const weightHistory = [
//     { date: '2024-10-01', weight: 88 },
//     { date: '2024-10-08', weight: 87 },
//     { date: '2024-10-15', weight: 86 }
//   ];

//   const weightChartData = {
//     labels: weightHistory.map(entry => entry.date),
//     datasets: [
//       {
//         label: 'Weight Progress',
//         data: weightHistory.map(entry => entry.weight),
//         fill: false,
//         borderColor: 'rgba(75,192,192,1)',
//         tension: 0.1
//       }
//     ]
//   };

//   return (
//     <Box>
//       <Container sx={{ marginTop: '24px' }}>
//         {/* Daily Summary */}
//         <Typography variant="h4" gutterBottom>
//           Welcome Back, Vignesh!
//         </Typography>
//         <Typography variant="subtitle1" gutterBottom>
//           Here’s your progress for today:
//         </Typography>

//         <Grid container spacing={4}>
//           {/* Steps Card */}
//           <Grid item xs={12} md={4}>
//             <Card>
//               <CardContent>
//                 <Typography variant="h6">Steps</Typography>
//                 <Typography variant="h4">5,000</Typography>
//                 <Typography variant="body2">You're 70% of the way to your goal!</Typography>
//               </CardContent>
//             </Card>
//           </Grid>

//           {/* Hydration Card */}
//           <Grid item xs={12} md={4}>
//             <Card>
//               <CardContent>
//                 <Typography variant="h6">Hydration</Typography>
//                 <Typography variant="h4">2 Liters</Typography>
//                 <Typography variant="body2">Keep it up! Aim for 3 liters.</Typography>
//               </CardContent>
//             </Card>
//           </Grid>

//           {/* Calories Burned Card */}
//           <Grid item xs={12} md={4}>
//             <Card>
//               <CardContent>
//                 <Typography variant="h6">Calories Burned</Typography>
//                 <Typography variant="h4">1,200 kcal</Typography>
//                 <Typography variant="body2">You’re almost there!</Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>

//         {/* Weight Progress Chart */}
//         <Box mt={4}>
//           <Typography variant="h6">Weight Progress</Typography>
//           <Line data={weightChartData} />
//         </Box>

//         {/* Workout and Activity Suggestions */}
//         <Box mt={4}>
//           <Typography variant="h6" gutterBottom>
//             Suggested Workout for Today
//           </Typography>
//           <Typography variant="body1">Cardio: 30 minutes, Moderate Intensity</Typography>
//           <Button variant="contained" color="primary" sx={{ mt: 2 }}>
//             Start Workout
//           </Button>
//         </Box>

//         {/* Long-Term Goals */}
//         <Box mt={4}>
//           <Typography variant="h6">Your Long-Term Goals</Typography>
//           <Typography variant="body2">
//             - Reach 80kg by 2024-12-01
//           </Typography>
//           <Typography variant="body2">
//             - Run 10,000 steps a day for the next 2 weeks
//           </Typography>
//         </Box>

//         {/* Motivational Message */}
//         <Box mt={4}>
//           <Typography variant="h5" align="center" color="primary">
//             "Success is the sum of small efforts repeated day in and day out."
//           </Typography>
//         </Box>
//       </Container>
//     </Box>
//   );
// };

// export default Home;
