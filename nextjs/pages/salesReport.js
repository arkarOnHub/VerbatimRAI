import React, { useState } from 'react';
import {
  TextField, Button, MenuItem, Select, FormControl, InputLabel, Box, Card, Typography, CircularProgress,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

const SalesReport = () => {
  const [reportType, setReportType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [fileFormat, setFileFormat] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  const handleDownload = async () => {
    if (!reportType || !startDate || !endDate || !fileFormat) {
      alert('Please fill out all fields');
      return;
    }
    setLoading(true); // Set loading state to true
    const url = `/api/sales/report/download?report_type=${reportType}&start_date=${startDate}&end_date=${endDate}&file_format=${fileFormat}`;
    window.location.href = url; // Triggers the file download
    setLoading(false); // Reset loading state after download
  };

  return (
    <Box display="flex" justifyContent="center" mt={5}>
      <Card sx={{ p: 3, minWidth: 400, boxShadow: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Sales Report Generator
        </Typography>

        <FormControl fullWidth margin="normal">
          <InputLabel id="report-type-label">Report Type</InputLabel>
          <Select
            labelId="report-type-label"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <MenuItem value="total-sales">Total Sales</MenuItem>
            <MenuItem value="sales-by-product">Sales by Product</MenuItem>
            <MenuItem value="sales-by-category">Sales by Category</MenuItem>
            <MenuItem value="user-sales">User Sales</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          margin="normal"
          label="Start Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <TextField
          fullWidth
          margin="normal"
          label="End Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel id="file-format-label">File Format</InputLabel>
          <Select
            labelId="file-format-label"
            value={fileFormat}
            onChange={(e) => setFileFormat(e.target.value)}
          >
            <MenuItem value="csv">CSV</MenuItem>
            <MenuItem value="pdf">PDF</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={handleDownload}
          startIcon={<DownloadIcon />}
          sx={{ mt: 2 }}
          disabled={loading} // Disable button while loading
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Download Report'}
        </Button>
      </Card>
    </Box>
  );
};

export default SalesReport;
