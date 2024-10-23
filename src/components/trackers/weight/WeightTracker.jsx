import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Alert,
  Stack,
  TextField
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { format } from 'date-fns';
import { FiTarget } from 'react-icons/fi';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup'; // Optional for validation
import {getWeightFailure, getWeightRequest, getWeightSuccess, weightSet} from '../../../redux/slice/weightSlice';
import { createWeight, getWeights } from '../../../services/trackerService';
import { useDispatch, useSelector } from 'react-redux';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const WeightTracker = () => {
  const dispatch = useDispatch();
  const {weights} = useSelector((state)=> state.weight);
  const {user} = useSelector((state)=> state.auth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [weightData, setWeightData] = useState([]);
  const [alertInfo, setAlertInfo] = useState({ show: false, message: '', severity: 'success' });
  const [unit, setUnit] = useState('kg');

  useEffect(() => {
    async function setWeightData() {
      try {
        const response = await getWeights();
        dispatch(weightSet(response.data));
      }catch (err){
        console.error(err);
      }
    }
    setWeightData();
  }, [dispatch]);

  const toggleUnit = () => {
    const newUnit = unit === 'kg' ? 'lbs' : 'kg';
    setUnit(newUnit);
    const convertedData = weightData.map(entry => ({
      ...entry,
      weight: newUnit === 'lbs' ? entry.weight * 2.20462 : entry.weight / 2.20462
    }));
    setWeightData(convertedData);
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    dispatch(getWeightRequest());
    try{
      const res = await createWeight({...values, unit: unit});
      dispatch(getWeightSuccess(res.data));
      setAlertInfo({
        show: true,
        message: 'Weight data saved successfully!',
        severity: 'success',
      });
      resetForm();
    }catch(err) {
      dispatch(getWeightFailure(err));
      console.error(err);
      setAlertInfo({
        show: true,
        message: 'Failed to save weight data. Please try again.',
        severity: 'error',
      });
    }
  };

  const getProgress = () => {
    if (!weights?.length) return null;
    const latestWeight = weights[weights?.length - 1].weight;
    const goalWeight = user.goal.targetWeight;
    return {
      current: latestWeight.toFixed(1),
      goal: goalWeight.toFixed(1),
    };
  };

  // Chart.js configuration
  const chartData = {
    labels: weights?.map(entry => format(new Date(entry.date), 'MMM d')),
    datasets: [
      {
        label: `Weight (${unit})`,
        data: weights?.map(entry => entry.weight),
        fill: true,
        backgroundColor: theme.palette.primary.light + '40',
        borderColor: theme.palette.primary.main,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: theme.palette.divider
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const progress = getProgress();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {/* Input Section */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Record Weight
                  </Typography>
                  <Formik
                    initialValues={{ date: new Date(), weight: '', goalWeight: '', }}
                    validationSchema={Yup.object({
                      weight: Yup.number().required('Weight is required'),
                      goalWeight: Yup.number(),
                    })}
                    onSubmit={handleFormSubmit}
                  >
                    {({ setFieldValue, values }) => (
                      <Form>
                        <Stack spacing={3}>
                          <DatePicker
                            label="Date"
                            value={values.date}
                            onChange={(newValue) => setFieldValue('date', newValue)}
                            renderInput={(params) => <Field as={TextField} {...params} name="date" fullWidth />}
                          />
                          <Field
                            name="weight"
                            label={`Weight (${unit})`}
                            type="number"
                            as={TextField}
                            fullWidth
                          />
                          <ErrorMessage name="weight" component="div" style={{ color: 'red' }} />
                          <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                          >
                            Save Weight
                          </Button>
                        </Stack>
                      </Form>
                    )}
                  </Formik>
                </CardContent>
              </Card>

              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Goal Settings
                  </Typography>
                  <Formik
                    initialValues={{ goalWeight: '' }}
                    // onSubmit={(values) => setGoalWeight(values.goalWeight)}
                  >
                    {({ values }) => (
                      <Form>
                        <Stack spacing={3}>
                          <Field
                            name="goalWeight"
                            label={`Target Weight (${unit})`}
                            type="number"
                            as={TextField}
                            fullWidth
                          />
                          <ErrorMessage name="goalWeight" component="div" style={{ color: 'red' }} />
                          <Button
                            variant="outlined"
                            onClick={toggleUnit}
                            fullWidth
                          >
                            Switch to {unit === 'kg' ? 'lbs' : 'kg'}
                          </Button>
                        </Stack>
                      </Form>
                    )}
                  </Formik>
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          {/* Chart and Stats Section */}
          <Grid item xs={12} md={8}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Weight Progress
                </Typography>

                {progress && (
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={4}>
                      <Card variant="outlined">
                        <CardContent>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <FiTarget size={24} color={theme.palette.primary.main} />
                            <Typography variant="body2">Current</Typography>
                          </Stack>
                          <Typography variant="h6">{progress.current} {unit}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Card variant="outlined">
                        <CardContent>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <FiTarget size={24} color={theme.palette.primary.main} />
                            <Typography variant="body2">Goal</Typography>
                          </Stack>
                          <Typography variant="h6">{progress.goal} {unit}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                )}

                <Box sx={{ height: isMobile ? 300 : 400 }}>
                  <Line data={chartData} options={chartOptions} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {alertInfo.show && (
          <Alert
            severity={alertInfo.severity}
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              maxWidth: '90vw'
            }}
            onClose={() => setAlertInfo({ ...alertInfo, show: false })}
          >
            {alertInfo.message}
          </Alert>
        )}
      </Container>
    </LocalizationProvider>
  );
};

export default WeightTracker;
