import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createGoal } from '../../services/goalService';
import { goalFailure, goalRequest, goalSuccess } from '../../redux/slice/goalSlice';

const GoalForm = () => {
  const {user} = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.goal);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const navigate = useNavigate();

  // Helper to calculate BMI
  const calculateBMI = (weight, height) => {
    return weight / (height / 100) ** 2;
  };

  const formik = useFormik({
    initialValues: {
      goalType: 'weight-loss', // Default value
      targetWeight: '',
      targetMuscle: '',
      targetDate: '',
      description: '',
      currentWeight: user.weight, 
      currentHeight: user.height,
    },
    validationSchema: Yup.object({
      goalType: Yup.string().required('Goal type is required'),

      targetWeight: Yup.number()
        .nullable(true)
        .when('goalType', {
          is: 'weight-loss',
          then:()=> Yup.number()
            .required('Target weight is required for weight loss')
            .positive('Weight must be positive')
            .test(
              'is-less-than-current-weight',
              'Target weight must be less than your current weight',
              function (value) {
                return value < this.parent.currentWeight;
              }
            )
            .test(
              'is-realistic-bmi',
              'Target weight should not result in an unhealthy BMI (< 18.5) ',
              function (value) {
                const currentHeight = this.parent.currentHeight;
                const targetBMI = calculateBMI(value, currentHeight);
                return targetBMI >= 18.5;
              }
            ),
        })
        .when('goalType', {
          is: 'muscle-gain',
          then:()=> Yup.number()
            .required('Target weight is required for muscle gain')
            .positive('Weight must be positive')
            .test(
              'is-more-than-current-weight',
              'Target weight must be greater than your current weight',
              function (value) {
                return value > this.parent.currentWeight;
              }
            )
            .test(
              'is-realistic-bmi',
              'Target weight should not result in an unhealthy BMI (> 30)',
              function (value) {
                const currentHeight = this.parent.currentHeight;
                const targetBMI = calculateBMI(value, currentHeight);
                return targetBMI <= 30;
              }
            ),
        }),

      targetMuscle: Yup.string().nullable(true).when('goalType', {
        is: 'muscle-gain',
        then:()=> Yup.string().required('Target muscle is required for muscle gain'),
      }),

      targetDate: Yup.date().required('Target date is required').min(new Date(), 'Target date must be in the future'),

      description: Yup.string().required('Description is required'),
    }),
    onSubmit: async (values) => {
      dispatch(goalRequest());
      try {
        const { data } = await createGoal(values);
        dispatch(goalSuccess(data));
        setSnackbar({
          open: true,
          message: 'Goal set successfully! Redirecting to home...',
          severity: 'success',
        });
        setTimeout(() => navigate('/home'), 3000); // Redirect to home after goal setup
      } catch (error) {
        dispatch(goalFailure(error));
        setSnackbar({ open: true, message: 'Error setting goal. Please try again.', severity: 'error' });
      }
    },
  });

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Set Your Fitness Goal
        </Typography>
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                id="goalType"
                name="goalType"
                label="Goal Type"
                value={formik.values.goalType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.goalType && Boolean(formik.errors.goalType)}
                helperText={formik.touched.goalType && formik.errors.goalType}
              >
                <MenuItem value="weight-loss">Weight Loss</MenuItem>
                <MenuItem value="muscle-gain">Muscle Gain</MenuItem>
                <MenuItem value="general-fitness">General Fitness</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="targetWeight"
                name="targetWeight"
                label="Target Weight (kg)"
                type="number"
                value={formik.values.targetWeight}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.targetWeight && Boolean(formik.errors.targetWeight)}
                helperText={formik.touched.targetWeight && formik.errors.targetWeight}
              />
            </Grid>

            {formik.values.goalType === 'muscle-gain' && (
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  id="targetMuscle"
                  name="targetMuscle"
                  label="Target Muscle"
                  value={formik.values.targetMuscle}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.targetMuscle && Boolean(formik.errors.targetMuscle)}
                  helperText={formik.touched.targetMuscle && formik.errors.targetMuscle}
                >
                  <MenuItem value="chest">Chest</MenuItem>
                  <MenuItem value="back">Back</MenuItem>
                  <MenuItem value="shoulders">Shoulders</MenuItem>
                  <MenuItem value="legs">Legs</MenuItem>
                  <MenuItem value="arms">Arms</MenuItem>
                  <MenuItem value="core">Core</MenuItem>
                  <MenuItem value="glutes">Glutes</MenuItem>
                  <MenuItem value="traps">Traps</MenuItem>
                </TextField>
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="targetDate"
                name="targetDate"
                label="Target Date"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                value={formik.values.targetDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.targetDate && Boolean(formik.errors.targetDate)}
                helperText={formik.touched.targetDate && formik.errors.targetDate}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="description"
                name="description"
                label="Goal Description"
                multiline
                rows={3}
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={loading}
                startIcon={loading ? <CircularProgress size="1rem" /> : null}
              >
                {loading ? 'Setting Goal...' : 'Set Goal'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        onClose={handleCloseSnackbar}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default GoalForm;
