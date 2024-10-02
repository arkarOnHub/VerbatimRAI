import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Typography, CircularProgress, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import Sidebar from '../components/sidebar';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Fetch users from the backend API using Axios
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users');
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit to add a new user
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      // Send data to your specific create user endpoint
      const response = await axios.post('/api/users/create', {
        username: formData.username,
        email: formData.email,
        password_hash: formData.password,  // Password is hashed server-side
      });
      
      setUsers([...users, response.data]);  // Add new user to the list
      setFormData({ username: '', email: '', password: '' });  // Reset form
      setFormLoading(false);
    } catch (err) {
      console.error('Error adding user:', err);
      setError('Failed to add user');
      setFormLoading(false);
    }
  };

  // Handle opening the delete confirmation dialog
  const handleOpenDialog = (userId) => {
    setSelectedUserId(userId);
    setOpenDialog(true);
  };

  // Handle closing the delete confirmation dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUserId(null);
  };

  // Handle deleting a user
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/users/${selectedUserId}`);
      setUsers(users.filter(user => user.user_id !== selectedUserId));
      handleCloseDialog();
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user');
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, padding: '20px', marginLeft: '230px' }}>
        <Typography variant="h4" sx={{ marginBottom: '20px' }}>Users</Typography>

        {/* Form to Add User */}
        <Box component="form" onSubmit={handleSubmit} sx={{ marginBottom: '20px' }}>
          <Box sx={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
            <TextField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              fullWidth
            />
          </Box>
          <Button type="submit" variant="contained" color="primary" disabled={formLoading}>
            {formLoading ? 'Adding...' : 'Add User'}
          </Button>
        </Box>

        {/* Display loading spinner or error message */}
        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}

        {/* Display users in a table */}
        {!loading && !error && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User ID</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.user_id}>
                    <TableCell>{user.user_id}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleOpenDialog(user.user_id)}
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

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
        >
          <DialogTitle>Delete User</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="secondary" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
