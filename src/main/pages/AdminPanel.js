import React from "react";
import { Container, Grid, Paper, Typography, Button, Tabs, Tab, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ProductsAdmin from "./ProductsAdmin";
import OrdersAdmin from "./OrdersAdmin";
import StatsAdmin from "./StatsAdmin";
import UsersAdmin from "./UsersAdmin";

function AdminPanel() {
  const navigate = useNavigate();
  const [tab, setTab] = React.useState(0);
  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Typography variant="h4" gutterBottom align="center">
        لوحة تحكم الإدارة
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3, boxShadow: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>إدارة المنتجات</Typography>
            <Button variant="contained" color="primary" fullWidth onClick={() => navigate("/admin/products")}>المنتجات</Button>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3, boxShadow: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>إدارة الطلبات</Typography>
            <Button variant="contained" color="primary" fullWidth onClick={() => navigate("/admin/orders")}>الطلبات</Button>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3, boxShadow: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>الإحصائيات</Typography>
            <Button variant="contained" color="primary" fullWidth onClick={() => navigate("/stats")}>الإحصائيات</Button>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3, boxShadow: 3, background: '#f1f8e9' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#388e3c' }}>إدارة حسابات الأدمن</Typography>
            <Button variant="contained" color="success" fullWidth onClick={() => navigate("/admins")}>حسابات الأدمن</Button>
          </Paper>
        </Grid>
      </Grid>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} centered sx={{ mt: 4 }}>
        <Tab label="المنتجات" />
        <Tab label="الطلبات" />
        <Tab label="الإحصائيات" />
        <Tab label="المستخدمون" />
      </Tabs>
      <Box sx={{ mt: 4 }}>
        {tab === 0 && <ProductsAdmin />}
        {tab === 1 && <OrdersAdmin />}
        {tab === 2 && <StatsAdmin />}
        {tab === 3 && <UsersAdmin />}
      </Box>
    </Container>
  );
}

export default AdminPanel;
