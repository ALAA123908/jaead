import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Box, Button, Snackbar, Alert } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StoreIcon from "@mui/icons-material/Store";
import LogoutIcon from "@mui/icons-material/Logout";
import ListAltIcon from "@mui/icons-material/ListAlt";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate } from "react-router-dom";

function AppBarMain() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [snack, setSnack] = React.useState({ open: false, message: '', severity: 'info' });

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    setSnack({ open: true, message: "تم تسجيل الخروج بنجاح.", severity: "success" });
    setTimeout(() => {
      navigate("/login");
      window.location.reload();
    }, 900);
  };

  return (
    <div>
      <AppBar position="static" sx={{ background: "linear-gradient(90deg,#2196f3,#43e97b 99%)" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="logo" onClick={() => navigate("/")}>
            <StoreIcon fontSize="large" />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 2 }}>
            jawad market
          </Typography>
          <Box>
            <Button color="inherit" onClick={() => navigate("/")}>الرئيسية</Button>
            <Button color="inherit" startIcon={<ListAltIcon />} onClick={() => navigate("/orders")}>طلباتي</Button>
            <IconButton color="inherit" onClick={() => navigate("/cart")}> <ShoppingCartIcon /> </IconButton>
            <Button color="inherit" startIcon={<FavoriteIcon />} onClick={() => navigate("/wishlist")}
              sx={{ ml: 1, fontWeight: 700, fontSize: 17 }}>
              المفضلة
            </Button>
            <Button color="inherit" onClick={() => navigate("/admin")}>الإدارة</Button>
            {role === "admin" && (
              <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout} sx={{ ml: 1 }}>
                خروج
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      {snack.open && (
        <Snackbar open={snack.open} autoHideDuration={2000} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert severity={snack.severity} sx={{ width: '100%' }}>
            {snack.message}
          </Alert>
        </Snackbar>
      )}
    </div>
  );
}

export default AppBarMain;
