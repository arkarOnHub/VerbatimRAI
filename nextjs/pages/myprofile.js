import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Snackbar,
  Alert,  // Import Alert for Snackbar
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import StyleIcon from '@mui/icons-material/Style';
import BrandIcon from '@mui/icons-material/LocalOffer';


// Reusable SummaryCard component
const SummaryCard = ({ icon, value, label, bgColor, iconColor }) => (
  <Card sx={{ backgroundColor: bgColor, textAlign: 'center', padding: 2, borderRadius: '16px' }}>
    <CardContent>
      {icon}
      <Typography variant="h5" sx={{ color: iconColor }}>
        {value}
      </Typography>
      <Typography variant="body2">{label}</Typography>
    </CardContent>
  </Card>
);

export default function MyProfile() {
  const [username, setUsername] = useState('');
  const [totalOrdersById, setTotalOrdersById] = useState(0);
  const [totalSalesById, setTotalSalesById] = useState(0);
  const [mostRentedProductById, setMostRentedProductById] = useState('');
  const [mostRentedCategoryById, setMostRentedCategoryById] = useState('');
  const [currentOrders, setCurrentOrders] = useState([]);
  const [rentedProducts, setRentedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserID] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar visibility state
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Snackbar message

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }

    const storedUserId = localStorage.getItem('user_id');

    const fetchTotalSalesById = async () => {
      try {
        const response = await fetch(`/api/sales/total/${storedUserId}`);
        const data = await response.json();
        setTotalSalesById(data.total_sales);
      } catch (error) {
        console.error('Error fetching total sales:', error);
      }
    };

    const fetchTotalOrdersById = async () => {
      try {
        const response = await fetch(`/api/sales/count/${storedUserId}`);
        const data = await response.json();
        setTotalOrdersById(data.count);
      } catch (error) {
        console.error('Error fetching total orders:', error);
      }
    };

    const fetchMostRentedProductById = async () => {
      try {
        const response = await fetch(`/api/sales/most-rented-product/${storedUserId}`);
        const data = await response.json();
        setMostRentedProductById(data);
      } catch (error) {
        console.error('Error fetching most rented product:', error);
      }
    };

    const fetchMostRentedCategoryById = async () => {
      try {
        const response = await fetch(`/api/sales/most-rented-category/${storedUserId}`);
        const data = await response.json();
        setMostRentedCategoryById(data);
      } catch (error) {
        console.error('Error fetching most rented category:', error);
      }
    };

    const fetchCurrentOrders = async () => {
      try {
        const response = await fetch(`/api/rent/current/${storedUserId}`); // Adjust the API endpoint as needed
        const data = await response.json();
        setCurrentOrders(data);
      } catch (error) {
        console.error('Error fetching current orders:', error);
      }
    };

    fetchTotalSalesById();
    fetchTotalOrdersById();
    fetchMostRentedProductById();
    fetchMostRentedCategoryById();
    fetchCurrentOrders(); // Fetch current orders
  }, []);
  // Fetch currently rented products from backend API using Axios
  useEffect(() => {
    const fetchRentedProducts = async () => {
      try {
        const response = await axios.get(`/api/rent/current`);
        console.log('Response:', response.data);  // Log response
        setRentedProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching rented products:', err.response || err.message);  // Log detailed error
        setError('Failed to load rented products');
        setLoading(false);
      }
    };

    fetchRentedProducts();
  }, [userId]);

  // Function to handle product return
  const handleReturn = async (rentId, productId) => {
    try {
      // Call the return API
      await axios.post(`/api/rent/return`, {
        rent_id: rentId,
        product_id: productId,
      });

      // Update the state after return
      setRentedProducts(rentedProducts.filter(item => item.rent_id !== rentId));

      // Show success message
      setSnackbarMessage('Product returned successfully!');
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Error returning product:', err);
      setSnackbarMessage('Failed to return the product');
      setSnackbarOpen(true);
    }
  };

  // Function to handle Snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ padding: '20px' }}>
    {/* Header */}
    <Typography variant="h4" gutterBottom>
        Welcome, {username ? username : 'Guest'}
      </Typography>

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            icon={<CheckCircleIcon sx={{ fontSize: 40, color: '#ff5252' }} />}
            value={totalOrdersById}
            label="Total Orders"
            bgColor="#ffe4e4"
            iconColor="#ff5252"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            icon={<LocalMallIcon sx={{ fontSize: 40, color: '#ffca28' }} />}
            value={`$${totalSalesById}`}
            label="Total Spend"
            bgColor="#fff1cf"
            iconColor="#ffca28"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            icon={<StyleIcon sx={{ fontSize: 40, color: '#4caf50' }} />}
            value={mostRentedCategoryById}
            label="Most Rented Category"
            bgColor="#e8f8ef"
            iconColor="#4caf50"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            icon={<BrandIcon sx={{ fontSize: 40, color: '#ba68c8' }} />}
            value={mostRentedProductById}
            label="Most Rented Product"
            bgColor="#f2e8ff"
            iconColor="#ba68c8"
          />
        </Grid>
      </Grid>
      <Typography variant="h4" sx={{ marginBottom: '20px' }}>Current Rented Products</Typography>

      {/* Display loading spinner or error message */}
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      {/* Display rented products in a table */}
      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User ID</TableCell>
                <TableCell>Product ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rentedProducts.map((rental) => (
                <TableRow key={rental.rent_id}> {/* Use rent_id as the key */}
                  <TableCell>{rental.user_id}</TableCell>
                  <TableCell>{rental.product_id}</TableCell>
                  <TableCell>{rental.product_name}</TableCell>
                  <TableCell>{rental.category_name}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleReturn(rental.rent_id, rental.product_id)} // Call handleReturn on click
                    >
                      Return
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Snackbar for return messages */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
