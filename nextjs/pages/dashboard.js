import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import Sidebar from '../components/sidebar';

// Mock data for the charts
const revenueData = {
  series: [
    { label: 'Bags and Accessories', data: [12000, 19000, 25000, 15000, 20000, 12000, 14000] },
    { label: 'Watches and Jewelries', data: [5000, 10000, 20000, 15000, 9000, 8000, 17000] },
  ],
  xAxis: { data: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], scaleType: 'band' }
};

const categoryData = {
  series: [
    { label: 'Louis Vuitton', data: [54] },
    { label: 'Dior', data: [20] },
    { label: 'Hermes', data: [26] },
  ],
  xAxis: { data: ['Louis Vuitton', 'Dior', 'Hermes'], scaleType: 'band' }
};

export default function Dashboard() {
  const [totalSales, setTotalSales] = useState(0);
  const [totalSalesCount, setTotalSalesCount] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0); // New state for total products
  const [totalUsers, setTotalUsers] = useState(0); // New state for total users
  const [totalRents, setTotalRents] = useState(0); // New state for total rents
  const [mostRentedProducts, setMostRentedProducts] = useState([]); // New state for most rented products

  useEffect(() => {
    const fetchTotalSales = async () => {
      try {
        const response = await fetch('/api/total-sales'); // Adjust the API endpoint as needed
        const data = await response.json();
        setTotalSales(data.total_sales);
      } catch (error) {
        console.error('Error fetching total sales:', error);
      }
    };

    const fetchTotalSalesCount = async () => {
      try {
        const response = await fetch('/api/sales/count'); // Adjust the API endpoint as needed
        const data = await response.json();
        setTotalSalesCount(data.count);
      } catch (error) {
        console.error('Error fetching total sales:', error);
      }
    };

    const fetchTotalCategories = async () => {
      try {
        const response = await fetch('/api/categories/count'); // Adjust the API endpoint as needed
        const data = await response.json();
        setTotalCategories(data.count);
      } catch (error) {
        console.error('Error fetching total categories:', error);
      }
    };

    const fetchTotalProducts = async () => { // New function to fetch total products
      try {
        const response = await fetch('/api/products/count'); // Adjust the API endpoint as needed
        const data = await response.json();
        setTotalProducts(data.count); // Use 'data.count' to access the count
      } catch (error) {
        console.error('Error fetching total products:', error);
      }
    };

    const fetchTotalUsers = async () => { // New function to fetch total users
      try {
        const response = await fetch('/api/users/count'); // Adjust the API endpoint as needed
        const data = await response.json();
        setTotalUsers(data.count); // Use 'data.count' to access the count
      } catch (error) {
        console.error('Error fetching total users:', error);
      }
    };

    const fetchTotalRents = async () => { // New function to fetch total rents
      try {
        const response = await fetch('/api/rents/count'); // Adjust the API endpoint as needed
        const data = await response.json();
        setTotalRents(data.count); // Use 'data.count' to access the count
      } catch (error) {
        console.error('Error fetching total rents:', error);
      }
    };

    const fetchMostRentedProducts = async () => { // New function to fetch most rented products
      try {
        const response = await fetch('/api/sales/most-rented-products'); // Adjust the API endpoint as needed
        const data = await response.json();
        setMostRentedProducts(data.products); // Assuming the API returns an array of product names
      } catch (error) {
        console.error('Error fetching most rented products:', error);
      }
    };

    fetchTotalSales(); 
    fetchTotalSalesCount(); 
    fetchTotalCategories(); 
    fetchTotalProducts(); 
    fetchTotalUsers(); 
    fetchTotalRents(); 
    fetchMostRentedProducts(); // Call the new fetch function
  }, []);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, marginLeft: '240px' }}> {/* Add left margin equal to the sidebar width */}
        {/* Sales Summary */}
        <Box sx={{ padding: '20px' }}>
          <Typography variant="h5" sx={{ marginBottom: '10px' }}>Today's Sales</Typography>
          <Typography variant="body1" sx={{ color: '#666' }}>Sales Summary</Typography>

          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ marginTop: '20px' }}>
            {/* Sales Cards */}
            {[  // Summary Cards
              { label: 'Total Sales', value: `$${totalSales}`, change: '', color: '#ff5252' },
              { label: 'Total Orders', value: totalSalesCount, change: '', color: '#ffca28' },
              { label: 'Products Rented at the current', value: totalRents, change: '', color: '#66bb6a' },
              { label: 'New Customers', value: '8', change: '', color: '#ba68c8' },
              { label: 'Total Products', value: totalProducts, color: '#ff5252' }, // Display total products here
              { label: 'Total Categories', value: totalCategories, color: '#ffca28' },
              { label: 'Total Available Products', value: (totalProducts - totalRents), color: '#66bb6a' },
              { label: 'Total Users', value: totalUsers, color: '#ba68c8' },
            ].map((card, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  sx={{
                    padding: '20px',
                    backgroundColor: card.color,
                    color: '#fff',
                    borderRadius: '10px',
                  }}
                >
                  <Typography variant="h6">{card.value}</Typography>
                  <Typography variant="body1">{card.label}</Typography>
                  {card.change && (
                    <Typography variant="body2">{card.change}</Typography>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Charts */}
          <Grid container spacing={3} sx={{ marginTop: '20px' }}>
            {/* Revenue Chart */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ padding: '20px' }}>
                <Typography variant="h6" sx={{ marginBottom: '20px' }}>Total Revenue</Typography>
                <BarChart
                  series={revenueData.series}
                  height={300}
                  xAxis={[revenueData.xAxis]}
                  margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                />
              </Paper>
            </Grid>

            {/* Most Rented Products and Categories */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ padding: '20px', marginBottom: '20px' }}>
                <Typography variant="h6" sx={{ marginBottom: '10px' }}>Most Rented Products</Typography>
                <List>
                  {mostRentedProducts.length > 0 ? (
                    mostRentedProducts.map((product, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={`${index + 1}. ${product.product_name}`} /> {/* Adjust based on your product structure */}
                      </ListItem>
                    ))
                  ) : (
                    <ListItem>
                      <ListItemText primary="No rented products available." />
                    </ListItem>
                  )}
                </List>
              </Paper>

              <Paper sx={{ padding: '20px' }}>
                <Typography variant="h6" sx={{ marginBottom: '10px' }}>Categories Overview</Typography>
                <BarChart
                  series={categoryData.series}
                  height={300}
                  xAxis={[categoryData.xAxis]}
                  margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                />
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
