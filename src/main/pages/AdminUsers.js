import React, { useState, useEffect } from "react";
import { Container, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Paper, Box, Snackbar, Alert, Select, MenuItem, Checkbox, FormControlLabel, Switch, Chip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LockResetIcon from "@mui/icons-material/LockReset";

const ADMINS_KEY = "admins";
const ROLES = ["superadmin", "manager", "viewer"];
const PERMISSIONS = {
  "delete_order": "حذف الطلبات",
  "edit_order": "تعديل الطلبات",
  "change_status": "تغيير حالة الطلب",
  "clear_orders": "مسح جميع الطلبات",
  "add_product": "إضافة منتج",
  "edit_product": "تعديل منتج",
  "delete_product": "حذف منتج"
};
const PERMISSIONS_AR = {
  "delete_order": "حذف الطلبات",
  "edit_order": "تعديل الطلبات",
  "change_status": "تغيير حالة الطلب",
  "clear_orders": "مسح جميع الطلبات",
  "add_product": "إضافة منتج",
  "edit_product": "تعديل منتج",
  "delete_product": "حذف منتج"
};

function getAdmins() {
  const data = localStorage.getItem(ADMINS_KEY);
  const fallback = [{ username: "admin", password: "1234", role: "superadmin", permissions: Object.keys(PERMISSIONS), lastLogin: new Date().toLocaleString(), active: true }];
  let admins = data ? JSON.parse(data) : fallback;
  admins = admins.map(a => ({
    ...a,
    permissions: Array.isArray(a.permissions)
      ? a.permissions
      : (a.role === "superadmin" ? Object.keys(PERMISSIONS) : []),
    lastLogin: a.lastLogin || '',
    active: typeof a.active === 'boolean' ? a.active : true
  }));
  return admins;
}

function saveAdmins(admins) {
  localStorage.setItem(ADMINS_KEY, JSON.stringify(admins));
}

function AdminUsers() {
  const [admins, setAdmins] = useState([]);
  const [open, setOpen] = useState(false);
  const [editIdx, setEditIdx] = useState(-1);
  const [form, setForm] = useState({ username: "", password: "", role: "manager", permissions: [] });
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });
  const [confirm, setConfirm] = useState({ open: false, idx: -1 });
  const [resetPwd, setResetPwd] = useState({ open: false, idx: -1, password: "" });

  useEffect(() => {
    setAdmins(getAdmins());
  }, []);

  const handleOpen = (idx = -1) => {
    setEditIdx(idx);
    setForm(idx > -1 ? admins[idx] : { username: "", password: "", role: "manager", permissions: [] });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePermissionChange = perm => {
    setForm(f => {
      const has = f.permissions.includes(perm);
      return {
        ...f,
        permissions: has ? f.permissions.filter(p => p !== perm) : [...f.permissions, perm]
      };
    });
  };

  const handleSave = () => {
    if (!form.username || !form.password || !form.role) {
      setSnack({ open: true, message: "يرجى تعبئة جميع الحقول", severity: "error" });
      return;
    }
    let updated;
    if (editIdx > -1) {
      // منع تغيير صلاحية الأدمن الرئيسي
      if (admins[editIdx].username === "admin" && form.role !== "superadmin") {
        setSnack({ open: true, message: "لا يمكن تغيير صلاحية الأدمن الرئيسي", severity: "error" });
        return;
      }
      updated = admins.map((a, i) => i === editIdx ? form : a);
      setSnack({ open: true, message: "تم تعديل بيانات الأدمن", severity: "success" });
    } else {
      if (admins.some(a => a.username === form.username)) {
        setSnack({ open: true, message: "اسم المستخدم موجود مسبقًا", severity: "error" });
        return;
      }
      updated = [...admins, form];
      setSnack({ open: true, message: "تمت إضافة أدمن جديد", severity: "success" });
    }
    setAdmins(updated);
    saveAdmins(updated);
    setOpen(false);
  };

  const handleDelete = idx => {
    if (admins[idx].username === "admin") {
      setSnack({ open: true, message: "لا يمكن حذف الأدمن الرئيسي", severity: "error" });
      return;
    }
    setConfirm({ open: true, idx });
  };
  const handleConfirmDelete = () => {
    const idx = confirm.idx;
    const updated = admins.filter((_, i) => i !== idx);
    setAdmins(updated);
    saveAdmins(updated);
    setSnack({ open: true, message: "تم حذف الأدمن بنجاح", severity: "info" });
    setConfirm({ open: false, idx: -1 });
  };

  const handleOpenResetPwd = idx => {
    setResetPwd({ open: true, idx, password: "" });
  };
  const handleResetPwd = () => {
    const idx = resetPwd.idx;
    const updated = admins.map((a, i) => i === idx ? { ...a, password: resetPwd.password } : a);
    setAdmins(updated);
    saveAdmins(updated);
    setResetPwd({ open: false, idx: -1, password: "" });
    setSnack({ open: true, message: "تم تغيير كلمة المرور بنجاح", severity: "success" });
  };

  const handleToggleActive = idx => {
    const updated = [...admins];
    updated[idx].active = !updated[idx].active;
    saveAdmins(updated);
    setAdmins(updated);
    setSnack({ open: true, message: updated[idx].active ? 'تم تفعيل الأدمن' : 'تم تعطيل الأدمن', severity: 'info' });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ color: '#2196f3', fontWeight: 700 }}>إدارة الأدمن</Typography>
          <Button variant="contained" color="success" sx={{ fontWeight: 600, borderRadius: 2 }} onClick={() => handleOpen()}>إضافة أدمن</Button>
        </Box>
        <Table sx={{ background: '#f8fafd', borderRadius: 3 }}>
          <TableHead>
            <TableRow>
              <TableCell>اسم الأدمن</TableCell>
              <TableCell>الصلاحيات</TableCell>
              <TableCell>آخر دخول</TableCell>
              <TableCell>الحالة</TableCell>
              <TableCell>الخيارات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {admins.map((admin, idx) => (
              <TableRow key={admin.username}>
                <TableCell>{admin.username}</TableCell>
                <TableCell>{admin.permissions.map(p => <Chip key={p} label={PERMISSIONS_AR[p] || p} color="primary" sx={{ mr: 1, mb: 1 }} />)}</TableCell>
                <TableCell>{admin.lastLogin || '-'}</TableCell>
                <TableCell>
                  <Switch checked={admin.active} onChange={() => handleToggleActive(idx)} color="success" />
                  {admin.active ? 'مفعل' : 'معطل'}
                </TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpen(idx)}><EditIcon /></IconButton>
                  <IconButton color="warning" onClick={() => handleOpenResetPwd(idx)}><LockResetIcon /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(idx)} disabled={admin.username === "admin"}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editIdx > -1 ? "تعديل الأدمن" : "إضافة أدمن جديد"}</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="اسم المستخدم" name="username" value={form.username} onChange={handleChange} fullWidth required sx={{ background: '#f8fafd', borderRadius: 2 }} disabled={editIdx > -1} />
          <TextField margin="dense" label="كلمة المرور" name="password" value={form.password} onChange={handleChange} type="password" fullWidth required sx={{ background: '#f8fafd', borderRadius: 2 }} />
          <Select margin="dense" label="الصلاحية" name="role" value={form.role} onChange={handleChange} fullWidth sx={{ mt: 2, background: '#f8fafd', borderRadius: 2 }}>
            {ROLES.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
          </Select>
          <Box sx={{ mt: 2 }}>
            <Typography sx={{ fontWeight: 700, mb: 1 }}>الصلاحيات التفصيلية:</Typography>
            {Object.entries(PERMISSIONS).map(([perm, label]) => (
              <FormControlLabel
                key={perm}
                control={<Checkbox checked={form.permissions.includes(perm)} onChange={() => handlePermissionChange(perm)} />}
                label={label}
                disabled={form.role === "superadmin"}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>إلغاء</Button>
          <Button onClick={handleSave} variant="contained" color="success">حفظ</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirm.open} onClose={() => setConfirm({ open: false, idx: -1 })}>
        <DialogTitle>تأكيد الحذف</DialogTitle>
        <DialogContent>
          <Typography>هل أنت متأكد أنك تريد حذف هذا الأدمن؟</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirm({ open: false, idx: -1 })}>إلغاء</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">حذف</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={resetPwd.open} onClose={() => setResetPwd({ open: false, idx: -1, password: "" })}>
        <DialogTitle>تغيير كلمة المرور</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="كلمة المرور الجديدة" value={resetPwd.password} onChange={e => setResetPwd({ ...resetPwd, password: e.target.value })} type="password" fullWidth required />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetPwd({ open: false, idx: -1, password: "" })}>إلغاء</Button>
          <Button onClick={handleResetPwd} variant="contained" color="success">تغيير</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snack.open} autoHideDuration={2500} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setSnack({ ...snack, open: false })} severity={snack.severity} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default AdminUsers;
