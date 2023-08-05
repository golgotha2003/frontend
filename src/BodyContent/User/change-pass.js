import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Grid, TextField, Button, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';
import globalConfig from '../../config';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add isLoading state
  const accountJson = sessionStorage.getItem('account');
  let userAccount = JSON.parse(accountJson);

  useEffect(() => {
    if (userAccount === null) {
      window.location.href = '/login';
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Add your logic for password change here
    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu mới không khớp');
    } else {
      try {
        setError('');
        setIsLoading(true); // Set isLoading to true when API request starts

        // Replace 'YOUR_API_ENDPOINT' with the actual API endpoint for changing the password
        const apiUrl = `${globalConfig.apiUrl}/auth/changepass`;

        // Prepare the data to be sent to the API
        const requestData = {
          id: userAccount.id,
          currentPassword: currentPassword,
          newPassword: newPassword,
        };

        // Make the API request using axios
        const response = await axios.post(apiUrl, requestData);

        // Handle the API response and show a success message to the user
        if (response.data.success) {
          toast.success('Đổi mật khẩu thành công');
          // Optionally, you can redirect the user to another page or perform other actions here
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        // Handle any errors that occurred during the API request
        console.error('Error changing password:', error);
        toast.error('Đổi mật khẩu thất bại');
      } finally {
        setIsLoading(false); // Set isLoading back to false after the API request is completed
      }
    }
  };

  return (
    <Container className="container" component="main" maxWidth="md">
      <Paper elevation={3} sx={{ padding: '16px', marginBottom: '16px' }}>
        <Grid container direction="column" alignItems="center">
          <Typography variant="h5" gutterBottom>
            ĐỔI MẬT KHẨU
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  type="password"
                  label="Mật khẩu hiện tại"
                  variant="outlined"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  type="password"
                  label="Mật khẩu mới"
                  variant="outlined"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  type="password"
                  label="Xác nhận mật khẩu mới"
                  variant="outlined"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Grid>
              {error && (
                <Grid item xs={12}>
                  <Typography color="error" variant="body1">
                    {error}
                  </Typography>
                </Grid>
              )}
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Đổi mật khẩu'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ChangePassword;
