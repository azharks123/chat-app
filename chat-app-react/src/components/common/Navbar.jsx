import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const username = localStorage.getItem("username");

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Chat App
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body1">{username}</Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
