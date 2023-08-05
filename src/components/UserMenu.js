import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const UserMenu = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          User Menu
        </Typography>
        <Button color="inherit" component={Link} to="/user/nick-da-mua">
          Nick đã mua
        </Button>
        <Button color="inherit" component={Link} to="/user/lich-su-giao-dich">
          Lịch sử giao dịch
        </Button>
        <Button color="inherit" component={Link} to="/user/nap-tien">
          Nạp tiền
        </Button>
        <Button color="inherit" component={Link} to="/user/profile">
          Profile
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default UserMenu;
