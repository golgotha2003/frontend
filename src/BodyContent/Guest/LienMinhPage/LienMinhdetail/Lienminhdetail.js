import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import globalConfig from '../../../../config';
import { Container, Typography, Box, Button } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useParams } from 'react-router-dom';
import { MonetizationOn, ShoppingBasket, MonetizationOnOutlined } from '@mui/icons-material';
import { Row, Col } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';


const NgocRongDetailsPage = () => {
    const [account, setAccount] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const { id } = useParams();
    const accountJson = sessionStorage.getItem('account');
    let user = JSON.parse(accountJson);

    useEffect(() => {
        // Gọi API để lấy thông tin chi tiết của tài khoản với accountId
        axios
            .get(`${globalConfig.apiUrl}/lienminh/getOne/${id}`)
            .then((response) => {
                const fetchedAccount = response.data.lienminh;

                // Tiếp tục gọi API để lấy danh sách hình ảnh tương ứng
                axios
                    .get(`${globalConfig.apiUrl}/imageslienminh/getByAccGameId/${fetchedAccount.id}`)
                    .then((response) => {
                        const imageUrls = response.data.images.map((image) => image.dataImage);
                        fetchedAccount.imageUrls = imageUrls;
                        setAccount(fetchedAccount);
                        setIsLoading(false);
                    })
                    .catch((error) => {
                        console.error(`Error fetching images for account ${fetchedAccount.id}:`, error);
                        setIsLoading(false);
                    });
            })
            .catch((error) => {
                console.error('Error fetching account details:', error);
                setIsLoading(false);
            });
    }, [id]);
    useEffect(() => {
        setIsLoading(true);
        // Fetch related products based on the current product's attributes (e.g., server, planet)
        axios
            .get(`${globalConfig.apiUrl}/lienminh/getRelatedProducts/${id}`)
            .then((response) => {
                const fetchedAccounts = response.data.lienminh;
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

                        setRelatedProducts(updatedAccounts);
                        setIsLoading(false);
                    })
                    .catch((error) => {
                        console.error('Error fetching images:', error);
                        setIsLoading(false);
                    });

                // Assuming your API returns an array of related products
                setRelatedProducts(response.data.lienminh);
            })
            .catch((error) => {
                console.error('Error fetching related products:', error);
            });
    }, [id]);
    const handleBuyNowClick = () => {
        setIsLoading(true);
        if (user === null) {
            toast.error("Bạn chưa đăng nhập");
            setIsLoading(false);
        } else {
        axios
            .post(`${globalConfig.apiUrl}/lienminh/buy`, { accountId: account.id, id: user.id })
            .then((response) => {
                // Handle the response from the API if needed
                if (response.data.success) {
                    setIsLoading(false);
                    toast.success('Mua hàng thành công!');
                }
                else {
                    setIsLoading(false);
                    toast.error(response.data.message);
                }


            })
            .catch((error) => {
                console.error('Error buying product:', error);
                setIsLoading(false);
                // Handle any error that occurs during the API call
                toast.error('Đã có lỗi xảy ra khi mua hàng. Vui lòng thử lại sau.');
            });
        }
    };
    const getRankName = (rank) => {
        switch (rank) {
            case 'Khong-rank':
                return 'Không Rank';
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
                return rank;
        }
    };

    const getYesNoValue = (value) => {
        return value ? 'Có' : 'Không';
    };

    const formatAmount = (amount) => {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };
    const RelatedProductCard = ({ product }) => {
        const rankName = getRankName(product.rank);
        return (
            <Box className="categorySection">
                <div className="product">
                    <div className="card">
                        {product.imageUrl && <img src={product.imageUrl} alt="Product" className="product-image" />}
                    </div>

                    <div className="attribute-content">{product.content}</div>


                    <div className="attribute-container">
                        <p className="attribute-item">Rank: {rankName}</p>
                        <p className="attribute-item">Tướng: {product.tuong}</p>
                        <Typography variant="body1" className="attribute-item">
                            <MonetizationOn />{formatAmount(product.amount)} VNĐ
                        </Typography>
                    </div>
                    <div className="attribute-container">
                        <p className="attribute-item">Skin: {product.skin}</p>
                        <Link to={`/lienminh/${product.id}`} className="viewNowButton">
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
                <div className='data-accountsell'>
                    {account ? (
                        <>
                            {/* Section 1: Giá tiền */}
                            <Box border="2px solid #FFD700" padding="16px" marginBottom="16px" marginTop="16px">
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        size="small"
                                        className="topUpButton"
                                        component={Link}
                                        to={`/topup`}

                                    >
                                        <MonetizationOnOutlined /> Nạp Tiền
                                    </Button>
                                    <Typography variant="h2">Giá: {formatAmount(account.amount)} VNĐ</Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        className="buyNowButton"
                                        onClick={handleBuyNowClick}

                                    >
                                        <ShoppingBasket /> Mua Ngay
                                    </Button>
                                </div>
                            </Box>
                            <Box border="2px solid #A9A9A9" padding="16px" marginBottom="16px">
                                <Typography variant="body1">Mô tả: {account.content}</Typography>

                            </Box>

                            {/* Section 2: Thông tin khác */}
                            <Box border="2px solid #A9A9A9" padding="16px" marginBottom="16px">
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div className="attribute-container">
                                        <p className="attribute-item">Rank: {getRankName(account.rank)}</p>
                                        <p className="attribute-item">Tướng: {account.tuong}</p>
                                    </div>
                                    <div className="attribute-container">
                                        <p className="attribute-item">Skin: {account.skin}</p>
                                    </div>
                                </div>
                            </Box>

                            {/* Section 3: Hình ảnh */}
                            <Box border="2px solid #008000" padding="16px">
                                {account.imageUrls &&
                                    account.imageUrls.map((imageUrl, index) => (
                                        <img key={index} src={imageUrl} alt={`Product ${index + 1}`} className="product-image" />
                                    ))}
                            </Box>
                            {/* Section 4: Related Products */}
                            <Box border="2px solid #008000" padding="16px">
                                <Typography variant="h5">Sản phẩm liên quan</Typography>
                                <Row>
                                    {relatedProducts.map((account) => (
                                        <Col key={account.id} xs={12} sm={12} md={6} lg={6}>
                                            <RelatedProductCard product={account} />
                                        </Col>
                                    ))}
                                </Row>
                            </Box>

                        </>
                    ) : (
                        <Typography variant="body1">Không tìm thấy thông tin tài khoản.</Typography>
                    )}
                </div>
            )}
            <ToastContainer />
        </Container>
    );
};


export default NgocRongDetailsPage;
