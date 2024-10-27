import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../redux/slice/authSlice';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Avatar, 
  Menu, 
  MenuItem,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box
} from '@mui/material';
import { Menu as MenuIcon, Restaurant, Home,  FitnessCenter, Flag, Person, ExitToApp } from '@mui/icons-material';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogout = () => {
    dispatch(logout());
    setAnchorEl(null);
    navigate('/auth/sign-in');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Home', icon: <Home />, path: '/home' },
    { text: 'Food', icon: <Restaurant />, path: '/food' },
    { text: 'Tracker', icon: <Flag />, path: '/tracker' },
    { text: 'Workout', icon: <FitnessCenter />, path: '/workout' },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Fitness Tracker
      </Typography>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} component={Link} to={item.path}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Fitness Tracker
        </Typography>
        {!isMobile && user && menuItems.map((item) => (
          <Button
            key={item.text}
            color="inherit"
            component={Link}
            to={item.path}
            startIcon={item.icon}
            sx={{ ml: 2 }}
          >
            {item.text}
          </Button>
        ))}
        {user && (
          <>
            <IconButton
              onClick={(e) => setAnchorEl(e.currentTarget)}
              color="inherit"
              sx={{ ml: 2 }}
            >
              <Avatar
                alt={user?.name}
                // src={`https://fit-back-nqqi.onrender.com${user?.profilePicture}`}
                sx={{ width: 40, height: 40 }}
              />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={() => { navigate('/profile'); setAnchorEl(null); }}>
                <ListItemIcon>
                  <Person fontSize="small" />
                </ListItemIcon>
                View Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <ExitToApp fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;