import React, { useState } from "react";
import { Container, Typography, TextField, Button, Paper, Box, Alert, Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { auth } from '../utils/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

const ADMIN_CREDENTIALS = { username: "admin", password: "1234" };

function getAdmins() {
  const data = localStorage.getItem("admins");
  return data ? JSON.parse(data) : [];
}

function updateLastLogin(username) {
  const admins = getAdmins();
  const idx = admins.findIndex(a => a.username === username);
  if (idx !== -1) {
    admins[idx].lastLogin = new Date().toLocaleString();
    localStorage.setItem("admins", JSON.stringify(admins));
  }
}

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'info' });
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
        setSnack({ open: true, message: 'تم إنشاء الحساب بنجاح! يمكنك تسجيل الدخول الآن.', severity: 'success' });
        setIsRegister(false);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setSnack({ open: true, message: 'تم تسجيل الدخول بنجاح!', severity: 'success' });
        // يمكنك إعادة التوجيه هنا أو حفظ بيانات المستخدم
      }
    } catch (error) {
      setSnack({ open: true, message: error.message, severity: 'error' });
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setSnack({ open: true, message: 'تم تسجيل الخروج.', severity: 'info' });
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10, background: 'linear-gradient(135deg, #e3ffe6 60%, #f8fafc 100%)', borderRadius: 6, boxShadow: 8, p: 4 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 4, background: 'transparent' }}>
        <Typography variant="h4" align="center" sx={{ mb: 3, color: '#2196f3', fontWeight: 800, letterSpacing: 2 }}>
          تسجيل الدخول
        </Typography>
        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: 16, margin: 'auto', maxWidth: 350 }}>
          <TextField label="البريد الإلكتروني" value={email} onChange={e => setEmail(e.target.value)} required fullWidth type="email" />
          <TextField label="كلمة المرور" value={password} onChange={e => setPassword(e.target.value)} required fullWidth type="password" />
          <Button type="submit" variant="contained" color="primary" sx={{ fontWeight: 700, fontSize: 18 }}>
            {isRegister ? 'تسجيل حساب جديد' : 'تسجيل الدخول'}
          </Button>
          <Button onClick={() => setIsRegister(r => !r)} color="secondary" sx={{ fontWeight: 600 }}>
            {isRegister ? 'لديك حساب؟ سجل دخولك' : 'ليس لديك حساب؟ سجل الآن'}
          </Button>
        </form>
        <Button onClick={handleLogout} color="error" sx={{ mt: 2, fontWeight: 700 }}>تسجيل الخروج</Button>
        <Snackbar open={snack.open} autoHideDuration={3500} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert onClose={() => setSnack({ ...snack, open: false })} severity={snack.severity} sx={{ width: '100%' }}>
            {snack.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
}

export default Login;
