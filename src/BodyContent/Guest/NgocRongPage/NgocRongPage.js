import React, { useState, useEffect } from 'react';
import axios from 'axios';
import globalConfig from '../../../config';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress
import './NgocRongPage.css';
import { MonetizationOn } from '@mui/icons-material';

const NgocRongPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Thêm trạng thái isLoading

  useEffect(() => {
    // Gọi API để lấy danh sách tài khoản
    axios
      .get(`${globalConfig.apiUrl}/ngocrong/getall`)
      .then((response) => {
        // Lấy danh sách tài khoản từ API
        const fetchedAccounts = response.data.ngocrongs;

        // Lặp qua từng tài khoản và gọi API để lấy hình ảnh tương ứng
        Promise.all(
          fetchedAccounts.map((account) =>
            axios
              .get(`${globalConfig.apiUrl}/imagesngocrong/getOne/${account.id}`)
              .then((response) => response.data.images.dataImage)
              .catch((error) => {
                console.error(`Error fetching image for account ${account.id}:`, error);
                return ''; // Trả về empty string nếu không lấy được hình ảnh
              })
          )
        )
          .then((imageUrls) => {
            // Gán imageUrl cho từng tài khoản trong danh sách tài khoản
            const updatedAccounts = fetchedAccounts.map((account, index) => ({
              ...account,
              imageUrl: imageUrls[index],
            }));

            // Cập nhật state với danh sách tài khoản đã có imageUrl và đặt isLoading thành false
            setAccounts(updatedAccounts);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error('Error fetching images:', error);
            setIsLoading(false);
          });
      })
      .catch((error) => {
        console.error('Error fetching accounts:', error);
        setIsLoading(false);
      });
  }, []);
  const getPlanetName = (planetCode) => {
    switch (planetCode) {
      case 'Trai-dat':
        return 'Trái đất';
      case 'Namec':
        return 'Namec';
      case 'Xayda':
        return 'Xayda';
      default:
        return planetCode; // Trả lại giá trị gốc nếu không có ánh xạ phù hợp
    }
  };
  const getYesNoValue = (value) => {
    return value ? "Có" : "Không";
  };

  const CategorySection = ({ account }) => {
    const planetName = getPlanetName(account.hanh_tinh);
    return (
      <Box className="categorySection">
        <div className="product">
          <div className="card">
            {account.imageUrl && <img src={account.imageUrl} alt="Product" className="product-image" />}
          </div>
          
          <div className="attribute-content">
             {account.content}
          </div>
          
          <div className="attribute-container">
            <p className="attribute-item">Server: {account.sever}</p>
            <p className="attribute-item">Đệ tử: {getYesNoValue(account.de_tu)}</p>
            <Typography variant="body1" className="attribute-item">
          <MonetizationOn />{account.amount} VNĐ
        </Typography>
            
          </div>
          <div className="attribute-container">
            <p className="attribute-item">Hành tinh: {planetName}</p>
            <p className="attribute-item">Bông tai: {getYesNoValue(account.bong_tai)}</p>
            <Link to={`/ngocrong/${account.id}`} className="viewNowButton">
              Xem Ngay
            </Link>
          </div>
        </div>
      </Box>
    );
  };

  return (
    <Container component="main" maxWidth="md">
      {isLoading ? (
        <div className="loadingContainer">
          <CircularProgress />
        </div>
      ) : (
        <>
          <h1 variant="h1">Các tài khoản NgocRong đang bán</h1>
          <Row>
            {accounts.map((account) => (
              <Col key={account.id} xs={12} sm={6} md={4} lg={3}>
                <CategorySection account={account} />
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
  );
};

export default NgocRongPage;
