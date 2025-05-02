import React, { useEffect, useState } from "react";
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, Box, IconButton, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, MenuItem, Chip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import { getOrders, saveOrders } from "../utils/orders";
import { addAuditEntry } from "../utils/audit";
import { addOrderFirestore, getOrdersFirestore, onOrdersChange, deleteOrderFirestore } from '../utils/firestoreOrders';

const statusList = ["جديد", "قيد التنفيذ", "تم التوصيل"];

// جلب بيانات الأدمن الحالي مع الصلاحيات
function getCurrentAdmin() {
  const admins = JSON.parse(localStorage.getItem("admins") || "[]");
  const username = localStorage.getItem("username") || "admin";
  return admins.find(a => a.username === username) || { role: "superadmin", permissions: ["delete_order","edit_order","change_status","clear_orders"] };
}

function hasPermission(perm) {
  const admin = getCurrentAdmin();
  return admin.role === "superadmin" || (admin.permissions && admin.permissions.includes(perm));
}

function getCurrentAdminName() {
  return localStorage.getItem("username") || "admin";
}

function OrdersAdmin() {
  const [orders, setOrders] = useState([]);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });
  const [confirm, setConfirm] = useState({ open: false, idx: -1 });
  const [confirmClear, setConfirmClear] = useState(false);
  const [lastOrderCount, setLastOrderCount] = useState(0);
  const username = getCurrentAdminName();

  useEffect(() => {
    // مزامنة الطلبات مع Firestore
    const unsub = onOrdersChange(username, setOrders);
    getOrdersFirestore(username).then(setOrders);
    return () => unsub();
  }, [username]);

  useEffect(() => {
    const orders = getOrders();
    if (lastOrderCount && orders.length > lastOrderCount) {
      setSnack({ open: true, message: 'تم إضافة طلب جديد!', severity: 'success' });
    }
    setLastOrderCount(orders.length);
    const interval = setInterval(() => {
      const updatedOrders = getOrders();
      if (updatedOrders.length > lastOrderCount) {
        setSnack({ open: true, message: 'تم إضافة طلب جديد!', severity: 'success' });
        setLastOrderCount(updatedOrders.length);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [lastOrderCount]);

  const handleStatusChange = (idx, newStatus) => {
    if (!hasPermission("change_status")) {
      setSnack({ open: true, message: "ليس لديك صلاحية تغيير حالة الطلب.", severity: "error" });
      return;
    }
    const oldStatus = orders[idx].status || "جديد";
    const updated = orders.map((o, i) => i === idx ? { ...o, status: newStatus } : o);
    setOrders(updated);
    saveOrders(updated);
    addAuditEntry({
      action: "status-change",
      orderId: updated[idx].id || idx + 1,
      username: getCurrentAdminName(),
      details: `من (${oldStatus}) إلى (${newStatus})`
    });
    setSnack({ open: true, message: `تم تحديث حالة الطلب (${updated[idx].id || idx + 1}) إلى: ${newStatus}`, severity: "success" });
    // إشعار للمستخدم إذا الطلب "تم التوصيل"
    if (newStatus === "تم التوصيل") {
      localStorage.setItem("userOrderDelivered", JSON.stringify({ orderId: updated[idx].id || idx + 1, time: new Date().toLocaleString() }));
    }
  };

  const handleDelete = idx => {
    if (!hasPermission("delete_order")) {
      setSnack({ open: true, message: "ليس لديك صلاحية حذف الطلبات.", severity: "error" });
      return;
    }
    setConfirm({ open: true, idx });
  };
  const handleConfirmDelete = () => {
    const idx = confirm.idx;
    const deletedId = orders[idx]?.id || idx + 1;
    addAuditEntry({
      action: "delete",
      orderId: deletedId,
      username: getCurrentAdminName(),
      details: `حذف الطلب بالكامل`
    });
    const updated = orders.filter((_, i) => i !== idx);
    saveOrders(updated);
    setOrders(updated);
    deleteOrderFirestore(deletedId);
    setSnack({ open: true, message: `تم حذف الطلب رقم (${deletedId}) بنجاح`, severity: "info" });
    setConfirm({ open: false, idx: -1 });
  };

  // زر مسح الطلبات القديمة
  const handleClearOrders = () => {
    if (!hasPermission("clear_orders")) {
      setSnack({ open: true, message: "ليس لديك صلاحية مسح جميع الطلبات.", severity: "error" });
      return;
    }
    addAuditEntry({
      action: "delete",
      orderId: "ALL",
      username: getCurrentAdminName(),
      details: `مسح جميع الطلبات من النظام`
    });
    saveOrders([]);
    setOrders([]);
    setSnack({ open: true, message: "تم مسح جميع الطلبات بنجاح", severity: "warning" });
    setConfirmClear(false);
  };

  const handleManualSave = () => {
    saveOrders(orders);
    setSnack({ open: true, message: "تم حفظ الطلبات يدوياً في التخزين المحلي.", severity: "success" });
  };

  const getNextStatus = status => {
    switch (status) {
      case "جديد":
        return "قيد التنفيذ";
      case "قيد التنفيذ":
        return "تم التوصيل";
      default:
        return "جديد";
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6, background: 'linear-gradient(135deg, #f8fafc 60%, #e3ffe6 100%)', borderRadius: 6, boxShadow: 8, p: 4 }}>
      <Typography variant="h4" align="center" sx={{ mb: 4, color: '#2196f3', fontWeight: 800, letterSpacing: 2 }}>
        إدارة الطلبات
      </Typography>
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button variant="contained" color="success" sx={{ borderRadius: 3, fontWeight: 700, px: 4, py: 1.2, fontSize: 17, boxShadow: 4 }} onClick={handleManualSave}>
          حفظ الطلبات يدوياً
        </Button>
        <Button variant="contained" color="error" sx={{ borderRadius: 3, fontWeight: 700, px: 4, py: 1.2, fontSize: 17, boxShadow: 4 }} onClick={() => setConfirmClear(true)}>
          حذف جميع الطلبات
        </Button>
      </Box>
      <Table sx={{ background: '#fff', borderRadius: 4, boxShadow: 4 }}>
        <TableHead>
          <TableRow sx={{ background: '#f0f8ff' }}>
            <TableCell sx={{ fontWeight: 700, fontSize: 17 }}>رقم الطلب</TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: 17 }}>المنتجات</TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: 17 }}>الإجمالي</TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: 17 }}>الحالة</TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: 17 }}>إجراءات</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow><TableCell colSpan={5}><Typography>لا توجد طلبات بعد.</Typography></TableCell></TableRow>
          ) : orders.map((order, idx) => (
            <TableRow key={idx} sx={{ ':hover': { background: '#e3ffe6' } }}>
              <TableCell>{order.id || idx + 1}</TableCell>
              <TableCell>{order.items?.map(item => item.name).join(', ')}</TableCell>
              <TableCell sx={{ color: '#43e97b', fontWeight: 700 }}>{order.total} ريال</TableCell>
              <TableCell>
                <Chip label={order.status} color={order.status === 'تم التوصيل' ? 'success' : order.status === 'قيد التنفيذ' ? 'warning' : 'primary'} sx={{ fontWeight: 700, fontSize: 15 }} />
              </TableCell>
              <TableCell>
                <Button variant="outlined" color="primary" sx={{ mr: 1, fontWeight: 700, borderRadius: 2 }} onClick={() => handleStatusChange(idx, getNextStatus(order.status))}>
                  تغيير الحالة
                </Button>
                <IconButton color="error" onClick={() => handleDelete(idx)}><DeleteIcon /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={confirm.open} onClose={() => setConfirm({ open: false, idx: -1 })}>
        <DialogTitle>تأكيد الحذف</DialogTitle>
        <DialogContent>
          <Typography>هل أنت متأكد أنك تريد حذف هذا الطلب؟</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirm({ open: false, idx: -1 })}>إلغاء</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">حذف</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirmClear} onClose={() => setConfirmClear(false)}>
        <DialogTitle>تأكيد مسح جميع الطلبات</DialogTitle>
        <DialogContent>
          <Typography>هل أنت متأكد أنك تريد مسح جميع الطلبات؟ هذا الإجراء لا يمكن التراجع عنه.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmClear(false)}>إلغاء</Button>
          <Button onClick={handleClearOrders} color="error" variant="contained">مسح الكل</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snack.open} autoHideDuration={2200} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setSnack({ ...snack, open: false })} severity={snack.severity} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default OrdersAdmin;
