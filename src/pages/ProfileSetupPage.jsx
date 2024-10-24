import React from "react";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  TextField,
  Typography,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Avatar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { updateUserProfile } from '../services/userService';
import { useNavigate } from "react-router-dom";
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';

const activityLevelInfo = {
  sedentary: "Little or no exercise, desk job",
  lightlyActive: "Light exercise 1-3 days/week",
  moderatelyActive: "Moderate exercise 3-5 days/week",
  veryActive: "Heavy exercise 6-7 days/week",
  extraActive: "Very heavy exercise, physical job or training twice per day"
};

const validationSchema = yup.object({
  age: yup
    .number()
    .required("Age is required")
    .min(1, "Age must be greater than 0")
    .max(120, "Age must be less than 120"),
  gender: yup.string().required("Gender is required"),
  height: yup
    .number()
    .required("Height is required")
    .min(30, "Height must be greater than 30 cm")
    .max(300, "Height must be less than 300 cm"),
  weight: yup
    .number()
    .required("Weight is required")
    .min(1, "Weight must be greater than 1 kg")
    .max(300, "Weight must be less than 300 kg"),
  country: yup.string().required("Country is required"),
  activityLevel: yup.string().required("Activity level is required"),
});

export default function ProfileSetupPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  
  const steps = ['Basic Info', 'Physical Stats', 'Activity Level'];
  const [activeStep, setActiveStep] = React.useState(0);

  const formik = useFormik({
    initialValues: {
      age: "",
      gender: "",
      height: "",
      weight: "",
      country: "",
      activityLevel: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("Profile setup:", values);
      try {
        const response = await updateUserProfile(values);
        console.log("Profile updated successfully:", response);
        navigate('/goal-setup');
      } catch (error) {
        console.log(error);
      }
    },
  });

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="age"
                label="Age"
                name="age"
                type="number"
                value={formik.values.age}
                onChange={formik.handleChange}
                error={formik.touched.age && Boolean(formik.errors.age)}
                helperText={formik.touched.age && formik.errors.age}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                  label="Gender"
                  id="gender"
                  name="gender"
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                  error={formik.touched.gender && Boolean(formik.errors.gender)}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="country"
                label="Country"
                name="country"
                value={formik.values.country}
                onChange={formik.handleChange}
                error={formik.touched.country && Boolean(formik.errors.country)}
                helperText={formik.touched.country && formik.errors.country}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="height"
                label="Height (cm)"
                name="height"
                type="number"
                value={formik.values.height}
                onChange={formik.handleChange}
                error={formik.touched.height && Boolean(formik.errors.height)}
                helperText={formik.touched.height && formik.errors.height}
                InputProps={{
                  endAdornment: <Typography color="textSecondary">cm</Typography>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="weight"
                label="Weight (kg)"
                name="weight"
                type="number"
                value={formik.values.weight}
                onChange={formik.handleChange}
                error={formik.touched.weight && Boolean(formik.errors.weight)}
                helperText={formik.touched.weight && formik.errors.weight}
                InputProps={{
                  endAdornment: <Typography color="textSecondary">kg</Typography>,
                }}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="activity-label">Activity Level</InputLabel>
                <Select
                  label="Activity Level"
                  id="activityLevel"
                  name="activityLevel"
                  value={formik.values.activityLevel}
                  onChange={formik.handleChange}
                  error={formik.touched.activityLevel && Boolean(formik.errors.activityLevel)}
                >
                  {Object.entries(activityLevelInfo).map(([key, description]) => (
                    <MenuItem value={key} key={key}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <DirectionsRunIcon sx={{ mr: 1 }} />
                        <Box>
                          <Typography variant="subtitle1">
                            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {description}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <Paper 
        elevation={3} 
        sx={{
          p: 4,
          mt: 8,
          borderRadius: 2,
          background: `linear-gradient(to right bottom, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Avatar sx={{ 
            m: 1, 
            bgcolor: 'secondary.main',
            width: 56,
            height: 56,
          }}>
            <FitnessCenterIcon />
          </Avatar>
          <Typography component="h1" variant="h4" color="white" gutterBottom>
            Profile Setup
          </Typography>
          <Typography variant="subtitle1" color="white" textAlign="center">
            Let's get to know you better to personalize your fitness journey
          </Typography>
        </Box>

        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Stepper 
            activeStep={activeStep} 
            alternativeLabel={!isMobile}
            orientation={isMobile ? 'vertical' : 'horizontal'}
            sx={{ mb: 4 }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box component="form" onSubmit={formik.handleSubmit}>
            {getStepContent(activeStep)}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              {activeStep !== 0 && (
                <Button onClick={handleBack} sx={{ mr: 1 }}>
                  Back
                </Button>
              )}
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  type="submit"
                  disabled={!formik.isValid || !formik.dirty}
                >
                  Complete Setup
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!formik.isValid || !formik.dirty}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </Paper>
      </Paper>
    </Container>
  );
}