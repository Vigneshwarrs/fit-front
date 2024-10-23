  // import React, { useState, useEffect } from "react";
  // import { Formik, Form, Field, ErrorMessage } from "formik";
  // import * as Yup from "yup";
  // import { useDispatch, useSelector } from "react-redux";
  // import { addWorkout, getExercises } from "../../services/workoutService";
  // import { 
  //   TextField, 
  //   MenuItem, 
  //   Select, 
  //   InputLabel, 
  //   FormControl, 
  //   Button, 
  //   Grid, 
  //   CircularProgress, 
  //   Alert,
  //   Snackbar,
  //   Box
  // } from "@mui/material";
  // import { workoutFailure, workoutRequest, workoutSuccess, clearWorkoutState } from "../../redux/slice/workoutSlice";

  // const WorkoutForm = () => {
  //   const dispatch = useDispatch();
  //   const { loading } = useSelector((state) => state.workout);
  //   const [exercises, setExercises] = useState([]);
  //   const [workoutType, setWorkoutType] = useState("");
  //   const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  //   const initialValues = {
  //     workoutName: "",
  //     workoutType: "",
  //     description: "",
  //     sets: "",
  //     reps: "",
  //     duration: "",
  //     weightPerSet: "",
  //     caloriesBurned: "",
  //   };

  //   const validationSchema = Yup.object().shape({
  //     workoutType: Yup.string().required("Workout type is required"),
  //     workoutName: Yup.string().required("Workout name is required"),
  //     sets: Yup.number().when('workoutType', {
  //       is: 'strength',
  //       then:() => Yup.number()
  //         .required("Sets are required for strength workouts")
  //         .positive("Sets must be a positive number")
  //         .integer("Sets must be an integer"),
  //       otherwise:() => Yup.number().nullable(),
  //     }),
  //     reps: Yup.number().when('workoutType', {
  //       is: 'strength',
  //       then: () =>Yup.number()
  //         .required("Reps are required for strength workouts")
  //         .positive("Reps must be a positive number")
  //         .integer("Reps must be an integer"),
  //       otherwise:() => Yup.number().nullable(),
  //     }),
  //     duration: Yup.number().when('workoutType', {
  //       is: 'cardio',
  //       then:() => Yup.number()
  //         .required("Duration is required for cardio workouts")
  //         .positive("Duration must be a positive number"),
  //       otherwise:() => Yup.number().nullable(),
  //     }),
  //     weightPerSet: Yup.number().when('workoutType', {
  //       is: 'strength',
  //       then:() => Yup.number()
  //         .required("Weight per set is required for strength workouts")
  //         .positive("Weight must be a positive number"),
  //       otherwise:() => Yup.number().nullable(),
  //     }),
  //     caloriesBurned: Yup.number().when('workoutType', {
  //       is: 'other',
  //       then: ()=>Yup.number().required("Calories burned is required for 'Other' type"),
  //       otherwise:() => Yup.number().nullable(),
  //     })
  //   });

  //   const handleSubmit = async (values, { resetForm }) => {
  //     dispatch(workoutRequest());
  //     try {
  //       const selectedExercise = exercises.find(
  //         (ex) => ex.workoutName === values.workoutName
  //       );

  //       let calCaloriesBurned = 0;
  //       if (values.workoutType === "strength") {
  //         calCaloriesBurned =
  //           selectedExercise?.caloriesBurnedPerRep * values.sets * values.reps || 0;
  //       } else if (values.workoutType === "cardio") {
  //         calCaloriesBurned =
  //           selectedExercise?.caloriesBurnedPerMinute * values.duration || 0;
  //       } else if (values.workoutType === "other") {
  //         calCaloriesBurned = values.caloriesBurned;
  //       }

  //       const workoutData = {
  //         ...values,
  //         caloriesBurned: calCaloriesBurned,
  //       };
  //       console.log(workoutData);
  //       const {data} = await addWorkout(workoutData);
  //       dispatch(workoutSuccess(data));
  //       setSnackbar({ open: true, message: "Workout added successfully!", severity: "success" });
  //       resetForm();
  //       setWorkoutType("");
  //     } catch (err) {
  //       console.error(err);
  //       dispatch(workoutFailure(err));
  //       setSnackbar({ open: true, message: "Failed to add workout. Please try again.", severity: "error" });
  //     }
  //   };

  //   useEffect(() => {
  //     const fetchExercises = async () => {
  //       try {
  //         const response = await getExercises();
  //         setExercises(response.data);
  //       } catch (error) {
  //         console.error("Failed to fetch exercises:", error);
  //         setSnackbar({ open: true, message: "Failed to load exercises. Please refresh the page.", severity: "error" });
  //       }
  //     };
  //     fetchExercises();
  //   }, []);

  //   const handleCloseSnackbar = (event, reason) => {
  //     if (reason === 'clickaway') {
  //       return;
  //     }
  //     setSnackbar({ ...snackbar, open: false });
  //     dispatch(clearWorkoutState());
  //   };

  //   const renderWorkoutFields = (values, setFieldValue) => {
  //     switch (workoutType) {
  //       case "strength":
  //         return (
  //           <>
  //             <Grid item xs={12} md={4}>
  //               <TextField
  //                 fullWidth
  //                 label="Sets"
  //                 name="sets"
  //                 type="number"
  //                 variant="outlined"
  //                 onChange={e => setFieldValue("sets", e.target.value)}
  //                 helperText={<ErrorMessage name="sets" />}
  //               />
  //             </Grid>
  //             <Grid item xs={12} md={4}>
  //               <TextField
  //                 fullWidth
  //                 label="Reps"
  //                 name="reps"
  //                 type="number"
  //                 variant="outlined"
  //                 onChange={e => setFieldValue("reps", e.target.value)}
  //                 helperText={<ErrorMessage name="reps" />}
  //               />
  //             </Grid>
  //             <Grid item xs={12} md={4}>
  //               <TextField
  //                 fullWidth
  //                 label="Weight per Set"
  //                 name="weightPerSet"
  //                 type="number"
  //                 variant="outlined"
  //                 onChange={e => setFieldValue("weightPerSet", e.target.value)}
  //                 helperText={<ErrorMessage name="weightPerSet" />}
  //               />
  //             </Grid>
  //           </>
  //         );
  //       case "cardio":
  //         return (
  //           <Grid item xs={12} md={6}>
  //             <TextField
  //               fullWidth
  //               label="Duration (minutes)"
  //               name="duration"
  //               type="number"
  //               variant="outlined"
  //               onChange={e => setFieldValue("duration", e.target.value)}
  //               helperText={<ErrorMessage name="duration" />}
  //             />
  //           </Grid>
  //         );
  //       case "other":
  //         return (
  //           <>
  //             <Grid item xs={12}>
  //               <TextField
  //                 fullWidth
  //                 label="Description"
  //                 name="description"
  //                 variant="outlined"
  //                 onChange={e => setFieldValue("description", e.target.value)}
  //                 helperText={<ErrorMessage name="description" />}
  //               />
  //             </Grid>
  //             <Grid item xs={12} md={4}>
  //               <TextField
  //                 fullWidth
  //                 label="Sets"
  //                 name="sets"
  //                 type="number"
  //                 variant="outlined"
  //                 onChange={e => setFieldValue("sets", e.target.value)}
  //                 helperText={<ErrorMessage name="sets" />}
  //               />
  //             </Grid>
  //             <Grid item xs={12} md={4}>
  //               <TextField
  //                 fullWidth
  //                 label="Reps"
  //                 name="reps"
  //                 type="number"
  //                 variant="outlined"
  //                 onChange={e => setFieldValue("reps", e.target.value)}
  //                 helperText={<ErrorMessage name="reps" />}
  //               />
  //             </Grid>
  //             <Grid item xs={12} md={4}>
  //               <TextField
  //                 fullWidth
  //                 label="Duration (minutes)"
  //                 name="duration"
  //                 type="number"
  //                 variant="outlined"
  //                 onChange={e => setFieldValue("duration", e.target.value)}
  //                 helperText={<ErrorMessage name="duration" />}
  //               />
  //             </Grid>
  //             <Grid item xs={12}>
  //               <TextField
  //                 fullWidth
  //                 label="Calories Burned"
  //                 name="caloriesBurned"
  //                 type="number"
  //                 variant="outlined"
  //                 onChange={e => setFieldValue("caloriesBurned", e.target.value)}
  //                 helperText={<ErrorMessage name="caloriesBurned" />}
  //               />
  //             </Grid>
  //           </>
  //         );
  //       default:
  //         return null;
  //     }
  //   };

  //   const renderWorkoutNameField = (setFieldValue) => {
  //     if (workoutType === "other") {
  //       return (
  //         <TextField
  //           fullWidth
  //           label="Workout Name"
  //           name="workoutName"
  //           variant="outlined"
  //           onChange={e => setFieldValue("workoutName", e.target.value)}
  //           helperText={<ErrorMessage name="workoutName" />}
  //         />
  //       );
  //     }

  //     return (
  //       <FormControl fullWidth variant="outlined">
  //         <InputLabel>Workout Name</InputLabel>
  //         <Field
  //           as={Select}
  //           name="workoutName"
  //           label="Workout Name"
  //           onChange={(e) => setFieldValue("workoutName", e.target.value)}
  //           disabled={!workoutType}
  //         >
  //           <MenuItem value="">Select Workout Name</MenuItem>
  //           {exercises
  //             .filter((exercise) => exercise.workoutType === workoutType)
  //             .map((exercise) => (
  //               <MenuItem key={exercise._id} value={exercise.workoutName}>
  //                 {exercise.workoutName}
  //               </MenuItem>
  //             ))}
  //         </Field>
  //         <ErrorMessage name="workoutName" component="div" />
  //       </FormControl>
  //     );
  //   };

  //   return (
  //     <Box sx={{ padding: '16px' }}>
  //       <Formik
  //         initialValues={initialValues}
  //         validationSchema={validationSchema}
  //         onSubmit={handleSubmit}
  //       >
  //         {({ values, setFieldValue, resetForm }) => (
  //           <Form>
  //             <Grid container spacing={3}>
  //               <Grid item xs={12} md={6}>
  //                 <FormControl fullWidth variant="outlined">
  //                   <InputLabel>Workout Type</InputLabel>
  //                   <Field
  //                     as={Select}
  //                     name="workoutType"
  //                     label="Workout Type"
  //                     onChange={(e) => {
  //                       setWorkoutType(e.target.value);
  //                       setFieldValue("workoutType", e.target.value);
  //                       setFieldValue("workoutName", "");
  //                       setFieldValue("sets", "");
  //                       setFieldValue("reps", "");
  //                       setFieldValue("weightPerSet", "");
  //                       setFieldValue("duration", "");
  //                       setFieldValue("caloriesBurned", "");
  //                     }}
  //                   >
  //                     <MenuItem value="">Select Workout Type</MenuItem>
  //                     <MenuItem value="strength">Strength</MenuItem>
  //                     <MenuItem value="cardio">Cardio</MenuItem>
  //                     <MenuItem value="other">Other</MenuItem>
  //                   </Field>
  //                   <ErrorMessage name="workoutType" component="div" />
  //                 </FormControl>
  //               </Grid>

  //               <Grid item xs={12} md={6}>
  //                 {renderWorkoutNameField(setFieldValue)}
  //               </Grid>

  //               {renderWorkoutFields(values, setFieldValue)}

  //               <Grid item xs={12}>
  //                 <Button type="submit" variant="contained" color="primary" disabled={loading}>
  //                   {loading ? <CircularProgress size={24} /> : "Track Workout"}
  //                 </Button>
  //               </Grid>
  //             </Grid>
  //           </Form>
  //         )}
  //       </Formik>

  //       <Snackbar 
  //         open={snackbar.open} 
  //         autoHideDuration={6000} 
  //         onClose={handleCloseSnackbar}
  //         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
  //       >
  //         <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
  //           {snackbar.message}
  //         </Alert>
  //       </Snackbar>
  //     </Box>
  //   );
  // };

  // export default WorkoutForm;
  import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { addWorkout, getExercises } from "../../services/workoutService";
