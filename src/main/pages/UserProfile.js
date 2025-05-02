import React, { useState, useEffect, useRef } from "react";
import { Container, Typography, TextField, Button, Paper, Box, Avatar, Snackbar, Alert } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router-dom";

const USER_KEY = "user_profile";

function getCurrentUsername() {
  return localStorage.getItem("username") || "";
}

function getProfile() {
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : {};
}

function saveProfile(profile) {
  localStorage.setItem(USER_KEY, JSON.stringify(profile));
}

function UserProfile() {
  const username = getCurrentUsername();
  const [profile, setProfile] = useState({ username, name: "", phone: "", avatar: "", signature: "" });
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });
  const fileInput = useRef();
  const signInput = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const data = getProfile();
    if (data && data.username === username) {
      setProfile(data);
    }
  }, [username]);

  const handleChange = e => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setProfile(p => ({ ...p, avatar: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSignatureChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setProfile(p => ({ ...p, signature: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    saveProfile(profile);
    setSnack({ open: true, message: "تم حفظ بياناتك بنجاح!", severity: "success" });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Button startIcon={<ArrowBackIcon />} variant="text" sx={{ mb: 2 }} onClick={() => navigate(-1)}>
        العودة
      </Button>
      <Paper sx={{ p: 4, borderRadius: 4, boxShadow: 4 }}>
        <Typography variant="h4" sx={{ color: '#2196f3', fontWeight: 700, mb: 3 }}>الملف الشخصي</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar src={profile.avatar} sx={{ width: 80, height: 80, mb: 2 }} />
          <Button variant="outlined" component="label" sx={{ mb: 2 }}>
            رفع صورة شخصية
            <input type="file" accept="image/*" hidden onChange={handleAvatarChange} ref={fileInput} />
          </Button>
        </Box>
        <TextField label="اسم المستخدم" value={profile.username} fullWidth margin="normal" disabled />
        <TextField label="الاسم الكامل" name="name" value={profile.name} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="رقم الجوال" name="phone" value={profile.phone} onChange={handleChange} fullWidth margin="normal" />
        <Box sx={{ mt: 2, mb: 2 }}>
          {profile.signature && <img src={profile.signature} alt="التوقيع" style={{ maxWidth: 180, display: 'block', marginBottom: 8 }} />}
          <Button variant="outlined" component="label">
            رفع توقيع (صورة)
            <input type="file" accept="image/*" hidden onChange={handleSignatureChange} ref={signInput} />
          </Button>
        </Box>
        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2, fontWeight: 600 }} onClick={handleSave}>حفظ التعديلات</Button>
      </Paper>
      <Snackbar open={snack.open} autoHideDuration={2500} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setSnack({ ...snack, open: false })} severity={snack.severity} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default UserProfile;
