import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AppBarMain from "./components/AppBarMain";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import AdminPanel from "./pages/AdminPanel";
import StatsAdmin from "./pages/StatsAdmin";
import Login from "./pages/Login";
import RequireRole from "./components/RequireRole";
import AdminUsers from "./pages/AdminUsers";
import UserOrders from "./pages/UserOrders";
import AuditLog from "./pages/AuditLog";
import UserProfile from "./pages/UserProfile";
import Wishlist from "./pages/Wishlist";
import { Box } from "@mui/material";

function App() {
  const [role, setRole] = useState(localStorage.getItem("role") || "user");

  const handleLogin = (r) => {
    setRole(r);
  };

  return (
    <Router>
      <AppBarMain />
      <Box sx={{ minHeight: '90vh', background: '#f7fafc', pb: 4 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/orders" element={<UserOrders />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/audit" element={
            <RequireRole role="admin">
              <AuditLog />
            </RequireRole>
          } />
          <Route path="/admin/*" element={
            <RequireRole role="admin">
              <AdminPanel />
            </RequireRole>
          } />
          <Route path="/stats" element={
            <RequireRole role="admin">
              <StatsAdmin />
            </RequireRole>
          } />
          <Route path="/admins" element={
            <RequireRole role="admin">
              <AdminUsers />
            </RequireRole>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