import { 
  TextField, 
  MenuItem, 
  Select, 
  InputLabel, 
  FormControl, 
  Button, 
  Grid, 
  CircularProgress, 
  Alert,
  Snackbar,
  Box
} from "@mui/material";
import { workoutFailure, workoutRequest, workoutSuccess, clearWorkoutState } from "../../redux/slice/workoutSlice";

const WorkoutForm = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.workout);
  const [exercises, setExercises] = useState([]);
  const [workoutType, setWorkoutType] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const initialValues = {
    workoutName: "",
    workoutType: "",
    description: "",
    sets: "",
    reps: "",
    duration: "",
    weightPerSet: "",
    caloriesBurned: "",
  };

  const validationSchema = Yup.object().shape({
    workoutType: Yup.string().required("Workout type is required"),
    workoutName: Yup.string().required("Workout name is required"),
    sets: Yup.number().when('workoutType', {
      is: 'strength',
      then:() => Yup.number()
        .required("Sets are required for strength workouts")
        .positive("Sets must be a positive number")
        .integer("Sets must be an integer"),
      otherwise:() => Yup.number().nullable(),
    }),
    reps: Yup.number().when('workoutType', {
      is: 'strength',
      then: () =>Yup.number()
        .required("Reps are required for strength workouts")
        .positive("Reps must be a positive number")
        .integer("Reps must be an integer"),
      otherwise:() => Yup.number().nullable(),
    }),
    duration: Yup.number().when('workoutType', {
      is: 'cardio',
      then:() => Yup.number()
        .required("Duration is required for cardio workouts")
        .positive("Duration must be a positive number"),
      otherwise:() => Yup.number().nullable(),
    }),
    weightPerSet: Yup.number().when('workoutType', {
      is: 'strength',
      then:() => Yup.number()
        .required("Weight per set is required for strength workouts")
        .positive("Weight must be a positive number"),
      otherwise:() => Yup.number().nullable(),
    }),
    caloriesBurned: Yup.number().when('workoutType', {
      is: 'other',
      then: ()=>Yup.number().required("Calories burned is required for 'Other' type"),
      otherwise:() => Yup.number().nullable(),
    })
  });

  const handleSubmit = async (values, { resetForm }) => {
    dispatch(workoutRequest());
    try {
      const selectedExercise = exercises.find(
        (ex) => ex.workoutName === values.workoutName
      );

      let calCaloriesBurned = 0;
      if (values.workoutType === "strength") {
        calCaloriesBurned =
          selectedExercise?.caloriesBurnedPerRep * values.sets * values.reps || 0;
      } else if (values.workoutType === "cardio") {
        calCaloriesBurned =
          selectedExercise?.caloriesBurnedPerMinute * values.duration || 0;
      } else if (values.workoutType === "other") {
        calCaloriesBurned = values.caloriesBurned;
      }

      const workoutData = {
        ...values,
        caloriesBurned: calCaloriesBurned,
      };
      console.log(workoutData);
      const {data} = await addWorkout(workoutData);
      dispatch(workoutSuccess(data));
      setSnackbar({ open: true, message: "Workout added successfully!", severity: "success" });
      resetForm();
      setWorkoutType("");
    } catch (err) {
      console.error(err);
      dispatch(workoutFailure(err));
      setSnackbar({ open: true, message: "Failed to add workout. Please try again.", severity: "error" });
    }
  };

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await getExercises();
        setExercises(response.data);
      } catch (error) {
        console.error("Failed to fetch exercises:", error);
        setSnackbar({ open: true, message: "Failed to load exercises. Please refresh the page.", severity: "error" });
      }
    };
    fetchExercises();
  }, []);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
    dispatch(clearWorkoutState());
  };

  const renderWorkoutFields = (values, setFieldValue) => {
    switch (workoutType) {
      case "strength":
        return (
          <>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Sets"
                name="sets"
                type="number"
                variant="outlined"
                onChange={e => setFieldValue("sets", e.target.value)}
                helperText={<ErrorMessage name="sets" />}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Reps"
                name="reps"
                type="number"
                variant="outlined"
                onChange={e => setFieldValue("reps", e.target.value)}
                helperText={<ErrorMessage name="reps" />}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Weight per Set"
                name="weightPerSet"
                type="number"
                variant="outlined"
                onChange={e => setFieldValue("weightPerSet", e.target.value)}
                helperText={<ErrorMessage name="weightPerSet" />}
              />
            </Grid>
          </>
        );
      case "cardio":
        return (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Duration (minutes)"
              name="duration"
              type="number"
              variant="outlined"
              onChange={e => setFieldValue("duration", e.target.value)}
              helperText={<ErrorMessage name="duration" />}
            />
          </Grid>
        );
      case "other":
        return (
          <>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                variant="outlined"
                onChange={e => setFieldValue("description", e.target.value)}
                helperText={<ErrorMessage name="description" />}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Sets"
                name="sets"
                type="number"
                variant="outlined"
                onChange={e => setFieldValue("sets", e.target.value)}
                helperText={<ErrorMessage name="sets" />}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Reps"
                name="reps"
                type="number"
                variant="outlined"
                onChange={e => setFieldValue("reps", e.target.value)}
                helperText={<ErrorMessage name="reps" />}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Duration (minutes)"
                name="duration"
                type="number"
                variant="outlined"
                onChange={e => setFieldValue("duration", e.target.value)}
                helperText={<ErrorMessage name="duration" />}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Calories Burned"
                name="caloriesBurned"
                type="number"
                variant="outlined"
                onChange={e => setFieldValue("caloriesBurned", e.target.value)}
                helperText={<ErrorMessage name="caloriesBurned" />}
              />
            </Grid>
          </>
        );
      default:
        return null;
    }
  };

  const renderWorkoutNameField = (setFieldValue) => {
    if (workoutType === "other") {
      return (
        <TextField
          fullWidth
          label="Workout Name"
          name="workoutName"
          variant="outlined"
          onChange={e => setFieldValue("workoutName", e.target.value)}
          helperText={<ErrorMessage name="workoutName" />}
        />
      );
    }

    return (
      <FormControl fullWidth variant="outlined">
        <InputLabel>Workout Name</InputLabel>
        <Field
          as={Select}
          name="workoutName"
          label="Workout Name"
          onChange={(e) => setFieldValue("workoutName", e.target.value)}
          disabled={!workoutType}
        >
          <MenuItem value="">Select Workout Name</MenuItem>
          {exercises
            .filter((exercise) => exercise.workoutType === workoutType)
            .map((exercise) => (
              <MenuItem key={exercise._id} value={exercise.workoutName}>
                {exercise.workoutName}
              </MenuItem>
            ))}
        </Field>
        <ErrorMessage name="workoutName" component="div" />
      </FormControl>
    );
  };

  return (
    <Box sx={{ padding: '16px' }}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, resetForm }) => (
          <Form>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Workout Type</InputLabel>
                  <Field
                    as={Select}
                    name="workoutType"
                    label="Workout Type"
                    onChange={(e) => {
                      setWorkoutType(e.target.value);
                      setFieldValue("workoutType", e.target.value);
                      setFieldValue("workoutName", "");
                      setFieldValue("sets", "");
                      setFieldValue("reps", "");
                      setFieldValue("weightPerSet", "");
                      setFieldValue("duration", "");
                      setFieldValue("caloriesBurned", "");
                    }}
                  >
                    <MenuItem value="">Select Workout Type</MenuItem>
                    <MenuItem value="strength">Strength</MenuItem>
                    <MenuItem value="cardio">Cardio</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Field>
                  <ErrorMessage name="workoutType" component="div" />
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                {renderWorkoutNameField(setFieldValue)}
              </Grid>

              {renderWorkoutFields(values, setFieldValue)}

              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : "Track Workout"}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default WorkoutForm;