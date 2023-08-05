import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Grid, Box, Icon, CircularProgress } from '@mui/material';
import { AccountCircle, ShoppingBasket, AttachMoney } from '@mui/icons-material';
import axios from 'axios';
import globalConfig from '../../../config';

const AdminDashboard = () => {
  const [totalAccountsSold, setTotalAccountsSold] = useState(0);
  const [totalAccountsInStock, setTotalAccountsInStock] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const accountJson = sessionStorage.getItem('account');
  let account = JSON.parse(accountJson);

  useEffect(() => {
    // Fetch sales data from API
    if (account) {
      if (account.role !== 3 && account.role !== 2) window.location.href = '/';
    } else {
      window.location.href = '/login';
    }
    axios
      .post(`${globalConfig.apiUrl}/auth/sales-summary/${account.id}`)
      .then((response) => {
        // Update state with data from API response
        setTotalAccountsSold(response.data.totalAccountsSold);
        setTotalAccountsInStock(response.data.totalAccountsInStock);
        setTotalRevenue(response.data.totalRevenue);
        setIsLoading(false); // Set isLoading to false after data is fetched
      })
      .catch((error) => {
        console.error('Error fetching sales data:', error);
        setIsLoading(false); // Set isLoading to false if there's an error
      });
  }, []);
  const formatAmount = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  return (
    <Container className="container" component="main" maxWidth="md">
      <Paper elevation={3} sx={{ padding: '16px', marginBottom: '16px' }}>
        <Grid container direction="column" alignItems="center">
          <Typography variant="h5" gutterBottom>
            ADMIN DASHBOARD
          </Typography>
          {isLoading ? (
            <CircularProgress /> // Display the spinner when isLoading is true
          ) : (
            <>
              <Box display="flex" alignItems="center" mb={2} sx={{ border: '1px solid #ccc', borderRadius: 4, padding: '8px' }}>
                <Icon component={AccountCircle} fontSize="large" sx={{ mr: 1 }} />
                <Typography variant="body1" gutterBottom>
                  Số tài khoản đã bán: {totalAccountsSold}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={2} sx={{ border: '1px solid #ccc', borderRadius: 4, padding: '8px' }}>
                <Icon component={ShoppingBasket} fontSize="large" sx={{ mr: 1 }} />
                <Typography variant="body1" gutterBottom>
                  Số tài khoản đang bán: {totalAccountsInStock}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" sx={{ border: '1px solid #ccc', borderRadius: 4, padding: '8px' }}>
                <Icon component={AttachMoney} fontSize="large" sx={{ mr: 1 }} />
                <Typography variant="body1" gutterBottom>
                  Doanh thu: {formatAmount(totalRevenue)} VND
                </Typography>
              </Box>
            </>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default AdminDashboard;
