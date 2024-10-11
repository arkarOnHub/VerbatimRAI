import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  CircularProgress,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Select,
  MenuItem,
} from '@mui/material';
import Sidebar from '../components/sidebar';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    productName: '',
    quantity: '',
    categoryId: '',
    productPrice: '',
    imageUrl: '',
    description: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch products and categories from backend API using Axios
  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          axios.get('/api/products'),
          axios.get('/api/categories'),
        ]);
        setProducts(productsResponse.data);
        setCategories(categoriesResponse.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products or categories:', err);
        setError('Failed to load products or categories');
        setLoading(false);
      }
    };

    fetchProductsAndCategories();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

// Handle form submit to add a new product
const handleSubmit = async (e) => {
  e.preventDefault();
  setFormLoading(true);
  setError(null); // Reset error before the request
  try {
    const response = await axios.post('/api/products/create', {
      product_name: formData.productName,
      product_quantity: parseInt(formData.quantity, 10), // Convert to integer
      pro_category_id: formData.categoryId, // Ensure this matches your FastAPI model
      product_price: formData.productPrice,
      image_url: formData.imageUrl,
      product_description: formData.description,
    });

    // Check if the response data has the expected structure
    if (response.data) {
      const newProduct = {
        ...response.data,
        category_name: categories.find(cat => cat.pro_category_id === response.data.pro_category_id)?.category_name,
      };
      
      // Add new product to the list
      setProducts([...products, newProduct]);

      // Reset form
      setFormData({
        productName: '',
        quantity: '',
        categoryId: '',
        productPrice: '',
        imageUrl: '',
        description: '',
      });
    } else {
      throw new Error("Product creation response is invalid");
    }
  } catch (err) {
    console.error('Error adding product:', err.response ? err.response.data : err.message);
    // Only set error if there's an actual error response
    if (err.response && err.response.data) {
      setError(err.response.data.detail || 'Failed to add product');
    } else {
      setError('Failed to add product');
    }
  } finally {
    setFormLoading(false);
  }
};

  // Handle opening the delete confirmation dialog
  const handleOpenDialog = (productId) => {
    setSelectedProductId(productId);
    setOpenDialog(true);
  };

  // Handle closing the delete confirmation dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProductId(null);
    setIsUpdating(false); // Reset updating state
    setFormData({ productName: '', quantity: '', categoryId: '', productPrice: '', imageUrl: '', description: '' }); // Reset form data
  };

  // Handle deleting a product
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/products/${selectedProductId}`);
      setProducts(products.filter(product => product.product_id !== selectedProductId));
      handleCloseDialog();
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product');
    }
  };

  // Handle opening the update dialog and pre-filling the form
  const handleOpenUpdateDialog = (product) => {
    setFormData({
      productName: product.product_name,
      quantity: product.product_quantity,
      categoryId: product.pro_category_id,
      productPrice: product.product_price,
      imageUrl: product.image_url,
      description: product.product_description,
    });
    setSelectedProductId(product.product_id);
    setIsUpdating(true); // Set to updating mode
    setOpenDialog(true);
  };

// Handle updating a product
const handleUpdate = async () => {
  try {
    const response = await axios.put(`/api/products/${selectedProductId}`, {
      product_name: formData.productName,
      product_quantity: parseInt(formData.quantity, 10),
      pro_category_id: formData.categoryId,
      product_price: formData.productPrice,
      image_url: formData.imageUrl,
      product_description: formData.description,
    });

    // Assuming your backend returns the updated product
    const updatedProduct = {
      ...response.data,
      category_name: categories.find(cat => cat.pro_category_id === formData.categoryId)?.category_name,
    };

    // Check if the product_id is included in the response
    if (response.data.product_id) {
      updatedProduct.product_id = response.data.product_id;
    } else {
      updatedProduct.product_id = selectedProductId; // Fallback to the selected product ID
    }

    // Update the product in the state
    setProducts(products.map(product =>
      product.product_id === selectedProductId ? updatedProduct : product
    ));
    
    handleCloseDialog();
  } catch (err) {
    console.error('Error updating product:', err.response ? err.response.data : err.message);
    setError('Failed to update product');
  }
};




  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, padding: '20px', marginLeft: '230px' }}>
        <Typography variant="h4" sx={{ marginBottom: '20px' }}>Products</Typography>

        {/* Form to Add Product */}
        <Box component="form" onSubmit={handleSubmit} sx={{ marginBottom: '20px' }}>
          <Box sx={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
            <TextField
              label="Product Name"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              select
              label="Category"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
              fullWidth
            >
              {categories.map((category) => (
                <MenuItem key={category.pro_category_id} value={category.pro_category_id}>
                  {category.category_name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Price"
              name="productPrice"
              type="number"
              value={formData.productPrice}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Image URL"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
            />
          </Box>
          <Button type="submit" variant="contained" color="primary" disabled={formLoading}>
            {formLoading ? 'Adding...' : 'Add Product'}
          </Button>
        </Box>

        {/* Display loading spinner or error message */}
        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}

        {/* Display products in a table */}
        {!loading && !error && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Image URL</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.product_id}>
                    <TableCell>{product.product_id}</TableCell>
                    <TableCell>{product.product_name}</TableCell>
                    <TableCell>{product.product_quantity}</TableCell>
                    <TableCell>{product.category_name}</TableCell>
                    <TableCell>${product.product_price}</TableCell>
                    <TableCell>{product.image_url}</TableCell>
                    <TableCell>{product.product_description}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpenUpdateDialog(product)}
                      >
                        Update
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleOpenDialog(product.product_id)}
                        sx={{ marginLeft: '10px' }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Dialog for Add/Update Product */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
        >
          <DialogTitle>{isUpdating ? 'Update Product' : 'Delete Product'}</DialogTitle>
          <DialogContent>
            {isUpdating ? (
              <>
                <DialogContentText>
                  Update the product details.
                </DialogContentText>
                <TextField
                  label="Product Name"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  fullWidth
                  sx={{ marginBottom: '10px' }}
                />
                <TextField
                  label="Quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleChange}
                  fullWidth
                  sx={{ marginBottom: '10px' }}
                />
                <TextField
                  select
                  label="Category"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  fullWidth
                  sx={{ marginBottom: '10px' }}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.pro_category_id} value={category.pro_category_id}>
                      {category.category_name}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Price"
                  name="productPrice"
                  type="number"
                  value={formData.productPrice}
                  onChange={handleChange}
                  fullWidth
                  sx={{ marginBottom: '10px' }}
                />
                <TextField
                  label="Image URL"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  fullWidth
                  sx={{ marginBottom: '10px' }}
                />
                <TextField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  fullWidth
                />
              </>
            ) : (
              <DialogContentText>
                Are you sure you want to delete this product? This action cannot be undone.
              </DialogContentText>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cancel
            </Button>
            {isUpdating ? (
              <Button onClick={handleUpdate} color="primary" autoFocus>
                Update
              </Button>
            ) : (
              <Button onClick={handleDelete} color="secondary" autoFocus>
                Delete
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
