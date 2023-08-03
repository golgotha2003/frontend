import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Link } from 'react-router-dom';
import axios from 'axios';
import globalConfig from '../../../config';
import './ManageProduct.css';
import Pagination from '@mui/material/Pagination';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageProduct = () => {
  const [products, setProducts] = useState([]);
  const [filterName, setFilterName] = useState('Tất cả');
  const [filterStatus, setFilterStatus] = useState('Tất cả');
  const [filterPrice, setFilterPrice] = useState('Thấp đến cao');
  const [page, setPage] = useState(1);
  const productsPerPage = 5;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [filterName, filterStatus, filterPrice, page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const api1Response = await axios.get(`${globalConfig.apiUrl}/ngocrong/getall`);
      const api2Response = await axios.get(`${globalConfig.apiUrl}/lienminh/getall`);
      const api3Response = await axios.get(`${globalConfig.apiUrl}/hiepsi/getall`);

      const api1Products = api1Response.data.ngocrongs.map((item) => ({
        id: item.id,
        name: 'Ngọc Rồng',
        description: item.content,
        price: item.amount,
        status: item.status,
        role : 'ngocrong',
      }));

      const api2Products = api2Response.data.lienminhs.map((item) => ({
        id: item.id,
        name: 'Liên Minh',
        description: item.context,
        price: item.amount,
        status: item.status,
        role : 'lienminh',
      }));

      const api3Products = api3Response.data.hiepsis.map((item) => ({
        id: item.id,
        name: 'Hiệp Sĩ Online',
        description: item.context,
        price: item.amount,
        status: item.status,
        role : 'hiepsi',
      }));

      let filteredProducts = [...api1Products, ...api2Products, ...api3Products];

      if (filterName !== 'Tất cả') {
        filteredProducts = filteredProducts.filter((product) => product.name === filterName);
      }

      if (filterStatus !== 'Tất cả') {
        filteredProducts = filteredProducts.filter((product) =>
          product.status === (filterStatus === 'Chưa bán' ? 1 : 2)
        );
        filteredProducts = filteredProducts.filter((product) =>
          product.status === (filterStatus === 'Đã bán' ? 2 : 1)
        );
      }

      if (filterPrice === 'Cao đến thấp') {
        filteredProducts.sort((a, b) => b.price - a.price);
      } else {
        filteredProducts.sort((a, b) => a.price - b.price);
      }

      setProducts(filteredProducts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const handleFilterNameChange = (event) => {
    setFilterName(event.target.value);
  };

  const handleFilterStatusChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const handleFilterPriceChange = (event) => {
    setFilterPrice(event.target.value);
  };

  const handleDeleteProduct = async (productId, productRole) => {
    try {
      setLoading(true);
      const response=await axios.post(`${globalConfig.apiUrl}/${productRole}/delete/${productId}`);
      fetchProducts();
      if (response.data.success){
        toast.success('Xóa sản phẩm thành công!');
      }
      else {
        toast.error(response.data.message)
      }
      
    } catch (error) {
      console.error('Error deleting product:', error);
      setLoading(false);
      toast.error('Đã xảy ra lỗi khi xóa sản phẩm.');
    }
  };

  const getStatusText = (status) => {
    return status === 1 ? 'Chưa bán' : 'Đã bán';
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Container>

      <Paper className="Paper">
        {loading ? (
          <CircularProgress className="loading-spinner" />
        ) : (<div>
          <Typography variant="h4" className="Typography-title">
            Quản Lý Sản Phẩm
          </Typography>
          <Button
            component={Link}
            to="/admin/create-product"
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            color="primary"
            className="add-product-button"
          >
            Thêm Sản Phẩm
          </Button>
          <Box className="filter-box">
            <FormControl variant="outlined" className="filter-control">
              <InputLabel>Tên Sản Phẩm</InputLabel>
              <Select value={filterName} onChange={handleFilterNameChange} label="Tên Sản Phẩm">
                <MenuItem value="Tất cả">Tất cả</MenuItem>
                <MenuItem value="Liên Minh">Liên Minh</MenuItem>
                <MenuItem value="Ngọc Rồng">Ngọc Rồng</MenuItem>
                <MenuItem value="Hiệp Sĩ Online">Hiệp Sĩ Online</MenuItem>
              </Select>
            </FormControl>
            <FormControl variant="outlined" className="filter-control">
              <InputLabel>Trạng Thái</InputLabel>
              <Select value={filterStatus} onChange={handleFilterStatusChange} label="Trạng Thái">
                <MenuItem value="Tất cả">Tất cả</MenuItem>
                <MenuItem value="Chưa bán">Chưa bán</MenuItem>
                <MenuItem value="Đã bán">Đã bán</MenuItem>
              </Select>
            </FormControl>
            <FormControl variant="outlined" className="filter-control">
              <InputLabel>Giá</InputLabel>
              <Select value={filterPrice} onChange={handleFilterPriceChange} label="Giá">
                <MenuItem value="Thấp đến cao">Thấp đến cao</MenuItem>
                <MenuItem value="Cao đến thấp">Cao đến thấp</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <TableContainer>
            <Table className="Table">
              <TableHead className="TableHead">
                <TableRow>
                  <TableCell>STT</TableCell>
                  <TableCell>Tên Sản Phẩm</TableCell>
                  <TableCell>Mô Tả</TableCell>
                  <TableCell>Giá</TableCell>
                  <TableCell>Trạng Thái</TableCell>
                  <TableCell align="center">Hành Động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products
                  .slice((page - 1) * productsPerPage, page * productsPerPage)
                  .map((product, index) => (
                    <TableRow key={product.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.description}</TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell>{getStatusText(product.status)}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          aria-label="Edit"
                          component={Link}
                          to={`/admin/${product.role}/edit-product/${product.id}`}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          aria-label="Delete"
                          component="span"
                          onClick={() => handleDeleteProduct(product.id, product.role)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box className="pagination-box">
            <Pagination
              count={Math.ceil(products.length / productsPerPage)}
              color="primary"
              size="large"
              page={page}
              onChange={handlePageChange}
            />
          </Box>
        </div>
        )}
      </Paper>

    </Container>
  );
};

export default ManageProduct;
