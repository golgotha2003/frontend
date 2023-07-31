import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blue } from '@mui/material/colors';
import './homePage.css'; // Import file CSS vào trang

const theme = createTheme({
    palette: {
        primary: {
            main: blue[500],
        },
    },
});

function HomePage() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">Home Page</Typography>
                </Toolbar>
            </AppBar>
            <Container component="main" maxWidth="md">
                <Box className="container"> {/* Sử dụng lớp CSS container */}
                    <Typography variant="h4" className="header"> {/* Sử dụng lớp CSS header */}
                        Welcome to our website
                    </Typography>
                    <Typography variant="body1" className="content"> {/* Sử dụng lớp CSS content */}
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                        finibus, enim vitae fringilla ultricies, eros odio dictum risus,
                        eu auctor est lectus eu elit. Phasellus non justo lectus. Morbi
                        congue elit nec sem scelerisque, id vulputate mauris volutpat.
                        Praesent nec libero eget velit gravida luctus vel ut purus.
                    </Typography>
                    <Typography variant="body1" className="content"> {/* Sử dụng lớp CSS content */}
                        Nullam tempor, justo a sagittis euismod, urna sapien consectetur
                        nunc, non tincidunt quam orci quis tellus. Vivamus at finibus
                        dolor. Suspendisse eget tortor vel ligula rhoncus dignissim a eu
                        justo. Sed in justo vel magna bibendum volutpat ac nec dolor.
                    </Typography>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default HomePage;
