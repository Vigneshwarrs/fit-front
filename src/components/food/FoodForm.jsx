import React, { useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { createNutrition } from "../../services/nutritionService";
import {
  TextField,
  Button,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Snackbar,
  Tooltip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  useMediaQuery,
  useTheme,
  Paper,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { nutritionError, nutritionRequest, nutritionSuccess } from "../../redux/slice/nutritionSlice";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FoodForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.nutrition);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [date, setDate] = useState(new Date());
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const initialValues = {
    date: new Date().toISOString().split("T")[0],
    meals: {
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: [],
    },
  };

  const getMealValidationSchema = () =>
    Yup.object({
      name: Yup.string().required("Food item name is required"),
      quantity: Yup.number().required("Quantity is required"),
      calories: Yup.number().required("Calories are required"),
      protein: Yup.number().required("Protein is required"),
      carbs: Yup.number().required("Carbs are required"),
      fat: Yup.number().required("Fat is required"),
    });

  const validationSchema = Yup.object({
    date: Yup.date()
      .required("Date is required")
      .max(new Date(), "Date cannot be in the future"),
    meals: Yup.object({
      breakfast: Yup.array().of(getMealValidationSchema()),
      lunch: Yup.array().of(getMealValidationSchema()),
      dinner: Yup.array().of(getMealValidationSchema()),
      snacks: Yup.array().of(getMealValidationSchema()),
    }),
  });

  const handleSubmit = async (values, { resetForm }) => {
    dispatch(nutritionRequest());
    try {
      const { data } = await createNutrition(values.date, values.meals);
      dispatch(nutritionSuccess(data));
      setSnackbarMessage("Nutrition tracked successfully!");
      setSnackbarOpen(true);
      setSeverity(true);
      resetForm();
    } catch (err) {
      dispatch(nutritionError(err));
      setSnackbarMessage("Nutrition not tracked");
      setSnackbarOpen(true);
      setSeverity(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Grid container mt={3} spacing={2} mb={3} justifyContent="center">
              <Grid item xs={12} sm={8} md={6}>
                <DatePicker
                  label="Select Date"
                  value={date}
                  onChange={(newValue) => {
                    setDate(newValue);
                    setFieldValue("date", newValue.toISOString().split("T")[0]);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth />
                  )}
                />
                <ErrorMessage name="date" component="div" className="error-message" />
              </Grid>
            </Grid>

            {["breakfast", "lunch", "dinner", "snacks"].map((mealType) => (
              <Accordion key={mealType} sx={{ mb: 2, boxShadow: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#4caf50", fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                    {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                  </Typography>
                  <Chip 
                    label={`${values.meals[mealType].length} items`} 
                    color="primary" 
                    size="small" 
                    sx={{ ml: 2 }}
                  />
                </AccordionSummary>
                <AccordionDetails>
                  <div>
                    {values.meals[mealType].map((foodItem, index) => (
                      <Grid container spacing={2} key={index} sx={{ mb: 3 }}>
                        <Grid item xs={12}>
                          <Paper elevation={2} sx={{ p: 2, position: 'relative' }}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  name={`meals.${mealType}[${index}].name`}
                                  label="Food Name"
                                  fullWidth
                                  onChange={(e) => {
                                    setFieldValue(
                                      `meals.${mealType}[${index}].name`,
                                      e.target.value
                                    );
                                  }}
                                />
                                <ErrorMessage
                                  name={`meals.${mealType}[${index}].name`}
                                  component="div"
                                  className="error-message"
                                />
                              </Grid>

                              <Grid item xs={12} sm={6}>
                                <TextField
                                  name={`meals.${mealType}[${index}].quantity`}
                                  label="Quantity (g)"
                                  type="number"
                                  fullWidth
                                  onChange={(e) => {
                                    setFieldValue(
                                      `meals.${mealType}[${index}].quantity`,
                                      e.target.value
                                    );
                                  }}
                                />
                                <ErrorMessage
                                  name={`meals.${mealType}[${index}].quantity`}
                                  component="div"
                                  className="error-message"
                                />
                              </Grid>

                              <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                  name={`meals.${mealType}[${index}].calories`}
                                  label="Calories"
                                  type="number"
                                  fullWidth
                                  onChange={(e) => {
                                    setFieldValue(
                                      `meals.${mealType}[${index}].calories`,
                                      e.target.value
                                    );
                                  }}
                                />
                                <ErrorMessage
                                  name={`meals.${mealType}[${index}].calories`}
                                  component="div"
                                  className="error-message"
                                />
                              </Grid>

                              <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                  name={`meals.${mealType}[${index}].protein`}
                                  label="Protein (g)"
                                  type="number"
                                  fullWidth
                                  onChange={(e) => {
                                    setFieldValue(
                                      `meals.${mealType}[${index}].protein`,
                                      e.target.value
                                    );
                                  }}
                                />
                                <ErrorMessage
                                  name={`meals.${mealType}[${index}].protein`}
                                  component="div"
                                  className="error-message"
                                />
                              </Grid>

                              <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                  name={`meals.${mealType}[${index}].carbs`}
                                  label="Carbs (g)"
                                  type="number"
                                  fullWidth
                                  onChange={(e) => {
                                    setFieldValue(
                                      `meals.${mealType}[${index}].carbs`,
                                      e.target.value
                                    );
                                  }}
                                />
                                <ErrorMessage
                                  name={`meals.${mealType}[${index}].carbs`}
                                  component="div"
                                  className="error-message"
                                />
                              </Grid>

                              <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                  name={`meals.${mealType}[${index}].fat`}
                                  label="Fat (g)"
                                  type="number"
                                  fullWidth
                                  onChange={(e) => {
                                    setFieldValue(
                                      `meals.${mealType}[${index}].fat`,
                                      e.target.value
                                    );
                                  }}
                                />
                                <ErrorMessage
                                  name={`meals.${mealType}[${index}].fat`}
                                  component="div"
                                  className="error-message"
                                />
                              </Grid>
                            </Grid>
                            <IconButton
                              color="error"
                              onClick={() => values.meals[mealType].splice(index, 1)}
                              sx={{ position: 'absolute', top: 8, right: 8 }}
                              aria-label="Delete food item"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Paper>
                        </Grid>
                      </Grid>
                    ))}
                    <Button
                      startIcon={<AddIcon />}
                      variant="outlined"
                      color="primary"
                      onClick={() => {
                        const newMeals = [...values.meals[mealType]];
                        newMeals.push({
                          name: "",
                          quantity: "",
                          calories: "",
                          protein: "",
                          carbs: "",
                          fat: "",
                        });
                        setFieldValue(`meals.${mealType}`, newMeals);
                      }}
                      sx={{ mt: 2 }}
                      fullWidth={isMobile}
                    >
                      Add Food Item
                    </Button>
                  </div>
                </AccordionDetails>
              </Accordion>
            ))}

            {loading && (
              <Box display="flex" justifyContent="center" my={2}>
                <CircularProgress />
              </Box>
            )}
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            <Grid container justifyContent="center" mt={3}>
              <Tooltip title="Track your nutrition" arrow>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  size={isMobile ? "medium" : "large"}
                  disabled={loading}
                  fullWidth={isMobile}
                >
                  {loading ? "Tracking..." : "Track Food"}
                </Button>
              </Tooltip>
            </Grid>
          </Form>
        )}
      </Formik>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={severity ? "success" : "error"} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default FoodForm;