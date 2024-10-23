import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { 
  Box, Typography, IconButton, Slider, Paper,
  Button, Snackbar, Alert, Grid, Container,
  useTheme, useMediaQuery
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { waterRequest, waterSuccess, waterFailure } from '../../../redux/slice/waterSlice';
import { createWater } from '../../../services/trackerService';

const validationSchema = Yup.object().shape({
  date: Yup.date().required('Date is required'),
  glassCount: Yup.number().min(0, 'Cannot be negative').required('Required'),
  goal: Yup.number().min(1, 'Goal must be at least 1').max(15, 'Goal cannot exceed 15').required('Required'),
});

const initialValues = {
  date: new Date(),
  glassCount: 0,
  goal: 8,
};

const HydrationTracker = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { error } = useSelector((state) => state.water);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [severity, setSeverity] = React.useState('success');

  const handleSave = async (values, { setSubmitting }) => {
    try {
      dispatch(waterRequest());
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const res = await createWater(values);
      dispatch(waterSuccess(res));
      setSnackbarMessage('Data saved successfully!');
      setSeverity('success');
      setOpenSnackbar(true);
    } catch (err) {
      dispatch(waterFailure(err.message));
      setSnackbarMessage('Failed to save data');
      setSeverity('error');
      setOpenSnackbar(true);
    }
    setSubmitting(false);
  };

  return (
    <Container maxWidth="md">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSave}
      >
        {({ values, setFieldValue, isSubmitting }) => {
          const progressPercentage = (values.glassCount / values.goal) * 100;
          const totalWaterIntake = values.glassCount * 250;

          const handleIncrease = () => {
            const newCount = values.glassCount + 1;
            setFieldValue('glassCount', newCount);
            if (newCount === values.goal) {
              setSnackbarMessage("Congratulations! You've reached your daily goal!");
              setSeverity('success');
              setOpenSnackbar(true);
            }
          };

          const handleDecrease = () => {
            setFieldValue('glassCount', Math.max(0, values.glassCount - 1));
          };

          return (
            <Form>
              <Paper 
                elevation={3} 
                sx={{ 
                  padding: isMobile ? 2 : 4,
                  my: 4,
                  borderRadius: 2
                }}
              >
                <Typography 
                  variant={isMobile ? "h6" : "h5"} 
                  gutterBottom 
                  align="center"
                  sx={{ mb: 3 }}
                >
                  Daily Hydration Tracker
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Select Date"
                        value={values.date}
                        onChange={(newValue) => setFieldValue('date', newValue)}
                        sx={{ width: '100%' }}
                      />
                    </LocalizationProvider>
                  </Grid>

                  <Grid item xs={12}>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center',
                        p: 2,
                        bgcolor: 'primary.light',
                        borderRadius: 2
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <IconButton 
                          onClick={handleDecrease} 
                          color="primary"
                          disabled={values.glassCount <= 0}
                        >
                          <RemoveIcon />
                        </IconButton>
                        
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          mx: 2,
                          minWidth: 100,
                          justifyContent: 'center'
                        }}>
                          <WaterDropIcon color="primary" fontSize="large" />
                          <Typography 
                            variant="h4" 
                            sx={{ 
                              ml: 1, 
                              color: 'primary.main',
                              fontWeight: 'bold'
                            }}
                          >
                            {values.glassCount}
                          </Typography>
                        </Box>

                        <IconButton onClick={handleIncrease} color="primary">
                          <AddIcon />
                        </IconButton>
                      </Box>

                      <Typography variant="body2" color="primary.dark">
                        {totalWaterIntake} ml consumed
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="body2" gutterBottom>
                      Daily Progress: {values.glassCount} / {values.goal} glasses
                    </Typography>
                    <Slider
                      value={progressPercentage}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(value) => `${Math.round(value)}%`}
                      disabled
                      sx={{ 
                        '& .MuiSlider-thumb': {
                          display: 'none'
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="body2" gutterBottom>
                      Set Daily Goal (glasses):
                    </Typography>
                    <Slider
                      value={values.goal}
                      onChange={(_, newValue) => setFieldValue('goal', newValue)}
                      valueLabelDisplay="auto"
                      step={1}
                      marks
                      min={1}
                      max={15}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button 
                      variant="contained" 
                      fullWidth 
                      type="submit"
                      disabled={isSubmitting}
                      sx={{ 
                        py: 1.5,
                        textTransform: 'none',
                        fontWeight: 'bold'
                      }}
                    >
                      {isSubmitting ? 'Saving...' : 'Save Progress'}
                    </Button>
                  </Grid>
                </Grid>

                {error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                )}
              </Paper>
            </Form>
          );
        }}
      </Formik>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity={severity}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default HydrationTracker;