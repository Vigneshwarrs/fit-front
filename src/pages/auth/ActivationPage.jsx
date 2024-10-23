import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, CircularProgress, Alert, CssBaseline } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { activateUser } from '../../services/authService'; // Import your activateUser service function

export default function ActivationPage() {
  const { token } = useParams(); // Get the token from the URL
  const navigate = useNavigate(); // Hook to navigate programmatically
  const [status, setStatus] = useState({ loading: true, success: null, message: '' });

  useEffect(() => {
    async function activateAccount() {
      try {
        const response = await activateUser(token); // Assume this is a function that sends a request to your server to activate the user
        setStatus({ loading: false, success: true, message: response.data.message });
        setTimeout(() => {
          navigate('/auth/sigin-in'); // Navigate to the login page after a delay
        }, 3000); // Redirect after 3 seconds
      } catch (err) {
        setStatus({ loading: false, success: false, message: 'Failed to activate account. Please try again or contact support.' });
      }
    }

    activateAccount();
  }, [token, navigate]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 3,
          borderRadius: 1,
          boxShadow: 3
        }}
      >
        <Typography component="h1" variant="h5">
          Account Activation
        </Typography>
        {status.loading ? (
          <CircularProgress sx={{ mt: 3 }} />
        ) : (
          <Alert severity={status.success ? 'success' : 'error'} sx={{ mt: 3 }}>
            {status.message}
          </Alert>
        )}
      </Box>
    </Container>
  );
}
