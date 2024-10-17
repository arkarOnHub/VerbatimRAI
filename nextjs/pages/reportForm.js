// import { useState } from 'react';
// import { Button, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

// function ReportForm({ onSubmit }) {
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [reportType, setReportType] = useState('total-sales');
//   const [fileFormat, setFileFormat] = useState('csv');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit({ startDate, endDate, reportType, fileFormat });
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       {/* Start Date */}
//       <TextField
//         label="Start Date"
//         type="date"
//         value={startDate}
//         onChange={(e) => setStartDate(e.target.value)}
//         InputLabelProps={{
//           shrink: true,
//         }}
//         fullWidth
//         margin="normal"
//       />

//       {/* End Date */}
//       <TextField
//         label="End Date"
//         type="date"
//         value={endDate}
//         onChange={(e) => setEndDate(e.target.value)}
//         InputLabelProps={{
//           shrink: true,
//         }}
//         fullWidth
//         margin="normal"
//       />

//       {/* Report Type Selection */}
//       <FormControl fullWidth margin="normal">
//         <InputLabel>Report Type</InputLabel>
//         <Select
//           value={reportType}
//           onChange={(e) => setReportType(e.target.value)}
//         >
//           <MenuItem value="total-sales">Total Sales</MenuItem>
//           <MenuItem value="sales-by-product">Sales by Product</MenuItem>
//           <MenuItem value="sales-by-category">Sales by Category</MenuItem>
//           <MenuItem value="user-sales">User Sales</MenuItem>
//         </Select>
//       </FormControl>

//       {/* File Format Selection */}
//       <FormControl fullWidth margin="normal">
//         <InputLabel>File Format</InputLabel>
//         <Select
//           value={fileFormat}
//           onChange={(e) => setFileFormat(e.target.value)}
//         >
//           <MenuItem value="csv">CSV</MenuItem>
//           <MenuItem value="pdf">PDF</MenuItem>
//         </Select>
//       </FormControl>

//       {/* Submit Button */}
//       <Button type="submit" variant="contained" color="primary">
//         Generate Report
//       </Button>
//     </form>
//   );
// }

// export default ReportForm;
