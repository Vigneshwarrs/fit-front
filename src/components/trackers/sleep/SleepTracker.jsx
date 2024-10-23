import React, {useState} from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Slider,
  Paper,
  ThemeProvider,
  createTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import BedIcon from '@mui/icons-material/Bed';
import { differenceInMinutes, format, isBefore, addDays } from 'date-fns';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { createSleep } from '../../../services/trackerService';
import {getSleepRequest,getSleepSuccess,getSleepFailure} from '../../../redux/slice/sleepSlice';
import { useDispatch } from 'react-redux';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4a148c',
    },
    secondary: {
      main: '#ff6d00',
    },
  },
});

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  date: Yup.date().required('Date is required'),
  bedTime: Yup.date().required('Bed time is required'),
  wakeTime: Yup.date().required('Wake time is required'),
  mood: Yup.string().required('Mood is required'),
});

const SleepForm = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [severity, setSeverity] = useState(false);
  const dispatch = useDispatch();

//   const calculateSleepDuration = (bedTime, wakeTime) => {
//     if (bedTime && wakeTime) {
//       const duration = differenceInMinutes(wakeTime, bedTime);
//       const hours = Math.floor(duration / 60);
//       const minutes = duration % 60;
//       return `${hours}h ${minutes}m`;
//     }
//     return 'N/A';
//   };

const calculateSleepDuration = (bedTime, wakeTime) => {
    if (bedTime && wakeTime) {
      // Check if wakeTime is before bedTime, meaning the wake time is the next day
      if (isBefore(wakeTime, bedTime)) {
        wakeTime = addDays(wakeTime, 1);  // Move wakeTime to the next day
      }
  
      // Calculate the duration in minutes
      const duration = differenceInMinutes(wakeTime, bedTime);
  
      // Convert duration to hours and minutes
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
  
      return `${hours}h ${minutes}m`;
    }
    return 'N/A';
  };
  const handleSave = async (values, { resetForm }) => {
    dispatch(getSleepRequest());
    try{

    // Create the sleep data object
    if (isBefore(values.wakeTime, values.bedTime)) {
      values.wakeTime = addDays(values.wakeTime, 1);  // Move wakeTime to the next day
    }
  const sleep = {
    date: format(values.date, 'yyyy-MM-dd'),
    bedTime: format(values.bedTime, 'HH:mm'),
    wakeTime: format(values.wakeTime, 'HH:mm'),
    quality: values.sleepQuality,
    duration: differenceInMinutes(values.wakeTime, values.bedTime),
    mood: values.mood,
  };

  // Save the data
  dispatch(getSleepSuccess(sleep));
  await createSleep(sleep);
  setOpenSnackbar(true);
  resetForm(); // Reset the form after saving
    }catch(e){
      console.error(e);
      dispatch(getSleepFailure(e));
      setOpenSnackbar(true);
      setSeverity(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Paper elevation={3} sx={{ padding: 3, maxWidth: 400, margin: 'auto' }}>
          <Typography variant="h5" gutterBottom align="center">
            <BedIcon sx={{ verticalAlign: 'middle', marginRight: 1 }} />
            Sleep Tracker
          </Typography>

          <Formik
            initialValues={{
              date: new Date(),
              bedTime: null,
              wakeTime: null,
              sleepQuality: 5,
              mood: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSave}
          >
            {({ values, setFieldValue, handleSubmit, errors, touched }) => (
              <Form onSubmit={handleSubmit}>
                <Box sx={{ mb: 2 }}>
                  <DatePicker
                    label="Date"
                    value={values.date}
                    onChange={(newValue) => setFieldValue('date', newValue)}
                    renderInput={(params) => <TextField {...params} fullWidth error={Boolean(touched.date && errors.date)} helperText={touched.date && errors.date} />}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <TimePicker
                    label="Bed Time"
                    value={values.bedTime}
                    onChange={(newValue) => setFieldValue('bedTime', newValue)}
                    renderInput={(params) => <TextField {...params} fullWidth error={Boolean(touched.bedTime && errors.bedTime)} helperText={touched.bedTime && errors.bedTime} />}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <TimePicker
                    label="Wake Time"
                    value={values.wakeTime}
                    onChange={(newValue) => setFieldValue('wakeTime', newValue)}
                    renderInput={(params) => <TextField {...params} fullWidth error={Boolean(touched.wakeTime && errors.wakeTime)} helperText={touched.wakeTime && errors.wakeTime} />}
                  />
                </Box>

                <Typography variant="body1" gutterBottom>
                  Sleep Duration: {calculateSleepDuration(values.bedTime, values.wakeTime)}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography id="sleep-quality-slider" gutterBottom>
                    Sleep Quality
                  </Typography>
                  <Slider
                    aria-labelledby="sleep-quality-slider"
                    value={values.sleepQuality}
                    onChange={(_, newValue) => setFieldValue('sleepQuality', newValue)}
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={1}
                    max={10}
                  />
                </Box>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="mood-select-label">Mood on Waking</InputLabel>
                  <Select
                    labelId="mood-select-label"
                    value={values.mood}
                    onChange={(e) => setFieldValue('mood', e.target.value)}
                    label="Mood on Waking"
                    error={Boolean(touched.mood && errors.mood)}
                  >
                    <MenuItem value="Refreshed">Refreshed</MenuItem>
                    <MenuItem value="Tired">Tired</MenuItem>
                    <MenuItem value="Energetic">Energetic</MenuItem>
                    <MenuItem value="Groggy">Groggy</MenuItem>
                    <MenuItem value="Neutral">Neutral</MenuItem>
                  </Select>
                </FormControl>

                <Button type="submit" variant="contained" fullWidth color="primary">
                  Save Sleep Data
                </Button>
              </Form>
            )}
          </Formik>

          <Snackbar
            open={openSnackbar}
            autoHideDuration={3000}
            severity={severity ? 'success' : 'danger'}
            onClose={() => setOpenSnackbar(false)}
            message="Sleep data saved successfully!"
          />
        </Paper>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default SleepForm;
