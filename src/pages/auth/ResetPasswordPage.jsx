// ResetPasswordPage.jsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Box, Button, Container, CssBaseline, TextField, Typography, Snackbar, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { resetPassword } from '../../services/authService';

const validationSchema = yup.object({
  password: yup.string().min(8, 'Password must be at least 8 characters long').matches(/[A-Z]/, 'Password must contain at least one uppercase letter').matches(/[a-z]/, 'Password must contain at least one lowercase letter').matches(/\d/, 'Password must contain at least one number').matches(/[@$!%*?&]/, 'Password must contain at least one special character').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required')
});

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'info' });

  const formik = useFormik({
    initialValues: { password: '', confirmPassword: '' },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await resetPassword(token, values.password);
        setSnackbar({ open: true, message: 'Password has been reset successfully.', severity: 'success' });
        setTimeout(() => { navigate('/auth/sign-in'); formik.resetForm(); }, 5000);
      } catch (err) {
        setSnackbar({ open: true, message: 'Error resetting password. Please try again.', severity: 'error' });
      }
    },
  });

  const handleClose = () => setSnackbar((prev) => ({ ...prev, open: false }));

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 3, borderRadius: 1, boxShadow: 3, backgroundColor: theme.palette.background.paper }}>
        <Typography component="h1" variant="h5">Reset Password</Typography>
        <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
          <TextField margin="normal" required fullWidth id="password" label="New Password" name="password" type="password" autoComplete="new-password" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.password && Boolean(formik.errors.password)} helperText={formik.touched.password && formik.errors.password} autoFocus />
          <TextField margin="normal" required fullWidth id="confirmPassword" label="Confirm Password" name="confirmPassword" type="password" autoComplete="new-password" value={formik.values.confirmPassword} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)} helperText={formik.touched.confirmPassword && formik.errors.confirmPassword} />
          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>Reset Password</Button>
        </Box>
        <Snackbar open={snackbar.open} onClose={handleClose} autoHideDuration={6000} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          <Alert onClose={handleClose} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>{snackbar.message}</Alert>
        </Snackbar>
      </Box>
    </Container>
  );
}
