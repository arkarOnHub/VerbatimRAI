// pages/index.js

import { Box, Button, Typography, Grid } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: '95vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      {/* Main Section */}
      <Grid
        container
        spacing={4}
        sx={{
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Grid item xs={12} md={6}>
          {/* Image Section */}
          <Image
            src="/logo.png"
            alt="Luxury Rental"
            width={500}
            height={500}
            style={{ borderRadius: '10px' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          {/* Text Section */}
          <Typography variant="h3" gutterBottom>
            Welcome to Luxury Rentals
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            Discover and rent the finest luxury items with ease. Whether it's fashion, accessories, or gadgets,
            we’ve got you covered.
          </Typography>

          {/* Buttons */}
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => router.push('/login')}
            sx={{ mr: 2, mb: 2, width: '150px' }}
          >
            Login
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            onClick={() => router.push('/signup')}
            sx={{ mr: 2, mb: 2, width: '150px' }}
          >
            Signup
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
