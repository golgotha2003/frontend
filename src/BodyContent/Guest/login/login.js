import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blue } from '@mui/material/colors';
import axios from 'axios'; // Import axios for making API requests
import './login.css'; // Import file CSS vào trang
import globalConfig from '../../../config';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const theme = createTheme({
  palette: {
    primary: {
      main: blue[500],
    },
  },
});

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Sử dụng hook useNavigate

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      // Make the API call to authenticate the user
      const response = await axios.post(`${globalConfig.apiUrl}/auth/login`, {
        username: username,
        password: password,
      });

      setIsLoading(false);

      // Check if the API call was successful and the user is authenticated
      if (response.data.success) {
        const accountJson = JSON.stringify(response.data.account);
        sessionStorage.setItem('account', accountJson);
        console.log('Login successful!');
        toast.success('Login successful!', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
        });

        window.location.href = '/';
      } else {
        console.log('Login failed!');
        toast.error(response.data.message, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
        });
      }
    } catch (error) {
      setIsLoading(false);
      console.log('Login failed:', error);
      toast.error('Login failed. Please check your username and password.', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
        hideProgressBar: true,
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Login Page</Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="xs">
        <Box className="container">
          <Avatar className="avatar">
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box className="form">
            <form onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={handleUsernameChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={handlePasswordChange}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className="submitButton"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Sign In'}
              </Button>
            </form>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default LoginPage;
