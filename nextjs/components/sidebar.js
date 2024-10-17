import React, { useEffect, useState } from 'react';
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
  const [userId, setUserId] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Mark component as mounted
    setIsMounted(true);

    // Fetch user_id from localStorage or API after mounting
    const storedUserId = localStorage.getItem('user_id');
    if (storedUserId) {
      setUserId(parseInt(storedUserId, 10));
    }
  }, []);

  // If not mounted, render nothing (or a simple loading state to avoid hydration errors)
  if (!isMounted) {
    return null; 
  }

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
        {/* Dashboard is visible to all users */}
        <ListItem button>
          <DashboardIcon sx={{ marginRight: '10px' }} />
          <Link href="/dashboard" passHref>
            <ListItemText 
              primary="Dashboard" 
              sx={{
                textDecoration: 'none',
                color: 'black',
                '&:hover': { color: 'primary.main' },
              }}
            />
          </Link>
        </ListItem>

        {/* Admin-only links (only visible if user_id is 10) */}
        {userId === 10 && (
          <>
            <ListItem button>
              <PeopleIcon sx={{ marginRight: '10px' }} />
              <Link href="/users" passHref>
                <ListItemText 
                  primary="Users" 
                  sx={{
                    textDecoration: 'none',
                    color: 'black',
                    '&:hover': { color: 'primary.main' },
                  }}
                />
              </Link>
            </ListItem>

            <ListItem button>
              <ShoppingCartIcon sx={{ marginRight: '10px' }} />
              <Link href="/orders" passHref>
                <ListItemText 
                  primary="Orders" 
                  sx={{
                    textDecoration: 'none',
                    color: 'black',
                    '&:hover': { color: 'primary.main' },
                  }}
                />
              </Link>
            </ListItem>

            <ListItem button>
              <InventoryIcon sx={{ marginRight: '10px' }} />
              <Link href="/products" passHref>
                <ListItemText 
                  primary="Products" 
                  sx={{
                    textDecoration: 'none',
                    color: 'black',
                    '&:hover': { color: 'primary.main' },
                  }}
                />
              </Link>
            </ListItem>

            <ListItem button>
              <BarChartIcon sx={{ marginRight: '10px' }} />
              <Link href="/salesReport" passHref>
                <ListItemText 
                  primary="Sales Report" 
                  sx={{
                    textDecoration: 'none',
                    color: 'black',
                    '&:hover': { color: 'primary.main' },
                  }}
                />
              </Link>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );
}
