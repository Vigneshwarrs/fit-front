import * as React from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  TextField,
  Typography,
  Slide,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useFormik } from "formik";
import * as yup from "yup";
import { signUp } from "../../services/authService";
import { useTheme } from "@mui/material/styles";

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

export default function SignUpPage() {
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate();
  const theme = useTheme(); // Access theme for consistent styling

  const handleClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const authForm = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
    },
    validationSchema: yup.object({
      firstName: yup.string().required("First Name is required"),
      lastName: yup.string().required("Last Name is required"),
      username: yup
        .string()
        .email("Please enter a valid email address")
        .required("Email address is required"),
      password: yup
        .string()
        .min(8, "Password must be at least 8 characters long")
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/\d/, 'Password must contain at least one number')
        .matches(/[@$!%*?&]/, 'Password must contain at least one special character')
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await signUp({
          name: `${values.firstName} ${values.lastName}`,
          password: values.password,
          email: values.username,
        });
        setSnackbar({
          open: true,
          message: "Registration successful! Redirecting to login...",
          severity: "success",
        });
        setTimeout(() => {
          navigate("/auth/sign-in");
          authForm.resetForm();
        }, 3000);
      } catch (error) {
        console.error("Registration error:", error);
        setSnackbar({
          open: true,
          message: error.response?.data?.message || "Registration failed. Please try again.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
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
        <Typography component="h1" variant="h5" sx={{ color: theme.palette.text.primary }}>
          Sign Up
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={authForm.handleSubmit}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                onChange={authForm.handleChange}
                onBlur={authForm.handleBlur}
                value={authForm.values.firstName}
                error={
                  authForm.touched.firstName && Boolean(authForm.errors.firstName)
                }
                helperText={
                  authForm.touched.firstName && authForm.errors.firstName
                }
                autoFocus
                sx={{ input: { color: theme.palette.text.primary } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                onChange={authForm.handleChange}
                onBlur={authForm.handleBlur}
                value={authForm.values.lastName}
                error={
                  authForm.touched.lastName && Boolean(authForm.errors.lastName)
                }
                helperText={
                  authForm.touched.lastName && authForm.errors.lastName
                }
                sx={{ input: { color: theme.palette.text.primary } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                onChange={authForm.handleChange}
                onBlur={authForm.handleBlur}
                value={authForm.values.username}
                error={
                  authForm.touched.username && Boolean(authForm.errors.username)
                }
                helperText={
                  authForm.touched.username && authForm.errors.username
                }
                sx={{ input: { color: theme.palette.text.primary } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                onChange={authForm.handleChange}
                onBlur={authForm.handleBlur}
                value={authForm.values.password}
                error={
                  authForm.touched.password && Boolean(authForm.errors.password)
                }
                helperText={
                  authForm.touched.password && authForm.errors.password
                }
                sx={{ input: { color: theme.palette.text.primary } }}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
            startIcon={loading ? <CircularProgress size="1rem" /> : null}
          >
            {loading ? "Registering..." : "Sign Up"}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/auth/sign-in" style={{ color: theme.palette.primary.main }}>
                Already have an account? Sign In
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Snackbar
        open={snackbar.open}
        onClose={handleClose}
        TransitionComponent={SlideTransition}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
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
