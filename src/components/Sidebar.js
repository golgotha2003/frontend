import React from 'react';
import { Link } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import StorageIcon from '@mui/icons-material/Storage';

const drawerWidth = 240;
const accountJson = sessionStorage.getItem('account');
let account = JSON.parse(accountJson);

const Sidebar = () => {
    const home = () => {
        window.location.href = '/';
    };

    return (
        <Drawer variant="permanent" sx={{ width: drawerWidth }}>
            <div sx={{ width: drawerWidth }}>
                <List>
                    <ListItem button component={Link} to="/admin/dashboard">
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItem>
                    {account && account.role === 3 &&
                        <ListItem button component={Link} to="/admin/users">
                            <ListItemIcon>
                                <PeopleIcon />
                            </ListItemIcon>
                            <ListItemText primary="Users" />
                        </ListItem>
                    }
                    
                    <ListItem button component={Link} to="/admin/manage-products">
                        <ListItemIcon>
                            <StorageIcon />
                        </ListItemIcon>
                        <ListItemText primary="Manage Products" />
                    </ListItem>
                </List>
                <Divider />
                <List>
                    
                    <ListItem button onClick={home}>
                        <ListItemIcon>
                            <ExitToAppIcon />
                        </ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItem>
                </List>
            </div>
        </Drawer>
    );
};

export default Sidebar;
