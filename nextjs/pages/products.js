import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Typography, List, ListItem, ListItemText, CircularProgress
} from '@mui/material';
import Sidebar from '@/components/Sidebar';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from the backend API using Axios
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products'); // Axios GET request to the API
        setProducts(response.data); // Save fetched products to state
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <Box sx={{ flexGrow: 1, padding: '20px', marginLeft: '180px' }}>
        <Typography variant="h4" sx={{ marginBottom: '20px' }}>Products</Typography>

        {/* Display loading spinner or error message */}
        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}

        {/* Display products */}
        {!loading && !error && (
          <List>
            {products.map((product) => (
              <ListItem key={product.product_id}>
                <ListItemText
                  primary={product.product_name}
                  secondary={`Quantity: ${product.product_quantity}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
}
