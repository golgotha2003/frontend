import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Grid, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Link } from 'react-router-dom';

const UserProfile = () => {
  const [account, setAccount] = useState(null);
  const accountJson = sessionStorage.getItem('account');
  let userAccount = JSON.parse(accountJson);

  useEffect(() => {
    if (userAccount === null) {
      window.location.href = '/login';
    }
  }, [account]);

  useEffect(() => {
    
    setAccount(userAccount);
  }, []);

  // Function to handle password change
  const handleChangePassword = () => {
    // Add your logic for password change here
    // For example, you can redirect to a password change page or show a dialog
    console.log('Password change clicked!');
  };

  const formatAmount = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  return (
    <Container className="container" component="main" maxWidth="md">
      <Paper elevation={3} sx={{ padding: '16px', marginBottom: '16px' }}>
        <Grid container direction="column" alignItems="center">
          <Typography variant="h5" gutterBottom>
            THÔNG TIN TÀI KHOẢN
          </Typography>
          {account ? (
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Tài khoản</TableCell>
                    <TableCell>{account.username}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Email</TableCell>
                    <TableCell>{account.email}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Số dư</TableCell>
                    <TableCell>{formatAmount(account.balance)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1">Loading user profile...</Typography>
          )}
          <Button variant="contained" color="primary" component={Link} to="/user/doi-mat-khau">
            Đổi mật khẩu
          </Button>
        </Grid>
      </Paper>
    </Container>
  );
};

export default UserProfile;
