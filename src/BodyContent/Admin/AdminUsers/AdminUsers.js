import React, { useState, useEffect } from 'react';
import {
  Typography,
  Container,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import globalConfig from '../../../config';
import './AdminUsers.css';
import Pagination from '@mui/material/Pagination';
import axios from 'axios';

function AdminUsers() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [usersData, setUsersData] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const accountJson = sessionStorage.getItem('account');
  let account = JSON.parse(accountJson);

  // State for Dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [moneyInput, setMoneyInput] = useState('');

  // State for loading when performing actions
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (account){
        if (account.role !== 3)
        window.location.href = '/'
    }
    else{
        window.location.href = '/login'
    }
    fetchUsersFromApi()
      .then((data) => {
        if (data.success) {
          setUsersData(data.users);
          setFilteredUsers(data.users.slice(0, usersPerPage));
        } else {
          console.error('Error fetching users:', data.message);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        setLoading(false);
      });
  }, []);

  const fetchUsersFromApi = async () => {
    const response = await fetch(`${globalConfig.apiUrl}/account/users`);
    const data = await response.json();
    return data;
  };

  const handleSearch = () => {
    const keyword = searchKeyword.trim().toLowerCase();
    if (keyword === '') {
      setFilteredUsers(usersData.slice(0, usersPerPage));
    } else {
      const filtered = usersData.filter((user) => user.username.toLowerCase().includes(keyword));
      setFilteredUsers(filtered.slice(0, usersPerPage));
    }
    setCurrentPage(1);
  };

  const handleRoleButton = (userId, role) => {
    console.log('Role button clicked for user ID:', userId);
  
    if (role === 1) {
      setActionLoading(true);
      axios
        .post(`${globalConfig.apiUrl}/account/changeUserRole`, { userId, role: 2 })
        .then((response) => {
          // Handle the API response and update the state accordingly
          if (response.data.success) {
            const updatedUsersData = usersData.map((user) =>
              user.id === userId ? { ...user, role: 2 } : user
            );
            setUsersData(updatedUsersData);
            const updatedFilteredUsers = filteredUsers.map((user) =>
              user.id === userId ? { ...user, role: 2 } : user
            );
            setFilteredUsers(updatedFilteredUsers);
            toast.success(`Đã chuyển người dùng có ID: ${userId} thành 'Thằng nô lệ'`);
          } else {
            toast.error(`Có lỗi xảy ra khi chuyển người dùng có ID: ${userId}`);
          }
          setActionLoading(false);
        })
        .catch((error) => {
          console.error('Error changing user role:', error);
          toast.error(`Có lỗi xảy ra khi chuyển người dùng có ID: ${userId}`);
          setActionLoading(false);
        });
    } else if (role === 2) {
      setActionLoading(true);
      axios
        .post(`${globalConfig.apiUrl}/account/changeUserRole`, { userId, role: 1 })
        .then((response) => {
          // Handle the API response and update the state accordingly
          if (response.data.success) {
            const updatedUsersData = usersData.map((user) =>
              user.id === userId ? { ...user, role: 1 } : user
            );
            setUsersData(updatedUsersData);
            const updatedFilteredUsers = filteredUsers.map((user) =>
              user.id === userId ? { ...user, role: 1 } : user
            );
            setFilteredUsers(updatedFilteredUsers);
            toast.success(`Đã chuyển người dùng có ID: ${userId} thành 'Hoàng đế'`);
          } else {
            toast.error(`Có lỗi xảy ra khi chuyển người dùng có ID: ${userId}`);
          }
          setActionLoading(false);
        })
        .catch((error) => {
          console.error('Error changing user role:', error);
          toast.error(`Có lỗi xảy ra khi chuyển người dùng có ID: ${userId}`);
          setActionLoading(false);
        });
    }
  };
  

  const handleAddMoney = () => {
    console.log('Add money clicked for user ID:', selectedUserId);
    console.log('Amount:', moneyInput);
  
    setLoading(true); // Set actionLoading to true when starting the action
  
    axios
      .post(`${globalConfig.apiUrl}/account/addMoney`, { userId: selectedUserId, amount: moneyInput })
      .then((response) => {
        // Handle the API response and update the state accordingly
        if (response.data.success) {
          // Perform any additional actions if needed
          // For example, you can update the user's balance in the state or reload the user data
          // You might need to fetch the updated user data from the server to get the latest balance value
          toast.success(`Đã cộng ${moneyInput} tiền cho người dùng có ID: ${selectedUserId}`);
        } else {
          toast.error(`Có lỗi xảy ra khi cộng tiền cho người dùng có ID: ${selectedUserId}`);
        }
        setLoading(false); // Set actionLoading to false after the action is completed
      })
      .catch((error) => {
        console.error('Error adding money:', error);
        toast.error(`Có lỗi xảy ra khi cộng tiền cho người dùng có ID: ${selectedUserId}`);
        setLoading(false); // Set actionLoading to false if there is an error
      });
      
  
    handleCloseDialog();
  };
  

  const handlePageChange = (event, page) => {
    const startIndex = (page - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    setFilteredUsers(usersData.slice(startIndex, endIndex));
    setCurrentPage(page);
  };

  // Dialog Handlers
  const handleOpenDialog = (userId) => {
    setSelectedUserId(userId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUserId('');
    setMoneyInput('');
  };

  return (
    <Container className="container">
      <Paper className="paper">
        <Typography variant="h4" className="pageTitle">
          Admin Users
        </Typography>

        <div className="searchContainer">
          <TextField
            label="Search User"
            className="searchInput"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <Button variant="contained" onClick={handleSearch}>
            Search
          </Button>
        </div>

        {loading ? (
          <div className="loadingContainer">
            <CircularProgress />
          </div>
        ) : filteredUsers.length === 0 ? (
          <Typography>No users found.</Typography>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className="tableHeadCell">Username</TableCell>
                    <TableCell className="tableHeadCell">Role</TableCell>
                    <TableCell className="tableHeadCell">Action</TableCell>
                    <TableCell className="tableHeadCell">Order</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.role === 1 ? 'Hoàng đế' : 'Thằng nô lệ'}</TableCell>
                    <TableCell>
                      {user.role !== 3 && (
                        <>
                          <Button
                            disabled={actionLoading} // Disable the button while performing the action
                            onClick={() => handleRoleButton(user.id, user.role)}
                          >
                            {user.role === 1 ? 'Làm nô lệ' : 'Cắt chức'}
                          </Button>
                          
                        </>
                      )}
                    </TableCell>
                    <TableCell><Button onClick={() => handleOpenDialog(user.id)}>Cộng tiền</Button></TableCell>
                    
                  </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Pagination
              count={Math.ceil(usersData.length / usersPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
              className="pagination"
              showFirstButton
              showLastButton
            />
            {/* Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Nhập số tiền</DialogTitle>
              <DialogContent>
                <TextField
                  label="Số tiền"
                  type="number"
                  value={moneyInput}
                  onChange={(e) => setMoneyInput(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Đóng</Button>
                <Button onClick={handleAddMoney}>Xác nhận</Button>
              </DialogActions>
            </Dialog>
            {/* Toast Container */}
            <ToastContainer />
          </>
        )}
      </Paper>
    </Container>
  );
}

export default AdminUsers;
