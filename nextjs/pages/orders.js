import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
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
} from '@mui/material';
import Sidebar from '../components/sidebar';

export default function Orders() {
  const [rentedProducts, setRentedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserID] = useState('');

  useEffect(() => {
    // Fetch the username from local storage (or from your session management)
    const storedUserID = localStorage.getItem('user_id'); // Adjust this according to your session management method
    if (storedUserID) {
      setUserID(storedUserID);
    }
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
    } catch (err) {
      console.error('Error returning product:', err);
      alert('Failed to return the product');
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, padding: '20px', marginLeft: '230px' }}>
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
      </Box>
    </Box>
  );
}
