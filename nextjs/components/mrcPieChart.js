import React, { useEffect, useState } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Box, CircularProgress, Alert } from '@mui/material';

const MrcPieChart = () => {
  const [categoriesData, setCategoriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/sales/most-rented-categories');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Transform the data into the format required by the PieChart
        const transformedData = data.categories.map((category, index) => ({
          id: index, // or use a unique identifier if available
          value: category.rental_count,
          label: category.category_name,
        }));

        setCategoriesData(transformedData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Box sx={{ padding: '20px' }}>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height={300}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Box sx={{ marginLeft: '-120px' }}> {/* Add margin left here */}
          <PieChart
            series={[{ data: categoriesData }]} // Use transformed data
            width={650}
            height={200} // Adjust height as needed
          />
        </Box>
      )}
    </Box>
  );
};

export default MrcPieChart;
