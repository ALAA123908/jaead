import React, { useEffect, useState } from "react";
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, Box, Chip, LinearProgress, Snackbar, Button } from "@mui/material";
import { getOrders } from "../utils/orders";
import { saveCart } from "../utils/cart";
import { useNavigate } from "react-router-dom";

function getCurrentUsername() {
  return localStorage.getItem("username") || "";
}

function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'info' });
  const username = getCurrentUsername();
  const navigate = useNavigate();

  useEffect(() => {
    const allOrders = getOrders();
    setOrders(allOrders.filter(o => o.username === username));
  }, [username]);

  useEffect(() => {
    const notif = JSON.parse(localStorage.getItem("userOrderDelivered") || "null");
    if (notif && notif.orderId && notif.time) {
      setSnack({ open: true, message: `تم توصيل طلبك رقم (${notif.orderId}) بنجاح!`, severity: "success" });
      localStorage.removeItem("userOrderDelivered");
    }
  }, []);

  const statusColor = s => s === "تم التوصيل" ? "success" : s === "قيد التنفيذ" ? "warning" : "info";

  // زر إعادة الطلب
  const handleReorder = (order) => {
    saveCart(order.items || []);
    setSnack({ open: true, message: "تمت إضافة المنتجات إلى السلة. يمكنك تعديل الكمية أو إتمام الشراء.", severity: "success" });
    setTimeout(() => navigate("/cart"), 1200);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 4 }}>
        <Typography variant="h4" sx={{ color: '#2196f3', fontWeight: 700, mb: 3 }}>طلباتي السابقة</Typography>
        {orders.length === 0 ? (
          <Typography>لا توجد طلبات سابقة.</Typography>
        ) : (
          <Table sx={{ background: '#f8fafd', borderRadius: 3 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>رقم الطلب</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>المحتويات</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>الإجمالي</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>الحالة</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>التاريخ</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>خيارات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order, idx) => (
                <TableRow key={idx}>
                  <TableCell>{order.id || idx + 1}</TableCell>
                  <TableCell>{order.items?.map(i => i.name + ' × ' + i.qty).join(', ')}</TableCell>
                  <TableCell>{order.total} ريال</TableCell>
                  <TableCell>
                    <Chip label={order.status || "جديد"} color={statusColor(order.status || "جديد")}/>
                    <Box sx={{ mt: 1 }}>
                      <LinearProgress variant="determinate" value={
                        order.status === "تم التوصيل" ? 100 : order.status === "قيد التنفيذ" ? 60 : 20
                      } sx={{ height: 8, borderRadius: 4, background: '#e3f2fd' }} />
                    </Box>
                  </TableCell>
                  <TableCell>{order.createdAt}</TableCell>
                  <TableCell>
                    <Button variant="outlined" color="primary" size="small" onClick={() => handleReorder(order)}>
                      أعد الطلب
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
      <Snackbar
        open={snack.open}
        message={snack.message}
        severity={snack.severity}
        autoHideDuration={6000}
        onClose={() => setSnack({ open: false, message: '', severity: 'info' })}
      />
    </Container>
  );
}

export default UserOrders;
