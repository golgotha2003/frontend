import React, { useState, useEffect } from 'react';
import axios from 'axios';
import globalConfig from '../../config';
import { Container, Typography, Box, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Pagination } from '@mui/material';

const NickDaMua = () => {
  const [nickDaMua, setNickDaMua] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Số item hiển thị trên mỗi trang
  const accountJson = sessionStorage.getItem('account');
  let account = JSON.parse(accountJson);

  // State để lưu trạng thái hiện tại của việc sort
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc',
  });

  // State để lưu trạng thái hiện tại của ô lọc "Ngày mua"
  const [filterByNgayMua, setFilterByNgayMua] = useState('');

  useEffect(() => {
    // Gọi API để lấy danh sách các nick đã mua
    if (account === null) {
      window.location.href = '/login';
    }
    axios
      .get(`${globalConfig.apiUrl}/orderaccgame/getall/${account.id}`)
      .then((response) => {
        setNickDaMua(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching nick đã mua:', error);
        setIsLoading(false);
      });
  }, [account]);

  // Tính số trang tối đa
  const totalPages = Math.ceil(nickDaMua.length / itemsPerPage);

  // Xác định index bắt đầu và index kết thúc của item trên trang hiện tại từ sortedItems
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Hàm thay đổi trang
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  // Hàm xử lý khi người dùng nhập vào ô lọc "Ngày mua"
  const handleFilterByNgayMuaChange = (event) => {
    setFilterByNgayMua(event.target.value);
    setCurrentPage(1); // Reset trang về trang đầu tiên khi thay đổi bộ lọc
  };

  const compareDates = (date1, date2, direction) => {
    const a = new Date(date1);
    const b = new Date(date2);
    return direction === 'asc' ? a - b : b - a;
  };

  const compareServiceNames = (name1, name2, direction) => {
    return direction === 'asc' ? name1.localeCompare(name2) : name2.localeCompare(name1);
  };

  // Hàm xử lý khi người dùng click vào nút bấm để sort theo cột
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Lọc và sắp xếp danh sách các nick đã mua dựa vào giá trị của ô lọc và cách sort
  const sortedAndFilteredItems = React.useMemo(() => {
    const filteredItems = nickDaMua.filter((nick) => {
      // Áp dụng bộ lọc theo ngày mua
      if (filterByNgayMua && !nick.createdAt.includes(filterByNgayMua)) {
        return false;
      }
      return true;
    });

    return filteredItems.sort((a, b) => {
      // Áp dụng sort theo cột được chỉ định
      if (sortConfig.key === 'createdAt') {
        return compareDates(a[sortConfig.key], b[sortConfig.key], sortConfig.direction);
      } else if (sortConfig.key === 'content') {
        return compareServiceNames(a[sortConfig.key], b[sortConfig.key], sortConfig.direction);
      } else {
        return sortConfig.direction === 'asc' ? a[sortConfig.key] - b[sortConfig.key] : b[sortConfig.key] - a[sortConfig.key];
      }
    });
  }, [nickDaMua, filterByNgayMua, sortConfig]);

  // Xác định index bắt đầu và index kết thúc của item trên trang hiện tại từ sortedAndFilteredItems
  const currentItems = sortedAndFilteredItems.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <Container className="container" component="main" maxWidth="md">
      <Paper elevation={3} sx={{ padding: '16px', marginBottom: '16px' }}>
        {isLoading ? (
          <div className="loadingContainer">
            <CircularProgress />
          </div>
        ) : (
          <>
            <Typography variant="h2">Danh sách các nick đã mua</Typography>
            
            {currentItems.length > 0 ? (
              <>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>STT</TableCell>
                        <TableCell>
                          <TableSortLabel
                            active={sortConfig.key === 'content'}
                            direction={sortConfig.key === 'content' ? sortConfig.direction : 'asc'}
                            onClick={() => handleSort('content')}
                          >
                            Tên dịch vụ
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>
                          <TableSortLabel
                            active={sortConfig.key === 'username'}
                            direction={sortConfig.key === 'username' ? sortConfig.direction : 'asc'}
                            onClick={() => handleSort('username')}
                          >
                            Tài khoản
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>
                          <TableSortLabel
                            active={sortConfig.key === 'password'}
                            direction={sortConfig.key === 'password' ? sortConfig.direction : 'asc'}
                            onClick={() => handleSort('password')}
                          >
                            Mật khẩu
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>
                          <TableSortLabel
                            active={sortConfig.key === 'createdAt'}
                            direction={sortConfig.key === 'createdAt' ? sortConfig.direction : 'asc'}
                            onClick={() => handleSort('createdAt')}
                          >
                            Ngày mua
                          </TableSortLabel>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentItems.map((nick, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1 + (currentPage - 1) * itemsPerPage}</TableCell>
                          <TableCell>{nick.content}</TableCell>
                          <TableCell>{nick.username}</TableCell>
                          <TableCell>{nick.password}</TableCell>
                          <TableCell>{nick.createdAt}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                  <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
                </Box>
              </>
            ) : (
              <Typography variant="body1">Không có nick nào đã mua.</Typography>
            )}
          </>
        )}
      </Paper>
    </Container>
  );
};

export default NickDaMua;
