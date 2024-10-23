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
import { forgotPassword } from "../../services/authService";
import { useTheme } from "@mui/material/styles";

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

export default function ForgotPasswordPage() {
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
      username: "",
    },
    validationSchema: yup.object({
      username: yup
        .string()
        .email("Please enter a valid email address")
        .required("Email address is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await forgotPassword(values.username);
        setSnackbar({
          open: true,
          message: response.data.message || "A password reset link has been sent to your email.",
          severity: "success",
        });
        setTimeout(() => {
          navigate("/auth/sign-in");
          authForm.resetForm();
        }, 3000);
      } catch (error) {
        console.error("Forgot Password error:", error);
        setSnackbar({
          open: true,
          message: error.response?.data?.message || "An error occurred while processing your request. Please try again.",
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
          Reset Your Password
        </Typography>
        <Typography component="p" variant="body2" sx={{ mt: 1, textAlign: "center", color: theme.palette.text.secondary }}>
          Enter your email address below and we'll send you a link to reset your password.
        </Typography>
        <Box component="form" onSubmit={authForm.handleSubmit} sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            value={authForm.values.username}
            onChange={authForm.handleChange}
            onBlur={authForm.handleBlur}
            error={authForm.touched.username && Boolean(authForm.errors.username)}
            helperText={authForm.touched.username && authForm.errors.username}
            autoFocus
            aria-label="Email Address"
            sx={{ input: { color: theme.palette.text.primary } }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
            startIcon={loading ? <CircularProgress size="1rem" /> : null}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
          <Grid container justifyContent="center">
            <Grid item>
              <Link to="/auth/sign-in" style={{ color: theme.palette.primary.main }}>
                Return to Sign In
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
