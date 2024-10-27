import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  Box, 
  Typography, 
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
  description: Yup.string(),
  sets: Yup.number().positive('Sets must be positive').required('Sets are required'),
  reps: Yup.number().positive('Reps must be positive').required('Reps are required'),
  weightPerSet: Yup.number().min(0, 'Weight must be non-negative').required('Weight is required'),
  duration: Yup.number().min(0, 'Duration must be non-negative'),
  caloriesBurned: Yup.number().min(0, 'Calories burned must be non-negative').required('Calories burned are required'),
});

const WorkoutSummary = () => {
  const [workouts, setWorkouts] = useState([]);
  const [dailySummary, setDailySummary] = useState({ totalCaloriesBurned: 0, totalDuration: 0 });
    
  useEffect(() => {
    async function getWorkouts() {
      const response = await api.get("/workout");
      console.log(response.data);
      processWorkouts(response.data);
    }
    getWorkouts();
  }, []);

  const processWorkouts = (workoutLogs) => {
    const today = new Date();
    const filteredLogs = workoutLogs.filter(log => {
      const logDate = new Date(log.createdAt);
      return logDate.toDateString() === today.toDateString();
    });

    let totalCaloriesBurned = 0;
    let totalDuration = 0;

    filteredLogs.forEach(workout => {
      totalCaloriesBurned += workout.caloriesBurned;
      totalDuration += workout.duration || 0;
    });

    setWorkouts(filteredLogs);
    setDailySummary({ totalCaloriesBurned, totalDuration });
  };

  const [openModal, setOpenModal] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);

  const formik = useFormik({
    initialValues: {
      description: '',
      sets: '',
      reps: '',
      weightPerSet: '',
      duration: '',
      caloriesBurned: '',
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      console.log('Submitting:', values);
      resetForm();
      setOpenModal(false);
      setEditingWorkout(null);
    },
  });

  const handleEdit = (workout) => {
    setEditingWorkout(workout);
    formik.setValues(workout);
    setOpenModal(true);
  };

  const handleDelete = (workoutId) => {
    console.log('Deleting workout with ID:', workoutId);
  };
  
  const WorkoutAccordion = ({ workout }) => (
    <Accordion>
      <AccordionSummary expandIcon={<ChevronDown />}>
        <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
          {workout.workoutName} - {workout.caloriesBurned} kcal
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid xs={12}>
            <Typography variant="body2">{workout.description}</Typography>
          </Grid>
          <Grid container spacing={1}>
            <Grid xs="auto">
              <Chip label={`${workout.sets} sets`} size="small" variant="outlined" />
            </Grid>
            <Grid xs="auto">
              <Chip label={`${workout.reps} reps`} size="small" variant="outlined" />
            </Grid>
            <Grid xs="auto">
              <Chip label={`${workout.weightPerSet} kg`} size="small" variant="outlined" />
            </Grid>
            {workout.duration && (
              <Grid xs="auto">
                <Chip label={`${workout.duration} min`} size="small" variant="outlined" />
              </Grid>
            )}
            <Grid xs="auto">
              <Chip label={`${workout.caloriesBurned} kcal`} size="small" color="primary" />
            </Grid>
          </Grid>
        </Grid>
        <Box sx={{ mt: 2 }}>
          <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(workout)} size="small">
            <EditIcon size={18} />
          </IconButton>
          <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(workout._id)} size="small">
            <DeleteIcon size={18} />
          </IconButton>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
  // const WorkoutAccordion = ({ workout }) => (
  //   <Accordion>
  //     <AccordionSummary expandIcon={<ChevronDown />}>
  //       <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
  //         {workout.workoutName} - {workout.caloriesBurned} kcal
  //       </Typography>
  //     </AccordionSummary>
  //     <AccordionDetails>
  //       <Grid container spacing={2}>
  //         <Grid item xs={12}>
  //           <Typography variant="body2">{workout.description}</Typography>
  //         </Grid>
  //         <Grid item container spacing={1}>
  //           <Grid item>
  //             <Chip label={`${workout.sets} sets`} size="small" variant="outlined" />
  //           </Grid>
  //           <Grid item>
  //             <Chip label={`${workout.reps} reps`} size="small" variant="outlined" />
  //           </Grid>
  //           <Grid item>
  //             <Chip label={`${workout.weightPerSet} kg`} size="small" variant="outlined" />
  //           </Grid>
  //           {workout.duration && (
  //             <Grid item>
  //               <Chip label={`${workout.duration} min`} size="small" variant="outlined" />
  //             </Grid>
  //           )}
  //           <Grid item>
  //             <Chip label={`${workout.caloriesBurned} kcal`} size="small" color="primary" />
  //           </Grid>
  //         </Grid>
  //       </Grid>
  //       <Box sx={{ mt: 2 }}>
  //         <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(workout)} size="small">
  //           <EditIcon size={18} />
  //         </IconButton>
  //         <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(workout._id)} size="small">
  //           <DeleteIcon size={18} />
  //         </IconButton>
  //       </Box>
  //     </AccordionDetails>
  //   </Accordion>
  // );

  return (
    <Card elevation={3} sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h4" gutterBottom align="center" color="primary">
          Today's Workout Summary
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: "center", mb: 2, gap: 5 }}>
          <Typography variant="body2" color="text.secondary">
            Total Calories Burned: {dailySummary.totalCaloriesBurned} kcal
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Duration: {dailySummary.totalDuration} min
          </Typography>
        </Box>

        {workouts.map((workout) => (
          <WorkoutAccordion key={workout._id} workout={workout} />
        ))}

        <Dialog open={openModal} onClose={() => setOpenModal(false)}>
          <DialogTitle>{editingWorkout ? 'Edit Workout' : 'Add Workout'}</DialogTitle>
          <form onSubmit={formik.handleSubmit}>
            <DialogContent>
              <TextField
                fullWidth
                id="description"
                name="description"
                label="Description"
                multiline
                rows={2}
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
                margin="dense"
              />
              <TextField
                fullWidth
                id="sets"
                name="sets"
                label="Sets"
                type="number"
                value={formik.values.sets}
                onChange={formik.handleChange}
                error={formik.touched.sets && Boolean(formik.errors.sets)}
                helperText={formik.touched.sets && formik.errors.sets}
                margin="dense"
              />
              <TextField
                fullWidth
                id="reps"
                name="reps"
                label="Reps"
                type="number"
                value={formik.values.reps}
                onChange={formik.handleChange}
                error={formik.touched.reps && Boolean(formik.errors.reps)}
                helperText={formik.touched.reps && formik.errors.reps}
                margin="dense"
              />
              <TextField
                fullWidth
                id="weightPerSet"
                name="weightPerSet"
                label="Weight per Set (kg)"
                type="number"
                value={formik.values.weightPerSet}
                onChange={formik.handleChange}
                error={formik.touched.weightPerSet && Boolean(formik.errors.weightPerSet)}
                helperText={formik.touched.weightPerSet && formik.errors.weightPerSet}
                margin="dense"
              />
              <TextField
                fullWidth
                id="duration"
                name="duration"
                label="Duration (minutes)"
                type="number"
                value={formik.values.duration}
                onChange={formik.handleChange}
                error={formik.touched.duration && Boolean(formik.errors.duration)}
                helperText={formik.touched.duration && formik.errors.duration}
                margin="dense"
              />
              <TextField
                fullWidth
                id="caloriesBurned"
                name="caloriesBurned"
                label="Calories Burned"
                type="number"
                value={formik.values.caloriesBurned}
                onChange={formik.handleChange}
                error={formik.touched.caloriesBurned && Boolean(formik.errors.caloriesBurned)}
                helperText={formik.touched.caloriesBurned && formik.errors.caloriesBurned}
                margin="dense"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenModal(false)}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                {editingWorkout ? 'Save Changes' : ''}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default WorkoutSummary;