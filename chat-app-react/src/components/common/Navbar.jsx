import {useState} from "react";
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { CONST, handleLogout } from "../../utils/constants";
import { ROUTES } from "../../utils/router";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const userName = localStorage.getItem(CONST.USER_NAME);
  const isAdmin = localStorage.getItem(CONST.IS_ADMIN);
  const currentPage = location.pathname;

  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (route) => {
    navigate(route);
    handleMenuClose();
  };

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Chat App
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body1">{userName}</Typography>
          <Button
            color="inherit"
            onClick={handleMenuOpen}
            aria-controls={anchorEl ? "view-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={anchorEl ? "true" : undefined}
          >
            View
          </Button>
          <Menu
            id="view-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            MenuListProps={{ "aria-labelledby": "view-button" }}
          >
            <MenuItem onClick={() => handleNavigate(ROUTES.DASHBOARD)}>
              Dashboard
            </MenuItem>
            {isAdmin && (
              <MenuItem onClick={() => handleNavigate(ROUTES.ADMIN)}>
                Manage Users
              </MenuItem>
            )}
          </Menu>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
