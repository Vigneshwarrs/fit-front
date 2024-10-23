import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  Box, 
  Typography, 
  LinearProgress, 
  List, 
  ListItem, 
  ListItemText,
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField,
  Card,
  CardContent,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Edit as EditIcon, Delete as DeleteIcon, ChevronDown } from 'lucide-react';
import api from '../../utils/api';


const validationSchema = Yup.object().shape({
  quantity: Yup.number().positive('Quantity must be positive').required('Quantity is required'),
  calories: Yup.number().positive('Calories must be positive').required('Calories are required'),
  protein: Yup.number().min(0, 'Protein must be non-negative').required('Protein is required'),
  carbs: Yup.number().min(0, 'Carbs must be non-negative').required('Carbs are required'),
  fat: Yup.number().min(0, 'Fat must be non-negative').required('Fat is required'),
});

const FoodSummary = () => {
  const [nutritionData, setNutritionData] = useState(null);
  const [meals, setMeals] = useState([]);
  const [dailySummary, setDailySummary] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [personlisedSuggestions, setPersonalisedSuggestions] = useState(null);
    
  useEffect(()=>{
    async function getFoodItems() {
        const response = await api.get("/nutrition");
        const res = await api.get("/suggestions");
        console.log(res.data);
        setPersonalisedSuggestions(res.data.personalizedSuggestions);
        setNutritionData(response.data);
        processMeals(response.data);
    }
    getFoodItems();
  },[]);
  const processMeals = (nutritionLogs) => {
    const today = new Date();
    const filteredLogs = nutritionLogs.filter(log => {
      const logDate = new Date(log.date);
      return logDate.toDateString() === today.toDateString(); // Filtering for today's meals
    });

    const mealEntries = [];
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    filteredLogs.forEach(log => {
      log.meals.forEach(meal => {
        mealEntries.push(meal);
        totalCalories += meal.totalCalories;
        totalProtein += meal.totalProtein;
        totalCarbs += meal.totalCarbs;
        totalFat += meal.totalFat;
      });
    });

    setMeals(mealEntries);
    setDailySummary({ calories: totalCalories, protein: totalProtein, carbs: totalCarbs, fat: totalFat });
  };

  const calculateTotalCalories = (foodItems) => {
    let totalCalories = 0;
    console.log(meals);
    meals?.forEach((meal) => {
      totalCalories += meal.totalCalories;
    });
    return totalCalories;
  }

  const [openModal, setOpenModal] = useState(false);
  const [editingFood, setEditingFood] = useState(null);

  const totalCalories = calculateTotalCalories(nutritionData);
  const calorieGoal = 2000; // This could be dynamic based on user settings
  const calorieProgress = (totalCalories / calorieGoal) * 100;

  const formik = useFormik({
    initialValues: {
      quantity: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      // Here you would typically update the backend
      console.log('Submitting:', values);
      resetForm();
      setOpenModal(false);
      setEditingFood(null);
    },
  });

  const handleEdit = (food) => {
    setEditingFood(food);
    formik.setValues(food);
    setOpenModal(true);
  };

  const handleDelete = (mealName, foodId) => {
    // Here you would typically update the backend
    console.log('Deleting food from', mealName, 'with ID:', foodId);
  };

//   const handleAddFood = () => {
//     formik.resetForm();
//     setEditingFood(null);
//     setOpenModal(true);
//   };

  const MealAccordion = ({ meal }) => (
    <Accordion>
      <AccordionSummary expandIcon={<ChevronDown />}>
        <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
          {meal.name} - {meal.totalCalories.toFixed(0)} kcal
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <List>
          {meal.foodItems.map((food) => (
            <ListItem key={food._id} divider secondaryAction={<><IconButton edge="end" aria-label="edit" onClick={() => handleEdit(food)} size="small">
            <EditIcon size={18} />
          </IconButton>
          <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(meal.name, food._id.$oid)} size="small">
            <DeleteIcon size={18} />
          </IconButton></>} >
              <ListItemText
                primary={food.foodId.name} // You might want to replace this with the actual food name
                secondary={
                  <Grid container spacing={1}>
                    <Grid item>
                      <Chip label={`${food.quantity}g`} size="small" variant="outlined" />
                    </Grid>
                    <Grid item>
                      <Chip label={`${food.calories.toFixed(0)} kcal`} size="small" color="primary" />
                    </Grid>
                    <Grid item>
                      <Chip label={`P: ${food.protein.toFixed(1)}g`} size="small" />
                    </Grid>
                    <Grid item>
                      <Chip label={`C: ${food.carbs.toFixed(1)}g`} size="small" />
                    </Grid>
                    <Grid item>
                      <Chip label={`F: ${food.fat.toFixed(1)}g`} size="small" />
                    </Grid>
                  </Grid>
                }
              />
            </ListItem>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );

  return (
    <Card elevation={3} sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h4" gutterBottom align="center" color="primary">
          Today's Food Summary
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ flexGrow: 1, mr: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={calorieProgress} 
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {totalCalories?.toFixed(0)} / {Math.round(personlisedSuggestions?.targetCalories)} kcal
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent:"center", mb: 2, gap: 5 }}>
          <Typography variant="body2" color="text.secondary">
           Protein:  {dailySummary.protein?.toFixed(0)}g
          </Typography>
          <Typography variant="body2" color="text.secondary">
           Carbs {dailySummary.carbs?.toFixed(0)}g
          </Typography>
          <Typography variant="body2" color="text.secondary">
           Fat: {dailySummary.fat?.toFixed(0)}g
          </Typography>
        </Box>

        {
            meals?.map((meal) => (
              <MealAccordion key={meal._id} meal={meal} />
            ))
        }

        {/* <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddFood}
          >
            Add Food
          </Button>
        </Box> */}

        <Dialog open={openModal} onClose={() => setOpenModal(false)}>
          <DialogTitle>{editingFood ? 'Edit Food' : 'Add Food'}</DialogTitle>
          <form onSubmit={formik.handleSubmit}>
            <DialogContent>
              <TextField
                fullWidth
                id="quantity"
                name="quantity"
                label="Quantity (g)"
                type="number"
                value={formik.values.quantity}
                onChange={formik.handleChange}
                error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                helperText={formik.touched.quantity && formik.errors.quantity}
                margin="dense"
              />
              <TextField
                fullWidth
                id="calories"
                name="calories"
                label="Calories"
                type="number"
                value={formik.values.calories}
                onChange={formik.handleChange}
                error={formik.touched.calories && Boolean(formik.errors.calories)}
                helperText={formik.touched.calories && formik.errors.calories}
                margin="dense"
              />
              <TextField
                fullWidth
                id="protein"
                name="protein"
                label="Protein (g)"
                type="number"
                value={formik.values.protein}
                onChange={formik.handleChange}
                error={formik.touched.protein && Boolean(formik.errors.protein)}
                helperText={formik.touched.protein && formik.errors.protein}
                margin="dense"
              />
              <TextField
                fullWidth
                id="carbs"
                name="carbs"
                label="Carbs (g)"
                type="number"
                value={formik.values.carbs}
                onChange={formik.handleChange}
                error={formik.touched.carbs && Boolean(formik.errors.carbs)}
                helperText={formik.touched.carbs && formik.errors.carbs}
                margin="dense"
              />
              <TextField
                fullWidth
                id="fat"
                name="fat"
                label="Fat (g)"
                type="number"
                value={formik.values.fat}
                onChange={formik.handleChange}
                error={formik.touched.fat && Boolean(formik.errors.fat)}
                helperText={formik.touched.fat && formik.errors.fat}
                margin="dense"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenModal(false)}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                {editingFood ? 'Save Changes' : ''}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default FoodSummary;


// import React, { useState } from 'react';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';
// import { 
//   Box, 
//   Typography, 
//   LinearProgress, 
//   List, 
//   ListItem, 
//   ListItemText, 
//   ListItemSecondaryAction, 
//   IconButton, 
//   Dialog, 
//   DialogTitle, 
//   DialogContent, 
//   DialogActions, 
//   Button, 
//   TextField,
//   Card,
//   CardContent,
//   Grid,
//   Chip,
// } from '@mui/material';
// import { Edit as EditIcon, Delete as DeleteIcon, PlusCircle as AddIcon } from 'lucide-react';

// const validationSchema = Yup.object().shape({
//   name: Yup.string().required('Food name is required'),
//   calories: Yup.number().positive('Calories must be positive').required('Calories are required'),
//   protein: Yup.number().min(0, 'Protein must be non-negative').required('Protein is required'),
//   carbs: Yup.number().min(0, 'Carbs must be non-negative').required('Carbs are required'),
//   fat: Yup.number().min(0, 'Fat must be non-negative').required('Fat is required'),
// });

// const FoodSummary = () => {
//   const [foods, setFoods] = useState([
//     { id: 1, name: 'Oatmeal', calories: 300, protein: 10, carbs: 50, fat: 5 },
//     { id: 2, name: 'Chicken Salad', calories: 400, protein: 30, carbs: 10, fat: 25 },
//     { id: 3, name: 'Apple', calories: 95, protein: 0, carbs: 25, fat: 0 },
//   ]);
//   const [openModal, setOpenModal] = useState(false);
//   const [editingFood, setEditingFood] = useState(null);

//   const totalCalories = foods.reduce((sum, food) => sum + food.calories, 0);
//   const calorieGoal = 2000;
//   const calorieProgress = (totalCalories / calorieGoal) * 100;

//   const formik = useFormik({
//     initialValues: {
//       name: '',
//       calories: '',
//       protein: '',
//       carbs: '',
//       fat: '',
//     },
//     validationSchema,
//     onSubmit: (values, { resetForm }) => {
//       if (editingFood) {
//         setFoods(foods.map(food => food.id === editingFood.id ? { ...values, id: food.id } : food));
//       } else {
//         setFoods([...foods, { ...values, id: Date.now() }]);
//       }
//       resetForm();
//       setOpenModal(false);
//       setEditingFood(null);
//     },
//   });

//   const handleEdit = (food) => {
//     setEditingFood(food);
//     formik.setValues(food);
//     setOpenModal(true);
//   };

//   const handleDelete = (id) => {
//     setFoods(foods.filter(food => food.id !== id));
//   };

//   const handleAddFood = () => {
//     formik.resetForm();
//     setEditingFood(null);
//     setOpenModal(true);
//   };

//   return (
//     <Card elevation={3} sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
//       <CardContent>
        
//         <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//           <Box sx={{ flexGrow: 1, mr: 2 }}>
//             <LinearProgress 
//               variant="determinate" 
//               value={calorieProgress} 
//               sx={{ height: 10, borderRadius: 5 }}
//             />
//           </Box>
//           <Typography variant="body2" color="text.secondary">
//             {totalCalories} / {calorieGoal} kcal
//           </Typography>
//         </Box>

//         <List>
//           {foods.map((food) => (
//             <ListItem key={food.id} divider>
//               <ListItemText
//                 primary={food.name}
//                 secondary={
//                   <Grid container spacing={1}>
//                     <Grid item>
//                       <Chip label={`${food.calories} kcal`} size="small" color="primary" />
//                     </Grid>
//                     <Grid item>
//                       <Chip label={`P: ${food.protein}g`} size="small" />
//                     </Grid>
//                     <Grid item>
//                       <Chip label={`C: ${food.carbs}g`} size="small" />
//                     </Grid>
//                     <Grid item>
//                       <Chip label={`F: ${food.fat}g`} size="small" />
//                     </Grid>
//                   </Grid>
//                 }
//               />
//               <ListItemSecondaryAction>
//                 <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(food)} size="small">
//                   <EditIcon size={18} />
//                 </IconButton>
//                 <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(food.id)} size="small">
//                   <DeleteIcon size={18} />
//                 </IconButton>
//               </ListItemSecondaryAction>
//             </ListItem>
//           ))}
//         </List>

//         <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
//           <Button
//             variant="contained"
//             color="primary"
//             startIcon={<AddIcon />}
//             onClick={handleAddFood}
//           >
//             Add Food
//           </Button>
//         </Box>

//         <Dialog open={openModal} onClose={() => setOpenModal(false)}>
//           <DialogTitle>{editingFood ? 'Edit Food' : 'Add Food'}</DialogTitle>
//           <form onSubmit={formik.handleSubmit}>
//             <DialogContent>
//               <TextField
//                 fullWidth
//                 id="name"
//                 name="name"
//                 label="Food Name"
//                 value={formik.values.name}
//                 onChange={formik.handleChange}
//                 error={formik.touched.name && Boolean(formik.errors.name)}
//                 helperText={formik.touched.name && formik.errors.name}
//                 margin="dense"
//               />
//               <TextField
//                 fullWidth
//                 id="calories"
//                 name="calories"
//                 label="Calories"
//                 type="number"
//                 value={formik.values.calories}
//                 onChange={formik.handleChange}
//                 error={formik.touched.calories && Boolean(formik.errors.calories)}
//                 helperText={formik.touched.calories && formik.errors.calories}
//                 margin="dense"
//               />
//               <TextField
//                 fullWidth
//                 id="protein"
//                 name="protein"
//                 label="Protein (g)"
//                 type="number"
//                 value={formik.values.protein}
//                 onChange={formik.handleChange}
//                 error={formik.touched.protein && Boolean(formik.errors.protein)}
//                 helperText={formik.touched.protein && formik.errors.protein}
//                 margin="dense"
//               />
//               <TextField
//                 fullWidth
//                 id="carbs"
//                 name="carbs"
//                 label="Carbs (g)"
//                 type="number"
//                 value={formik.values.carbs}
//                 onChange={formik.handleChange}
//                 error={formik.touched.carbs && Boolean(formik.errors.carbs)}
//                 helperText={formik.touched.carbs && formik.errors.carbs}
//                 margin="dense"
//               />
//               <TextField
//                 fullWidth
//                 id="fat"
//                 name="fat"
//                 label="Fat (g)"
//                 type="number"
//                 value={formik.values.fat}
//                 onChange={formik.handleChange}
//                 error={formik.touched.fat && Boolean(formik.errors.fat)}
//                 helperText={formik.touched.fat && formik.errors.fat}
//                 margin="dense"
//               />
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={() => setOpenModal(false)}>Cancel</Button>
//               <Button type="submit" variant="contained" color="primary">
//                 {editingFood ? 'Save Changes' : 'Add Food'}
//               </Button>
//             </DialogActions>
//           </form>
//         </Dialog>
//       </CardContent>
//     </Card>
//   );
// };

// export default FoodSummary;


// import React from 'react';
// import { useState, useEffect } from 'react';
// import { Card, CardContent, Typography, LinearProgress, List, ListItem, ListItemText, Box } from '@mui/material';

// const FoodSummary = () => {
//   const [foodData, setFoodData] = useState({
//     totalCalories: 2000,
//     consumedCalories: 0,
//     protein: 0,
//     carbs: 0,
//     fat: 0,
//     meals: []
//   });

//   useEffect(() => {
//     // Simulating API call to fetch food data
//     const fetchFoodData = async () => {
//       // Replace this with actual API call
//       const data = {
//         totalCalories: 2000,
//         consumedCalories: 1500,
//         protein: 75,
//         carbs: 200,
//         fat: 50,
//         meals: [
//           { name: 'Breakfast', calories: 400, protein: 20, carbs: 50, fat: 15 },
//           { name: 'Lunch', calories: 600, protein: 30, carbs: 70, fat: 20 },
//           { name: 'Snack', calories: 200, protein: 10, carbs: 30, fat: 5 },
//           { name: 'Dinner', calories: 300, protein: 15, carbs: 50, fat: 10 },
//         ]
//       };
//       setFoodData(data);
//     };

//     fetchFoodData();
//   }, []);

//   const caloriePercentage = (foodData.consumedCalories / foodData.totalCalories) * 100;

//   return (
//     <Card>
//       <CardContent>
//         <Typography variant="h5" gutterBottom>
//           Today's Food Summary
//         </Typography>
        
//         <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//           <Box sx={{ width: '100%', mr: 1 }}>
//             <LinearProgress 
//               variant="determinate" 
//               value={caloriePercentage} 
//               sx={{
//                 height: 10,
//                 borderRadius: 5,
//                 '& .MuiLinearProgress-bar': {
//                   borderRadius: 5,
//                 },
//               }}
//             />
//           </Box>
//           <Box sx={{ minWidth: 35 }}>
//             <Typography variant="body2" color="text.secondary">
//               {`${Math.round(caloriePercentage)}%`}
//             </Typography>
//           </Box>
//         </Box>
        
//         <Typography variant="body2" color="text.secondary" gutterBottom>
//           {`${foodData.consumedCalories} / ${foodData.totalCalories} kcal`}
//         </Typography>

//         <Typography variant="subtitle1" gutterBottom>
//           Macronutrients
//         </Typography>
//         <Typography variant="body2" color="text.secondary">
//           Protein: {foodData.protein}g | Carbs: {foodData.carbs}g | Fat: {foodData.fat}g
//         </Typography>

//         <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
//           Today's Meals
//         </Typography>
//         <List dense>
//           {foodData.meals.map((meal, index) => (
//             <ListItem key={index} disablePadding>
//               <ListItemText
//                 primary={meal.name}
//                 secondary={`${meal.calories} kcal | P: ${meal.protein}g C: ${meal.carbs}g F: ${meal.fat}g`}
//               />
//             </ListItem>
//           ))}
//         </List>
//       </CardContent>
//     </Card>
//   );
// };

// export default FoodSummary;