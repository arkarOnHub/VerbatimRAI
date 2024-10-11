import React, { useState } from "react";
import { Box, TextField, Button, Grid, Typography, Snackbar, Alert } from '@mui/material';
import { useRouter } from 'next/router';

export default function Login() {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  const router = useRouter(); // Initialize router

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginEmail,
          password_hash: loginPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      setSnackbarMessage('Login successful!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);

      // Redirect to home page after successful login
      router.push('/home');
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  return (
    <Grid container sx={{ height: '100vh' }}>
      {/* Left side with the image and tagline */}
      <Grid item xs={12} md={4} sx={{ backgroundColor: '#d8b4fe', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', width: { xs: '10%', md: '10%' }}}>
        <Box textAlign="center">
          <img src="/logo.png" alt="RAI Logo" style={{ width: '100%' }} /> {/* Replace with your actual logo */}
          <Typography variant="h4" sx={{ marginTop: '20px', fontWeight: 600 }}>Luxury Within Reach</Typography>
          <Typography variant="subtitle1" sx={{ marginTop: '10px', fontWeight: 300 }}>Rent, Experience, Repeat.</Typography>
        </Box>
      </Grid>

      {/* Right side with the login form */}
      <Grid item xs={12} md={8} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ width: '80%', maxWidth: '700px' }}>
          <Typography variant="h4" gutterBottom>Login</Typography>
          <form onSubmit={handleLoginSubmit}>
            <TextField
                fullWidth
                label="Email"
                margin="normal"
                variant="outlined"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
            />
            <TextField
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                variant="outlined"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
            />
            <Button
                fullWidth
                variant="contained"
                sx={{ backgroundColor: '#757575', marginTop: '40px', padding: '10px 0' }}
                type="submit"
            >
                Login
            </Button>
          </form>
          <Typography sx={{ marginTop: '10px', textAlign: 'left' }}>
            Don’t have an account? <Button href="/signup" variant="text" sx={{ fontWeight: 500 }}>Signup</Button>
          </Typography>
        </Box>
      </Grid>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
}
