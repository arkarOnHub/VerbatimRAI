import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  IconButton,
  Button,
  Snackbar,
  Alert,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    // Load the cart from localStorage when the page loads
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(cart);
  }, []);

  // Remove an item from the cart
  const handleRemoveFromCart = (productId) => {
    const updatedCart = cartItems.filter((item) => item.product_id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setSnackbarMessage('Product removed from cart');
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
  };

  // Confirm the cart and send the products to the backend
  const handleConfirmCart = async () => {
    try {
      const userId = localStorage.getItem('user_id'); // Retrieve the user ID from localStorage

      // Send each cart item to the backend to create the rental
      for (const item of cartItems) {
        await axios.post('/api/rent/create', {
          user_id: userId,
          product_id: item.product_id,
          rental_date: new Date().toISOString(),
        });
      }

      // Clear the cart after confirmation
      localStorage.removeItem('cart');
      setCartItems([]);

      setSnackbarMessage('Cart confirmed and products rented!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error confirming cart:', error);
      setSnackbarMessage('Failed to confirm cart');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Close the snackbar
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ margin: '30px' }}>
      <Typography variant="h4" sx={{ paddingBottom: '20px', textAlign: 'center', fontWeight: 'bold' }}>
        Your Cart
      </Typography>

      {cartItems.length === 0 ? (
        <Typography variant="h6" sx={{ margin: '30px', textAlign: 'center', color: '#666' }}>
          Your cart is empty.
        </Typography>
      ) : (
        <Grid container spacing={2} justifyContent="center">
          {cartItems.map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.product_id}> {/* Adjusted to md={3} for smaller size */}
              <Card
                sx={{
                  borderRadius: '10px',
                  boxShadow: 2,
                  height: '250px', // Reduced fixed height for all cards
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.03)' },
                }}
              >
                <CardMedia
                  component="img"
                  height="80" // Reduced height for images
                  image={item.image_url || 'https://i.imgur.com/NDhQep7.png'}
                  alt={item.product_name}
                  sx={{ objectFit: 'contain', width: '100%', padding: '5px' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" align="center" sx={{ fontWeight: 'bold' }}>
                    {item.product_name}
                  </Typography>
                  <Typography variant="body1" align="center" sx={{ color: '#888' }}>
                    Price: ${item.product_price}
                  </Typography>
                  <Typography variant="body2" align="center" sx={{ color: '#888' }}>
                    Quantity: {item.quantity}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center' }}>
                  <IconButton
                    aria-label="remove from cart"
                    color="error"
                    onClick={() => handleRemoveFromCart(item.product_id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}

          {cartItems.length > 0 && (
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ padding: '10px 30px', borderRadius: '30px', fontWeight: 'bold', marginTop: '20px' }}
                onClick={handleConfirmCart}
              >
                Confirm and Rent
              </Button>
            </Grid>
          )}
        </Grid>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CartPage;
