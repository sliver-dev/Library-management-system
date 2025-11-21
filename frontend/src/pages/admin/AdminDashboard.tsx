import React from 'react';
import { Box, Typography, Container, Paper, Grid } from '@mui/material';

const AdminDashboard: React.FC = () => {
  return (
    <Container maxWidth="xl">
      <Box py={4}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Admin Dashboard
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Total Books</Typography>
              <Typography variant="h4">1,234</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Active Users</Typography>
              <Typography variant="h4">567</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Books Borrowed</Typography>
              <Typography variant="h4">89</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Overdue Books</Typography>
              <Typography variant="h4">12</Typography>
            </Paper>
          </Grid>
        </Grid>

        <Box mt={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Admin Management Features
            </Typography>
            <Typography variant="body2" color="textSecondary">
              • Book Management (Add, Edit, Delete books)
              • User Management (Add, Edit, Ban users)
              • Analytics and Reports
              • System Settings
              • Transaction History
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default AdminDashboard;