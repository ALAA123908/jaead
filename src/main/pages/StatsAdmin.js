import React from "react";
import { Typography, Box, Paper, Grid } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { getStats } from "../utils/stats";

function StatsAdmin() {
  const stats = getStats();
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#2196f3', fontWeight: 700 }}>لوحة الإحصائيات</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', fontWeight: 700, fontSize: 22, color: '#43e97b' }}>
            إجمالي الطلبات
            <Typography variant="h5">{stats.totalOrders}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', fontWeight: 700, fontSize: 22, color: '#2196f3' }}>
            إجمالي المبيعات
            <Typography variant="h5">{stats.totalSales} ريال</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', fontWeight: 700, fontSize: 22, color: '#ff9800' }}>
            عدد المنتجات
            <Typography variant="h5">{stats.productsCount}</Typography>
          </Paper>
        </Grid>
      </Grid>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>المنتجات الأكثر طلبًا</Typography>
        <Paper sx={{ p: 2 }}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.topProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="qty" fill="#2196f3" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Box>
    </Box>
  );
}

export default StatsAdmin;
