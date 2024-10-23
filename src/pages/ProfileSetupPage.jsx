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
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import {updateUserProfile} from '../services/userService';
import { useNavigate } from "react-router-dom";

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
  profilePicture: yup.mixed("Profile picture is required"),
});

export default function ProfileSetupPage() {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      age: "",
      gender: "",
      height: "",
      weight: "",
      country: "",
      activityLevel: "",
      profilePicture: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("Profile setup:", values);
      await updateUserProfile(values)
      .then((response) => {
          console.log("Profile updated successfully:", response);
          navigate('/goal-setup');
        })
        .catch((error) => {
          console.log(error);
        });
    },
  });

  const handleProfilePictureChange = (event) => {
    formik.setFieldValue("profilePicture", event.currentTarget.files[0]);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Profile Setup
        </Typography>
        <Box component="form" encType="multipart/form-data" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
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
            <Grid item xs={12}>
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
                id="height"
                label="Height (cm)"
                name="height"
                type="number"
                value={formik.values.height}
                onChange={formik.handleChange}
                error={formik.touched.height && Boolean(formik.errors.height)}
                helperText={formik.touched.height && formik.errors.height}
              />
            </Grid>
            <Grid item xs={12}>
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
              />
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
                  <MenuItem value="sedentary">Sedentary</MenuItem>
                  <MenuItem value="lightlyActive">Lightly Active</MenuItem>
                  <MenuItem value="moderatelyActive">Moderately Active</MenuItem>
                  <MenuItem value="veryActive">Very Active</MenuItem>
                  <MenuItem value="extraActive">Extra Active</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" component="label" fullWidth>
                Upload Profile Picture
                <input
                  type="file"
                  hidden
                  onChange={handleProfilePictureChange}
                />
              </Button>
              {formik.errors.profilePicture && (
                <Typography color="error" variant="body2">
                  {formik.errors.profilePicture}
                </Typography>
              )}
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
