import React, { useState, useEffect } from 'react';
import axios from 'axios';
import globalConfig from '../../../config';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Box from '@mui/material/Box';
import { Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { Link } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Pagination from '@mui/material/Pagination';
import { MonetizationOn } from '@mui/icons-material';
import './HiepSiPage.css';

const HiepSiPage = () => {
    const [accounts, setAccounts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const ITEMS_PER_PAGE = 12;
    const [currentPage, setCurrentPage] = useState(1);
    const [filterServer, setFilterServer] = useState('Tất cả Server');
    const [filterPhai, setFilterPhai] = useState('Tất cả Phái');
    const [filterDeTu, setFilterDeTu] = useState('Không chọn');
    const [filterGia, setFilterGia] = useState('Tất cả Giá');

    useEffect(() => {
        axios
            .get(`${globalConfig.apiUrl}/HiepSi/getall`)
            .then((response) => {
                const fetchedAccounts = response.data.hiepsis;

                Promise.all(
                    fetchedAccounts.map((account) =>
                        axios
                            .get(`${globalConfig.apiUrl}/imageshiepsi/getOne/${account.id}`)
                            .then((response) => response.data.images.dataImage)
                            .catch((error) => {
                                console.error(`Error fetching image for account ${account.id}:`, error);
                                return '';
                            })
                    )
                )
                    .then((imageUrls) => {
                        const updatedAccounts = fetchedAccounts.map((account, index) => ({
                            ...account,
                            imageUrl: imageUrls[index],
                        }));

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

    const getClass = (classCode) => {
        switch (classCode) {
            case 'Chien-Binh':
                return 'Chiến Binh';
            case 'Sat-Thu':
                return 'Sát Thủ';
            case 'Phap-Su':
                return 'Pháp Sư';
            case 'Xa-Thu':
                return 'Xạ Thủ';
            default:
                return classCode;
        }
    };

    const getYesNoValue = (value) => {
        return value ? 'Có' : 'Không';
    };

    const formatAmount = (amount) => {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const CategorySection = ({ account }) => {
        const className = getClass(account.phai);
        return (
            <Box className="categorySection">
                <div className="product">
                    <div className="card">
                        {account.imageUrl && <img src={account.imageUrl} alt="Product" className="product-image" />}
                    </div>

                    <div className="attribute-content">{account.content}</div>

                    <div className="attribute-container">
                        <p className="attribute-item">Server: {account.sever}</p>
                        <p className="attribute-item">Đệ tử: {getYesNoValue(account.de_tu)}</p>
                        <Typography variant="body1" className="attribute-item">
                            <MonetizationOn />{formatAmount(account.amount)} VNĐ
                        </Typography>
                    </div>
                    <div className="attribute-container">
                        <p className="attribute-item">Phái: {getClass}</p>
                        <Link to={`/HiepSi/${account.id}`} className="viewNowButton">
                            Xem Ngay
                        </Link>
                    </div>
                </div>
            </Box>
        );
    };

    const handlePaginationChange = (event, value) => {
        setCurrentPage(value);
    };

    const applyFilters = (account) => {
        if (filterServer != 'Tất cả Server' && account.sever !== filterServer) {
            return false;
        }
        if (filterPhai != 'Tất cả Phái' && account.phai !== filterPhai) {
            return false;
        }
        if (filterDeTu !== 'Không chọn' && account.de_tu !== filterDeTu) {
            return false;
        }
        if (filterGia && filterGia !== '') {
            const amount = parseInt(account.amount);
            switch (filterGia) {
                case 50000:
                    if (amount >= 50000) {
                        return false;
                    }
                    break;
                case 200000:
                    if (amount < 50000 || amount >= 200000) {
                        return false;
                    }
                    break;
                case 500000:
                    if (amount < 200000 || amount >= 500000) {
                        return false;
                    }
                    break;
                case 1000000:
                    if (amount < 500000 || amount >= 1000000) {
                        return false;
                    }
                    break;
                case 2000000:
                    if (amount < 1000000) {
                        return false;
                    }
                    break;
                default:
                    break;
            }
        }
        return true;
    };

    const filteredAccounts = accounts.filter(applyFilters);
    const totalPages = Math.ceil(filteredAccounts.length / ITEMS_PER_PAGE);
    const displayedAccounts = filteredAccounts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <Container component="main" maxWidth="md">
            {isLoading ? (
                <div className="loadingContainer">
                    <CircularProgress />
                </div>
            ) : (
                <>
                    <h1 variant="h1">Các tài khoản HiepSi đang bán</h1>
                    <Box className="filter-container">
                        <FormControl variant="outlined" className="filter-control">
                            <InputLabel>Server</InputLabel>
                            <Select value={filterServer} onChange={(e) => setFilterServer(e.target.value)} label='Server'>
                                <MenuItem value="Tất cả Server">Tất cả Server</MenuItem>

                                <MenuItem value="Chien-Than">Chiến Thần</MenuItem>
                                <MenuItem value="Rong-Lua">Rồng Lửa</MenuItem>
                                <MenuItem value="Phuong-Hoang">Phượng Hoàng</MenuItem>
                                <MenuItem value="Nhan-Ma">Nhân Mã</MenuItem>
                                <MenuItem value="Ki Lan">Kì Lân</MenuItem>

                            </Select>
                        </FormControl>
                        <FormControl variant="outlined" className="filter-control">
                            <InputLabel>Phái</InputLabel>
                            <Select value={filterPhai} onChange={(e) => setFilterPhai(e.target.value)}>
                                <MenuItem value='Tất cả Phái'>Tất cả Phái</MenuItem>
                                <MenuItem value="Chien-Binh">Chiến Binh</MenuItem>
                                <MenuItem value="Sat-Thu">Sát Thủ</MenuItem>
                                <MenuItem value="Phap-Su">Pháp Sư</MenuItem>
                                <MenuItem value="Xa-Thu">Xạ Thủ</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl variant="outlined" className="filter-control">
                            <InputLabel>Đệ tử</InputLabel>
                            <Select value={filterDeTu} onChange={(e) => setFilterDeTu(e.target.value)}>
                                <MenuItem value="Không chọn">Không chọn</MenuItem>
                                <MenuItem value={false}>Không</MenuItem>
                                <MenuItem value={true}>Có</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl variant="outlined" className="filter-control">
                            <InputLabel>Giá</InputLabel>
                            <Select value={filterGia} onChange={(e) => setFilterGia(e.target.value)}>
                                <MenuItem value="Tất cả Giá">Tất cả Giá</MenuItem>
                                <MenuItem value={50000}>Dưới 50k</MenuItem>
                                <MenuItem value={200000}>Từ 50k đến 200k</MenuItem>
                                <MenuItem value={500000}>Từ 200k đến 500k</MenuItem>
                                <MenuItem value={1000000}>Từ 500k đến 1 triệu</MenuItem>
                                <MenuItem value={2000000}>Trên 1 triệu</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Row>
                        {displayedAccounts.map((account) => (
                            <Col key={account.id} xs={12} sm={6} md={4} lg={3}>
                                <CategorySection account={account} />
                            </Col>
                        ))}
                    </Row>
                    <div className="pagination">
                        <Pagination count={totalPages} page={currentPage} onChange={handlePaginationChange} color="primary" />
                    </div>
                </>
            )}
        </Container>
    );
};

export default HiepSiPage;
