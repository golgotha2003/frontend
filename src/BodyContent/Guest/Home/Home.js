import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blue } from '@mui/material/colors';
import './homePage.css'; // Import file CSS into the page
import 'bootstrap/dist/css/bootstrap.min.css';
import banner from '../../../images/thoi-dai-hiep-si-min.png';
import logoNro from '../../../images/nro.png';
import logoLMHT from '../../../images/league-of-legends_800x450.jpg';
import logoHso from '../../../images/cutest.jpg';
const theme = createTheme({
  palette: {
    primary: {
      main: blue[500],
    },
  },
});

function CategorySection({ image, title, content, link }) {
  return (
    <Box className="categorySection">
      <img src={image} alt="Category Logo" className="categoryLogo" />
      <Typography variant="h5" className="categoryTitle">
        {title}
      </Typography>
      <Typography variant="body1" className="categoryContent">
        {content}
      </Typography>
      <Link to={link} className="viewNowButton">
        Xem Ngay
      </Link>
    </Box>
  );
}

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
        {/* Banner Section */}
        <Box className="bannerSection" 
        >
          <img src={banner} alt="Banner" className="bannerImage" />
        </Box>

        <Box className="container" 
        >
          <Typography variant="h4" className="header">
            Danh mục dịch vụ
          </Typography>

          {/* Your Category Sections */}
          <div className="row">
            {/* Category Section 1 */}
            <div className="col-md-4">
              <CategorySection
                image={logoHso}
                title="Hiệp sĩ online"
                content="This is a short description of products in Category 1."
                link="/ngocrong"
              />
            </div>
            {/* Category Section 2 */}
            <div className="col-md-4">
              <CategorySection
                image={logoLMHT}
                title="Liên minh huyền thoại"
                content="This is a short description of products in Category 2."
                link="/ngocrong"
              />
            </div>
            {/* Category Section 3 */}
            <div className="col-md-4">
              <CategorySection
                image={logoNro}
                title="Ngọc rồng online"
                content="This is a short description of products in Category 3."
                link="/ngocrong"
              />
            </div>
          </div>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default HomePage;
