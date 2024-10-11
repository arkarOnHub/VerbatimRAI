import React, { useState } from "react";
import { useRouter } from 'next/router';  // Import useRouter from next/router
import { Box, TextField, Button, Grid, Typography, Snackbar, Alert } from '@mui/material';

export default function Signup() {
    const [registerName, setRegisterName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    
    const router = useRouter();  // Initialize router

    const handleSnackbarClose = () => {
      setOpenSnackbar(false);
    };

    const handleRegisterSubmit = async (e) => {
      e.preventDefault();
      if (registerPassword !== registerConfirmPassword) {
        setSnackbarMessage('Passwords do not match');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        return;
      }

      try {
        const response = await fetch('/api/users/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: registerName,
            email: registerEmail,
            password_hash: registerPassword,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Registration failed');
        }

        const data = await response.json();
        setSnackbarMessage('Registration successful!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);

        // Redirect after successful registration
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
            <Typography variant="h4" gutterBottom>Create Account</Typography>
            <form onSubmit={handleRegisterSubmit}>
              <Grid container sx={{ height: '80px' }}>
                <Grid item xs={12} md={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 10px 0 0' }}>
                  <TextField
                    fullWidth
                    label="Username"
                    margin="normal"
                    variant="outlined"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                  />
                </Grid>
              </Grid>
              <TextField
                fullWidth
                label="Email"
                margin="normal"
                variant="outlined"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                variant="outlined"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
              />
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                margin="normal"
                variant="outlined"
                value={registerConfirmPassword}
                onChange={(e) => setRegisterConfirmPassword(e.target.value)}
              />
              <Button
                fullWidth
                variant="contained"
                sx={{ backgroundColor: '#757575', marginTop: '40px', padding: '10px 0' }}
                type="submit"
              >
                Create Account
              </Button>
            </form>
            <Typography sx={{ marginTop: '10px', textAlign: 'left' }}>
              Already have an account? <Button href="/login" underline="none" sx={{ fontWeight: 500 }}>Login</Button>
            </Typography>
          </Box>
        </Grid>

        {/* Snackbar for notifications */}
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Grid>
    );
}
