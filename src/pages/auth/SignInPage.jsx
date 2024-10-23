import React, { useEffect, useState } from "react";
import {
  Alert, Avatar, Box, Button, Container, CssBaseline, Grid, TextField, Typography, Slide,
  Snackbar, CircularProgress, useMediaQuery
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useFormik } from "formik";
import * as yup from "yup";
import { useTheme } from "@mui/material/styles";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // Added
import { loginRequest, loginSuccess, loginFail } from "../../redux/slice/authSlice"; // Added
import { signIn } from "../../services/authService";

const SlideTransition = (props) => <Slide {...props} direction="up" />;

function SignInPage() {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const {user} = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth); // Get 'loading' from Redux

  const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

  const validationSchema = yup.object({
    email: yup
      .string()
      .email("Please enter a valid email address")
      .required("Email address is required"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters long")
      .required("Password is required"),
  });

  const authForm = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values) => {
      dispatch(loginRequest()); // Dispatch the login request

      try {

        const {data} = await signIn(values.email, values.password);
        console.log(data);
        dispatch(loginSuccess(data)); // Dispatch login success

        setSnackbar({
          open: true,
          message: "Login successful! Redirecting...",
          severity: "success",
        });
      } catch (error) {
        dispatch(loginFail("Invalid credentials. Please try again."));
        setSnackbar({
          open: true,
          message: error.response?.data?.message || "Invalid credentials. Please try again.",
          severity: "error",
        });
      }
    },
  });
  useEffect(() => {
    if (user && user.isProfileComplete !== undefined) {
      // Redirect based on whether the profile is complete or not
      const redirectPath = user.isProfileComplete ? '/home' : '/profile-setup';
      setTimeout(() => {
        navigate(redirectPath);
        authForm.resetForm(); // Reset form after successful login
      }, 3000);
    }
  }, [user, navigate, authForm]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        width={isSmallScreen ? "100%" : 450}
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: theme.palette.primary.main }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <Box component="form" onSubmit={authForm.handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            value={authForm.values.email}
            onChange={authForm.handleChange}
            onBlur={authForm.handleBlur}
            error={authForm.touched.email && Boolean(authForm.errors.email)}
            helperText={authForm.touched.email && authForm.errors.email}
          />
          <TextField
            margin="normal"
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={authForm.values.password}
            onChange={authForm.handleChange}
            onBlur={authForm.handleBlur}
            error={authForm.touched.password && Boolean(authForm.errors.password)}
            helperText={authForm.touched.password && authForm.errors.password}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading} // Use Redux 'loading' state here
            startIcon={loading && <CircularProgress size="1rem" />}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
          <Grid container justifyContent="space-between">
            <Grid item>
              <Link to="/auth/forgot-password" style={{ color: theme.palette.primary.main }}>
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link to="/auth/sign-up" style={{ color: theme.palette.primary.main }}>
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Snackbar
        open={snackbar.open}
        onClose={handleCloseSnackbar}
        TransitionComponent={SlideTransition}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default SignInPage;
