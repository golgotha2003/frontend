import React, { useState, useEffect } from 'react';
import axios from 'axios';
import globalConfig from '../../config';
import { Container, Typography, Box, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Pagination } from '@mui/material';

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Number of items displayed per page
    const accountJson = sessionStorage.getItem('account');
    let account = JSON.parse(accountJson);

    // State to store the current sort configuration
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'desc', // Default sorting direction (descending)
    });

    // State to store the current filter value for "Date"
    const [filterByDate, setFilterByDate] = useState('');

    useEffect(() => {
        if (account === null) {
            window.location.href = '/login';
        }
        // Fetch transaction history from API
        axios

            .get(`${globalConfig.apiUrl}/transaction/get/${account.id}`)
            .then((response) => {
                setTransactions(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching transaction history:', error);
                setIsLoading(false);
            });
    }, []);

    // Calculate the total number of pages
    const totalPages = Math.ceil(transactions.length / itemsPerPage);

    // Calculate the start and end index of items for the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // Function to handle page change
    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };

    // Function to handle filter change for "Date"
    const handleFilterByDateChange = (event) => {
        setFilterByDate(event.target.value);
        setCurrentPage(1); // Reset to the first page when changing the filter
    };

    // Function to compare dates for sorting
    const compareDates = (date1, date2, direction) => {
        const a = new Date(date1);
        const b = new Date(date2);
        return direction === 'asc' ? a - b : b - a;
    };

    // Function to handle sorting when clicking on the column header
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };
    const formatAmount = (amount) => {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    // Function to filter and sort the transaction history based on filter and sort configurations
    const sortedAndFilteredTransactions = React.useMemo(() => {
        const filteredTransactions = transactions.filter((transaction) => {
            // Apply filter by date
            if (filterByDate && !transaction.date.includes(filterByDate)) {
                return false;
            }
            return true;
        });

        return filteredTransactions.sort((a, b) => {
            // Apply sorting based on the column key
            if (sortConfig.key === 'date') {
                return compareDates(a[sortConfig.key], b[sortConfig.key], sortConfig.direction);
            } else {
                return sortConfig.direction === 'asc' ? a[sortConfig.key] - b[sortConfig.key] : b[sortConfig.key] - a[sortConfig.key];
            }
        });
    }, [transactions, filterByDate, sortConfig]);

    // Get the current items to display on the current page
    const currentItems = sortedAndFilteredTransactions.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <Container className="container" component="main" maxWidth="md">
            <Paper elevation={3} sx={{ padding: '16px', marginBottom: '16px' }}>
                {isLoading ? (
                    <div className="loadingContainer">
                        <CircularProgress />
                    </div>
                ) : (
                    <>
                        <Typography variant="h2">Lịch sử giao dịch</Typography>
                        {currentItems.length > 0 ? (
                            <>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Transaction ID</TableCell>
                                                <TableCell>
                                                    <TableSortLabel
                                                        active={sortConfig.key === 'date'}
                                                        direction={sortConfig.key === 'date' ? sortConfig.direction : 'desc'}
                                                        onClick={() => handleSort('date')}
                                                    >
                                                        Ngày
                                                    </TableSortLabel>
                                                </TableCell>
                                                <TableCell>

                                                    Gía trị giao dịch

                                                </TableCell>
                                                <TableCell>

                                                    Còn lại

                                                </TableCell>
                                                <TableCell>

                                                    Hoạt động

                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {currentItems.map((transaction, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{transaction.id}</TableCell>
                                                    <TableCell>{transaction.createdAt}</TableCell>
                                                    <TableCell
                                                        style={{ color: transaction.amount < 0 ? 'red' : 'inherit' }}
                                                    >
                                                        {formatAmount(transaction.amount)}
                                                    </TableCell>
                                                    <TableCell>{formatAmount(transaction.balance)}</TableCell>
                                                    <TableCell>{transaction.comment}</TableCell>
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
                            <Typography variant="body1">No transaction records found.</Typography>
                        )}
                    </>
                )}
            </Paper>
        </Container>
    );
};

export default TransactionHistory;
