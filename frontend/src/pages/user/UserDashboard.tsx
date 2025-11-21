import React from 'react';
import { Box, Typography, Container, Paper, Grid } from '@mui/material';

const UserDashboard: React.FC = () => {
  return (
    <Container maxWidth="xl">
      <Box py={4}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          User Dashboard
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Books Borrowed</Typography>
              <Typography variant="h4">3</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Books Reserved</Typography>
              <Typography variant="h4">2</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Fines Due</Typography>
              <Typography variant="h4">$5.50</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Books Read</Typography>
              <Typography variant="h4">47</Typography>
            </Paper>
          </Grid>
        </Grid>

        <Box mt={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              User Features
            </Typography>
            <Typography variant="body2" color="textSecondary">
              • Search and Browse Catalog
              • Borrow and Return Books
              • Reserve Books
              • View Personal Recommendations
              • Track Reading History
              • Manage Profile
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default UserDashboard;