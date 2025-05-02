import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Box, IconButton, Snackbar, Alert } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { getProducts, saveProducts } from "../utils/storage";

// جلب بيانات الأدمن الحالي مع الصلاحيات
function getCurrentAdmin() {
  const admins = JSON.parse(localStorage.getItem("admins") || "[]");
  const username = localStorage.getItem("username") || "admin";
  return admins.find(a => a.username === username) || { role: "superadmin", permissions: ["add_product","edit_product","delete_product"] };
}

function hasPermission(perm) {
  const admin = getCurrentAdmin();
  return admin.role === "superadmin" || (admin.permissions && admin.permissions.includes(perm));
}

function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editIdx, setEditIdx] = useState(-1);
  const [form, setForm] = useState({ name: "", price: "", category: "", image: "" });
  const [snack, setSnack] = useState({ open: false, message: "", severity: "error" });
  const [confirm, setConfirm] = useState({ open: false, idx: -1 });
  const admin = getCurrentAdmin();

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const handleOpen = (idx = -1) => {
    if (idx === -1 && !hasPermission("add_product")) {
      setSnack({ open: true, message: "ليس لديك صلاحية إضافة المنتجات.", severity: "error" });
      return;
    }
    if (idx > -1 && !hasPermission("edit_product")) {
      setSnack({ open: true, message: "ليس لديك صلاحية تعديل المنتجات.", severity: "error" });
      return;
    }
    setEditIdx(idx);
    setForm(idx > -1 ? products[idx] : { name: "", price: "", category: "", image: "" });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  // تحويل صورة إلى base64
  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setForm(f => ({ ...f, image: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (editIdx === -1 && !hasPermission("add_product")) {
      setSnack({ open: true, message: "ليس لديك صلاحية إضافة المنتجات.", severity: "error" });
      return;
    }
    if (editIdx > -1 && !hasPermission("edit_product")) {
      setSnack({ open: true, message: "ليس لديك صلاحية تعديل المنتجات.", severity: "error" });
      return;
    }
    if (!form.name || !form.price || !form.category) {
      setSnack({ open: true, message: "يرجى تعبئة جميع الحقول المطلوبة", severity: "error" });
      return;
    }
    let updated;
    if (editIdx > -1) {
      updated = products.map((p, i) => i === editIdx ? form : p);
      setSnack({ open: true, message: `تم تعديل المنتج (${form.name}) بنجاح`, severity: "success" });
    } else {
      updated = [...products, form];
      setSnack({ open: true, message: `تمت إضافة المنتج (${form.name}) بنجاح`, severity: "success" });
    }
    setProducts(updated);
    saveProducts(updated);
    setOpen(false);
  };

  const handleDelete = idx => {
    if (!hasPermission("delete_product")) {
      setSnack({ open: true, message: "ليس لديك صلاحية حذف المنتجات.", severity: "error" });
      return;
    }
    setConfirm({ open: true, idx });
  };
  const handleConfirmDelete = () => {
    const idx = confirm.idx;
    const deletedName = products[idx]?.name;
    const updated = products.filter((_, i) => i !== idx);
    setProducts(updated);
    saveProducts(updated);
    setSnack({ open: true, message: `تم حذف المنتج (${deletedName}) بنجاح`, severity: "info" });
    setConfirm({ open: false, idx: -1 });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6, background: 'linear-gradient(135deg, #f8fafc 60%, #e3ffe6 100%)', borderRadius: 6, boxShadow: 8, p: 4 }}>
      <Typography variant="h4" align="center" sx={{ mb: 4, color: '#2196f3', fontWeight: 800, letterSpacing: 2 }}>
        إدارة المنتجات
      </Typography>
      {hasPermission("add_product") && (
        <Button variant="contained" color="success" sx={{ mb: 3, borderRadius: 3, fontWeight: 700, px: 4, py: 1.2, fontSize: 17, boxShadow: 4 }} onClick={() => handleOpen(-1)}>
          إضافة منتج جديد
        </Button>
      )}
      <Table sx={{ background: '#fff', borderRadius: 4, boxShadow: 4 }}>
        <TableHead>
          <TableRow sx={{ background: '#f0f8ff' }}>
            <TableCell sx={{ fontWeight: 700, fontSize: 17 }}>اسم المنتج</TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: 17 }}>السعر</TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: 17 }}>التصنيف</TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: 17 }}>الصورة</TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: 17 }}>خيارات</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((prod, idx) => (
            <TableRow key={idx} sx={{ ':hover': { background: '#e3ffe6' } }}>
              <TableCell sx={{ fontWeight: 600 }}>{prod.name}</TableCell>
              <TableCell sx={{ color: '#43e97b', fontWeight: 700 }}>{prod.price} ريال</TableCell>
              <TableCell>{prod.category}</TableCell>
              <TableCell>{prod.image ? <img src={prod.image} alt={prod.name} style={{ width: 50, height: 50, objectFit: 'contain', borderRadius: 8, background: '#fff', border: '1px solid #e0e0e0' }} /> : '-'}</TableCell>
              <TableCell>
                {hasPermission("edit_product") && (
                  <IconButton color="primary" onClick={() => handleOpen(idx)}><EditIcon /></IconButton>
                )}
                {hasPermission("delete_product") && (
                  <IconButton color="error" onClick={() => handleDelete(idx)}><DeleteIcon /></IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editIdx > -1 ? "تعديل المنتج" : "إضافة منتج جديد"}</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="اسم المنتج" name="name" value={form.name} onChange={handleChange} fullWidth required sx={{ background: '#f8fafd', borderRadius: 2 }} />
          <TextField margin="dense" label="السعر" name="price" value={form.price} onChange={handleChange} fullWidth required sx={{ background: '#f8fafd', borderRadius: 2 }} />
          <TextField margin="dense" label="التصنيف" name="category" value={form.category} onChange={handleChange} fullWidth required sx={{ background: '#f8fafd', borderRadius: 2 }} />
          <Box sx={{ mt: 2 }}>
            <Button variant="outlined" component="label" sx={{ borderRadius: 2 }}>
              رفع صورة المنتج
              <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
            </Button>
            {form.image && (
              <Box sx={{ mt: 1 }}>
                <img src={form.image} alt="صورة المنتج" style={{ width: 60, height: 60, objectFit: 'contain', borderRadius: 8, background: '#fff' }} />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>إلغاء</Button>
          {hasPermission("add_product") || hasPermission("edit_product") ? (
            <Button onClick={handleSave} variant="contained" color="success">حفظ</Button>
          ) : (
            <Button variant="contained" color="success" disabled>حفظ</Button>
          )}
        </DialogActions>
      </Dialog>
      <Dialog open={confirm.open} onClose={() => setConfirm({ open: false, idx: -1 })}>
        <DialogTitle>تأكيد الحذف</DialogTitle>
        <DialogContent>
          <Typography>هل أنت متأكد أنك تريد حذف هذا المنتج؟</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirm({ open: false, idx: -1 })}>إلغاء</Button>
          {hasPermission("delete_product") ? (
            <Button onClick={handleConfirmDelete} color="error" variant="contained">حذف</Button>
          ) : (
            <Button color="error" variant="contained" disabled>حذف</Button>
          )}
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

export default ProductsAdmin;
