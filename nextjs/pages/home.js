import React from 'react';
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
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

const HomePage = () => {
  const [openCategories, setOpenCategories] = React.useState({
    'Designer Handbags': false,
    'Luxury Watches': false,
    'High-End Fashion': false,
    'Premium Footwear': false,
    'Sunglasses & Eyewear': false,
  });

  const handleToggleCategory = (category) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <Grid container>
      {/* Sidebar */}
      <Grid item xs={12} md={3} sx={{ padding: '20px' }}>
        <Box sx={{ position: 'sticky', top: '90px', borderRight: '1px solid #ddd', paddingRight: '20px' }}>
          <Box
            sx={{
              paddingBottom: '20px',
              display: 'flex',
              justifyContent: 'center',
            }}>
          </Box>

          {/* Categories */}
          <Typography variant="h6" sx={{ fontWeight: 'bold', paddingBottom: '10px' }}>
            Categories
          </Typography>
          <List>
            {Object.keys(openCategories).map((category) => (
              <React.Fragment key={category}>
                <ListItem button onClick={() => handleToggleCategory(category)}>
                  <ListItemText primary={category} />
                  {openCategories[category] ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={openCategories[category]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItem>
                      <ListItemText inset primary={`All ${category}`} />
                    </ListItem>
                  </List>
                </Collapse>
              </React.Fragment>
            ))}
          </List>

          {/* Price Range */}
          <Typography variant="h6" sx={{ fontWeight: 'bold', paddingTop: '20px' }}>
            Price Range
          </Typography>
          <List>
            {['$100.00 - $499.00', '$500.00 - $999.00', '$1000.00 - $1499.00', '$1500.00 - $2000.00'].map(
              (range) => (
                <ListItem key={range}>
                  <FormControlLabel
                    control={<Checkbox defaultChecked={range === '$100.00 - $499.00'} />}
                    label={range}
                  />
                </ListItem>
              )
            )}
          </List>
        </Box>
      </Grid>

      {/* Main content area */}
      <Grid item xs={12} md={9} sx={{ padding: '20px' }}>
        {/* Search bar */}
        <Box sx={{ display: 'flex', justifyContent: 'center', paddingBottom: '20px' }}>
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Search An Item"
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

        {/* Title */}
        <Typography variant="h4" sx={{ fontWeight: 'bold', paddingBottom: '20px' }}>
          Our Collection Of Products
        </Typography>

        {/* Products */}
        <Grid container spacing={3}>
          {/* Product Card 1 */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ borderRadius: '10px' }}>
              <CardMedia
                component="img"
                height="200"
                image="/p1.png" // Change to your image path
                alt="Louis Vuitton Bag"
                sx={{ objectFit: 'contain', padding: '10px' }}
              />
              <CardContent>
                <Typography variant="h6" align="center">
                  Louis Vuitton Monogram Bag
                </Typography>
                <Typography variant="body2" align="center" sx={{ color: '#888' }}>
                  $200.00 Per Day
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton aria-label="add to cart" sx={{ margin: 'auto' }}>
                  <AddIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>

          {/* Product Card 2 */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ borderRadius: '10px' }}>
              <CardMedia
                component="img"
                height="200"
                image="/p2.png" // Change to your image path
                alt="Rolex Watch"
                sx={{ objectFit: 'contain', padding: '10px' }}
              />
              <CardContent>
                <Typography variant="h6" align="center">
                  Rolex Watch
                </Typography>
                <Typography variant="body2" align="center" sx={{ color: '#888' }}>
                  $400.00 Per Day
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton aria-label="add to cart" sx={{ margin: 'auto' }}>
                  <AddIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>

          {/* Product Card 3 */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ borderRadius: '10px' }}>
              <CardMedia
                component="img"
                height="200"
                image="/p3.png" // Change to your image path
                alt="Cartier Ring"
                sx={{ objectFit: 'contain', padding: '10px' }}
              />
              <CardContent>
                <Typography variant="h6" align="center">
                  Cartier Ring
                </Typography>
                <Typography variant="body2" align="center" sx={{ color: '#888' }}>
                  $500.00 Per Day
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton aria-label="add to cart" sx={{ margin: 'auto' }}>
                  <AddIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>

          {/* Add more product cards as needed */}
          {/* Product Card 3 */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ borderRadius: '10px' }}>
              <CardMedia
                component="img"
                height="200"
                image="/p4.png" // Change to your image path
                alt="Cartier Ring"
                sx={{ objectFit: 'contain', padding: '10px' }}
              />
              <CardContent>
                <Typography variant="h6" align="center">
                  Cartier Ring
                </Typography>
                <Typography variant="body2" align="center" sx={{ color: '#888' }}>
                  $500.00 Per Day
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton aria-label="add to cart" sx={{ margin: 'auto' }}>
                  <AddIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
          {/* Product Card 3 */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ borderRadius: '10px' }}>
              <CardMedia
                component="img"
                height="200"
                image="/p5.png" // Change to your image path
                alt="Cartier Ring"
                sx={{ objectFit: 'contain', padding: '10px' }}
              />
              <CardContent>
                <Typography variant="h6" align="center">
                  Cartier Ring
                </Typography>
                <Typography variant="body2" align="center" sx={{ color: '#888' }}>
                  $500.00 Per Day
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton aria-label="add to cart" sx={{ margin: 'auto' }}>
                  <AddIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
          {/* Product Card 3 */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ borderRadius: '10px' }}>
              <CardMedia
                component="img"
                height="200"
                image="/p6.png" // Change to your image path
                alt="Cartier Ring"
                sx={{ objectFit: 'contain', padding: '10px' }}
              />
              <CardContent>
                <Typography variant="h6" align="center">
                  Cartier Ring
                </Typography>
                <Typography variant="body2" align="center" sx={{ color: '#888' }}>
                  $500.00 Per Day
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton aria-label="add to cart" sx={{ margin: 'auto' }}>
                  <AddIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>

        </Grid>
      </Grid>
    </Grid>
  );
};

export default HomePage;
