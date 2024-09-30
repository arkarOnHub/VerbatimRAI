import React from 'react';
import {
  Box, Typography, List, ListItem, ListItemText
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import BarChartIcon from '@mui/icons-material/BarChart';
import Link from 'next/link';

export default function Sidebar() {
  return (
    <Box
      sx={{
        width: 180,
        backgroundColor: '#f4f5f7',
        height: '100vh', // Ensure full height
        padding: '20px',
        position: 'fixed', // Make the sidebar fixed
        top: 0, // Stick it to the top
        left: 0,
        overflowY: 'auto', // Allow scrolling inside the sidebar if needed
      }}
    >
      <Typography variant="h6" sx={{ marginBottom: '20px' }}>Admin Dashboard</Typography>
      <List>
        <ListItem button>
          <DashboardIcon sx={{ marginRight: '10px' }} />
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button>
          <PeopleIcon sx={{ marginRight: '10px' }} />
          <Link href="/users" passHref><ListItemText primary="Users" /></Link>
        </ListItem>
        <ListItem button>
          <ShoppingCartIcon sx={{ marginRight: '10px' }} />
          <Link href="/orders" passHref><ListItemText primary="Orders" /></Link>
        </ListItem>
        <ListItem button>
          <InventoryIcon sx={{ marginRight: '10px' }} />
          <Link href="/products" passHref><ListItemText primary="Products" /></Link>
        </ListItem>
        <ListItem button>
          <BarChartIcon sx={{ marginRight: '10px' }} />
          <ListItemText primary="Sales Report" />
        </ListItem>
      </List>
    </Box>
  );
}
