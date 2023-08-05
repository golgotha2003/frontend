import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Grid, Link } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';

const TopUpWallet = () => {
  const [note, setNote] = useState('');
  const accountJson = sessionStorage.getItem('account');
  let account = JSON.parse(accountJson);

  useEffect(() => {
    if (account === null) {
      window.location.href = '/login';
    } else { setNote(account.username); }
  }, [account]);

  return (
    <Container className="top-up-wallet" component="main" maxWidth="md">
      <Paper elevation={3} sx={{ padding: '16px', marginBottom: '16px' }}>
        <Grid container direction="column" alignItems="center">
          <Typography variant="h2" gutterBottom>
            Nạp qua ví momo
          </Typography>
          <Typography variant="body1" gutterBottom>
            MOMO: 0911413402
          </Typography>
          <Typography variant="body1" gutterBottom>
            Nội dung chuyển khoản: nap tien {note}
          </Typography>
          <img
            src={`https://momosv3.apimienphi.com/api/QRCode?phone=0911413402&amount=0&note=${note}`}
            alt="QR Code"
          />
          {/* Add the note here if needed */}
        </Grid>
      </Paper>
      <Typography variant="body1">
        Khi nạp xong hãy liên hệ Facebook:{' '}
        <Link
          href="https://www.facebook.com/profile.php?id=100016126981477"
          target="_blank"
          rel="noopener"
        >
          <FacebookIcon />
          &nbsp;https://www.facebook.com/profile.php?id=100016126981477
        </Link>
      </Typography>
    </Container>
  );
};

export default TopUpWallet;
