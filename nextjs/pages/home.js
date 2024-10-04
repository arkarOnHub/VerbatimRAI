import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Grid,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Collapse,
  FormControlLabel,
  Checkbox,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

const HomePage = () => {
  const [openCategories, setOpenCategories] = useState({
    'Designer Handbags': false,
    'Luxury Watches': false,
    'High-End Jewelries': false,
    'Premium Footwear': false,
    'Sunglasses & Eyewear': false,
  });

  const [products, setProducts] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Mock user ID, replace with your actual user ID logic
  const userId = 10; // Replace with the actual user ID from your authentication

  const categoryIdMapping = {
    'Designer Handbags': 1,
    'Luxury Watches': 2,
    'High-End Jewelries': 3,
    'Premium Footwear': 4,
    'Sunglasses & Eyewear': 5,
  };

  // Fetch all products when the page loads
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  // Fetch products by category when a category is opened
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      for (const category of Object.keys(openCategories)) {
        if (openCategories[category] && !productsByCategory[category]) {
          try {
            const categoryId = categoryIdMapping[category];
            const response = await axios.get(`/api/products/categories/id/${categoryId}`);
            setProductsByCategory((prev) => ({
              ...prev,
              [category]: response.data,
            }));
          } catch (error) {
            console.error(`Error fetching products for category ${category}:`, error);
          }
        }
      }
    };
    fetchCategoryProducts();
  }, [openCategories]);

  // Handle checkbox changes for category selection
  const handleCheckboxChange = (categoryId) => {
    setSelectedCategories((prev) => {
      const newSelectedCategories = new Set(prev);
      if (newSelectedCategories.has(categoryId)) {
        newSelectedCategories.delete(categoryId);
      } else {
        newSelectedCategories.add(categoryId);
      }
      return newSelectedCategories;
    });
  };

  // Handle toggling category expansion
  const handleToggleCategory = (category) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter products based on selected categories and search term
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategories.size === 0 || selectedCategories.has(product.pro_category_id); // Check against pro_category_id
    const matchesSearchTerm =
      product.product_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearchTerm;
  });

  // Function to add a product to the cart
  const handleAddToCart = async (productId) => {
    try {
      const response = await axios.post('/api/rent/create', {
        user_id: userId,  // Replace with the actual user ID
        product_id: productId,
        rental_date: new Date().toISOString(), // You can set this to the current date or a specific date
      });
      console.log('Product added to cart:', response.data);
  
      // Update the product quantity in the local state
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.product_id === productId
            ? { ...product, product_quantity: product.product_quantity - 1 } // Decrement the quantity by 1
            : product
        )
      );
  
      setSnackbarMessage('Product added to cart successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error adding product to cart:', error);
      setSnackbarMessage('Failed to add product to cart.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Close Snackbar function
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Grid container>
      {/* Sidebar */}
      <Grid item xs={12} md={3} sx={{ padding: '20px' }}>
        <Box sx={{ position: 'sticky', top: '90px', borderRight: '1px solid #ddd', paddingRight: '20px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', paddingBottom: '20px' }}>
            <TextField
              variant="outlined"
              fullWidth
              placeholder="Search An Item"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ maxWidth: '600px' }}
            />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', paddingBottom: '10px' }}>
            Categories
          </Typography>
          <List>
            {Object.keys(openCategories).map((category) => (
              <React.Fragment key={category}>
                <ListItem button onClick={() => handleToggleCategory(category)}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedCategories.has(categoryIdMapping[category])} // Check against pro_category_id
                        onChange={() => handleCheckboxChange(categoryIdMapping[category])} // Use category ID
                      />
                    }
                    label={category}
                  />
                  {openCategories[category] ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={openCategories[category]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {/* Display products under the expanded category */}
                    {productsByCategory[category]?.map((product) => (
                      <ListItem key={product.product_id} sx={{ pl: 4 }}>
                        <Grid container spacing={2} alignItems="left">
                          <ListItemText primary={product.product_name} />
                        </Grid>
                        <Grid container spacing={2} alignItems="right">
                          <ListItemText secondary={product.product_quantity} />
                        </Grid>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Grid>

      {/* Main content area */}
      <Grid item xs={12} md={9} sx={{ padding: '20px' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', paddingBottom: '20px' }}>
          Our Collection Of Products
        </Typography>
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.product_id}>
              <Card sx={{ borderRadius: '10px' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image_url || 'https://i.imgur.com/NDhQep7.png'}
                  alt={product.product_name}
                  sx={{ objectFit: 'contain', padding: '10px' }}
                />
                <CardContent>
                  <Typography variant="h6" align="center">
                    {product.product_name}
                  </Typography>
                  <Typography variant="body2" align="center" sx={{ color: '#888' }}>
                    Available: {product.product_quantity}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton
                    aria-label="add to cart"
                    sx={{ margin: 'auto' }}
                    onClick={() => handleAddToCart(product.product_id)} // Call the add to cart function
                  >
                    <AddIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>

      {/* Snackbar for success/error messages */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default HomePage;
