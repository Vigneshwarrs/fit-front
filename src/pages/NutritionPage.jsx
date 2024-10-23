// import React, { useEffect, useState } from 'react';
// import { Paper, Typography, CircularProgress, Divider, List, ListItem, ListItemText } from '@mui/material';
// import { getNutrition } from '../services/nutritionService';
// import FoodChart from '../components/food/FoodChart';
// import SuggestionComponent from '../components/food/FoodSuggestion';
// import FoodForm from '../components/food/FoodForm';
// // import NutritionForm from '../components/Nutrition/NutritionForm';
// // import NutritionChart from '../components/Nutrition/NutritionChart';
// // import HydrationTracker from '../components/Trackers/HydrationTracker';
// // import SleepTracker from '../components/Trackers/SleepTracker';
// // import WeightTracker from '../components/Trackers/WeightTracker';

// const NutritionPage = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [meals, setMeals] = useState([]);
//   const [dailySummary, setDailySummary] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });

//   useEffect(() => {
//     const fetchNutritionData = async () => {
//       setLoading(true);
//       try {
//         const response = await getNutrition();
//         const nutritionLogs = response.data;

//         // Process meals and daily summary
//         processMeals(nutritionLogs);
//         console.log(nutritionLogs);
//         setLoading(false);
//       } catch (error) {
//         setError('Error fetching nutrition data');
//         setLoading(false);
//       }
//     };

//     fetchNutritionData();
//   }, []);

//   const processMeals = (nutritionLogs) => {
//     const today = new Date();
//     const filteredLogs = nutritionLogs.filter(log => {
//       const logDate = new Date(log.date);
//       return logDate.toDateString() === today.toDateString(); // Filtering for today's meals
//     });

//     const mealEntries = [];
//     let totalCalories = 0;
//     let totalProtein = 0;
//     let totalCarbs = 0;
//     let totalFat = 0;

//     filteredLogs.forEach(log => {
//       log.meals.forEach(meal => {
//         mealEntries.push(meal);
//         totalCalories += meal.totalCalories;
//         totalProtein += meal.totalProtein;
//         totalCarbs += meal.totalCarbs;
//         totalFat += meal.totalFat;
//       });
//     });

//     setMeals(mealEntries);
//     setDailySummary({ calories: totalCalories, protein: totalProtein, carbs: totalCarbs, fat: totalFat });
//   };

//   return (
//     <Paper style={{ padding: '20px' }}>
//       <Typography variant="h4">Nutrition Tracker</Typography>
//       {loading && <CircularProgress />}
//       {error && <Typography color="error">{error}</Typography>}
//       <Divider style={{ margin: '20px 0' }} />

//       {/* Daily Summary */}
//       <Typography variant="h5">Daily Summary</Typography>
//       <Typography>Total Calories: {dailySummary.calories.toFixed(2)} kcal</Typography>
//       <Typography>Protein: {dailySummary.protein.toFixed(2)} g</Typography>
//       <Typography>Carbs: {dailySummary.carbs.toFixed(2)} g</Typography>
//       <Typography>Fat: {dailySummary.fat.toFixed(2)} g</Typography>
//       <Divider style={{ margin: '20px 0' }} />

//       {/* Add Meal Form */}
//       {/* <NutritionForm /> */}

//       {/* Meal List */}
//       <Typography variant="h5">Today's Meals</Typography>
//       <List>
//         {meals.map((meal, index) => (
//           <ListItem key={index}>
//             <ListItemText primary={meal.name} secondary={meal.foodItems.length > 0 
//     ? meal.foodItems.map(item => `${item.foodId?.name} [${item.calories.toFixed(2)} kcal]`).join(', ') 
//     : 'Not Found'} />
//           </ListItem>
//         ))}
//       </List>

//       {/* Chart */}
//       {/* {chartData && <Bar data={chartData} options={{ responsive: true }} />} */}
//       {/* <NutritionChart /> */}
//       <SuggestionComponent />
//       <FoodForm />
//       <FoodChart />
      
//       {/* Meal Suggestions */}
//       <Divider style={{ margin: '20px 0' }} />
//       <Typography variant="h5">Meal Suggestions</Typography>
//       <List>
//         <ListItem>
//           <ListItemText primary="Grilled Chicken Salad" secondary="Approx. 350 kcal" />
//         </ListItem>
//         <ListItem>
//           <ListItemText primary="Quinoa and Black Bean Bowl" secondary="Approx. 400 kcal" />
//         </ListItem>
//         <ListItem>
//           <ListItemText primary="Smoothie Bowl" secondary="Approx. 250 kcal" />
//         </ListItem>
//       </List>

//       {/* Hydration Tracking */}
//       <Divider style={{ margin: '20px 0' }} />
//       {/* <HydrationTracker /> */}
//       <Divider style={{ margin: '20px 0' }} />
//       {/* <SleepTracker /> */}
//       <Divider style={{ margin: '20px 0' }} />
//       {/* <WeightTracker /> */}
      
//       {/* Nutritional Tips */}
//       <Divider style={{ margin: '20px 0' }} />
//       <Typography variant="h5">Nutritional Tips</Typography>
//       <Typography variant="body2">Eat a variety of foods to get all the nutrients you need.</Typography>
//     </Paper>
//   );
// };

// export default NutritionPage;

import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import FoodForm from '../components/food/FoodForm';
import FoodChart from '../components/food/FoodChart';
import FoodSummary from '../components/food/FoodSummary';

function FoodPage() {
  return (
    <Box p={4}>
      <Grid container spacing={4}>
        {/* Food Form Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Add Your Meal
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Log your meals by filling in the details below.
              </Typography>
              <FoodForm />
            </CardContent>
          </Card>
        </Grid>

        {/* Food Chart Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Meal Breakdown
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Review your nutritional intake using the chart below.
              </Typography>
              <FoodChart />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Today's Meal Breakdown
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Review your nutritional intake
              </Typography>
              <FoodSummary />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default FoodPage;
