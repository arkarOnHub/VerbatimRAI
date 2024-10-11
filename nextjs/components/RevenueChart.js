import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';

const RevenueChart = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/sales/daily-revenue?start_date=2024-10-07&end_date=2024-10-11`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setRevenueData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Parse date data as JavaScript Date objects
  const xData = revenueData.length > 0
    ? revenueData.map(item => new Date(item.sale_date)) // Use Date objects directly
    : [];

  const yData = revenueData.length > 0
    ? revenueData.map(item => item.daily_revenue)
    : [];

  return (
    <Paper sx={{ padding: '20px' }}>
      <Typography variant="h6" sx={{ marginBottom: '20px' }}>
        Total Revenue Over Time
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height={300}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        xData.length > 0 && yData.length > 0 && !yData.some(isNaN) ? (
          <Box>
            <LineChart
              xAxis={[{ 
                data: xData,
                scaleType: 'time', // Ensure the x-axis uses time scaling
                label: 'Date',
                valueFormatter: (timestamp) => new Date(timestamp).toLocaleDateString(), // Format for readability
              }]}
              series={[{
                data: yData,
                label: 'Daily Revenue ($)',
              }]}
              width={600} // Ensure enough width for the chart
              height={500}
              xAxisType="time"
            />
          </Box>
        ) : (
          <Alert severity="info">No revenue data available.</Alert>
        )
      )}
    </Paper>
  );
};

export default RevenueChart;
