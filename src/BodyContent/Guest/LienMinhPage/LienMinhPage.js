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
import './LienMinhPage.css';

const LienMinhPage = () => {
    const [accounts, setAccounts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const ITEMS_PER_PAGE = 12;
    const [currentPage, setCurrentPage] = useState(1);
    const [filterRank, setFilterRank] = useState('Tất cả Rank');
    const [filterGia, setFilterGia] = useState('Tất cả Giá');

    useEffect(() => {
        axios
            .get(`${globalConfig.apiUrl}/lienminh/getall`)
            .then((response) => {
                const fetchedAccounts = response.data.lienminhs;

                Promise.all(
                    fetchedAccounts.map((account) =>
                        axios
                            .get(`${globalConfig.apiUrl}/imageslienminh/getOne/${account.id}`)
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

    const getRank = (rankCode) => {
        switch (rankCode) {
            case 'Rank-sat':
                return 'Rank Sắt';
            case 'Rank-dong':
                return 'Rank Đồng';
            case 'Rank-bac':
                return 'Rank Bạc';
            case 'Rank-vang':
                return 'Rank Vàng';
            case 'Rank-bach-kim':
                return 'Rank Bạch Kim';
            case 'Rank-kim-cuong':
                return 'Rank Kim Cương';
            case 'Rank-cao-thu':
                return 'Rank Cao Thủ';
            case 'Rank-dai-cao-thu':
                return 'Rank Đại Cao Thủ';
            case 'Rank-thach-dau':
                return 'Rank Thách Đấu';
            default:
                return rankCode;
        }
    };

    // const getYesNoValue = (value) => {
    //     return value ? 'Có' : 'Không';
    // };

    const formatAmount = (amount) => {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const CategorySection = ({ account }) => {
        const rankName = getRank(account.rank);
        return (
            <Box className="categorySection">
                <div className="product">
                    <div className="card">
                        {account.imageUrl && <img src={account.imageUrl} alt="Product" className="product-image" />}
                    </div>

                    <div className="attribute-content">{account.content}</div>

                    <div className="attribute-container">
                        <p className="attribute-item">Rank: {rankName}</p>
                        <Typography variant="body1" className="attribute-item">
                            <MonetizationOn />{formatAmount(account.amount)} VNĐ
                        </Typography>
                    </div>
                    <div className="attribute-container">
                        <p className="attribute-item">Tuong: {account.tuong}</p>
                        <p className="attribute-item">Skin: {account.skin}</p>
                        <Link to={`/lienminh/${account.id}`} className="viewNowButton">
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
        if (filterRank != 'Tất cả Rank' && account.rank !== filterRank) {
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
                    <h1 variant="h1">Các tài khoản lienminh đang bán</h1>
                    <Box className="filter-container">
                        <FormControl variant="outlined" className="filter-control">
                            <InputLabel>Rank</InputLabel>
                            <Select value={filterRank} onChange={(e) => setFilterRank(e.target.value)} label='Rank'>
                                <MenuItem value="Tất cả Rank">Tất cả Rank</MenuItem>

                                <MenuItem value="Khong-rank">Không Rank</MenuItem>
                                <MenuItem value="Rank-sat">Rank Sắt</MenuItem>
                                <MenuItem value="Rank-dong">Rank Đồng</MenuItem>
                                <MenuItem value="Rank-bac">Rank Bạc</MenuItem>
                                <MenuItem value="Rank-vang">Rank Vàng</MenuItem>
                                <MenuItem value="Rank-bach-kim">Rank Bạch Kim</MenuItem>
                                <MenuItem value="Rank-kim-cuong">Rank Kim Cương</MenuItem>
                                <MenuItem value="Rank-cao-thu">Rank Cao Thủ</MenuItem>
                                <MenuItem value="Rank-dai-cao-thu">Rank Đại Cao Thủ</MenuItem>
                                <MenuItem value="Rank-thach-dau">Rank Thách Đấu</MenuItem>

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

export default LienMinhPage;
