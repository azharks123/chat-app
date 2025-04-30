import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate, useLocation  } from "react-router-dom";
import { logout } from "../../api/api";
import { CONST } from "../../utils/constants";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout()
      .then(() => {
        localStorage.clear();
        window.location.href = "/login";
      })
      .catch((err) => {
        console.error("Logout failed", err);
      });
    navigate("/login");
  };

  const userName = localStorage.getItem(CONST.USER_NAME);
  const isAdmin = localStorage.getItem(CONST.IS_ADMIN);
  const currentPage = location.pathname

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Chat App
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body1">{userName}</Typography>
          {isAdmin && currentPage !== "/admin" && <Button color="inherit" onClick={() => navigate("/admin")}>
            Manage Users
          </Button>}
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
