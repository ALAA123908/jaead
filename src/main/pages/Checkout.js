import React, { useState } from "react";
import { Container, Typography, TextField, Button, Alert, Paper, Box } from "@mui/material";
import { getCart, clearCart } from "../utils/cart";
import { addOrder } from "../utils/orders";

function Checkout() {
  const [form, setForm] = useState({ name: "", address: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);
  const [cart] = useState(getCart());

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    addOrder({
      customer: form,
      items: cart,
      total: cart.reduce((sum, item) => sum + (Number(item.price) * item.qty), 0),
      status: "جديد",
      createdAt: new Date().toLocaleString()
    });
    clearCart();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Alert severity="success" sx={{ mb: 2, fontSize: 18, fontWeight: 600 }}>تم إرسال طلبك بنجاح! سنقوم بالتواصل معك قريبًا.</Alert>
      </Container>
    );
  }

  const total = cart.reduce((sum, item) => sum + (Number(item.price) * item.qty), 0);

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4, borderRadius: 4, boxShadow: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#2196f3', fontWeight: 700 }}>
          إتمام الطلب
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="الاسم" name="name" value={form.name} onChange={handleChange} margin="normal" required sx={{ background: '#f8fafd', borderRadius: 2 }} />
          <TextField fullWidth label="العنوان" name="address" value={form.address} onChange={handleChange} margin="normal" required sx={{ background: '#f8fafd', borderRadius: 2 }} />
          <TextField fullWidth label="رقم الهاتف" name="phone" value={form.phone} onChange={handleChange} margin="normal" required sx={{ background: '#f8fafd', borderRadius: 2 }} />
          <Box sx={{ my: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ fontWeight: 600 }}>عدد المنتجات: {cart.length}</Typography>
            <Typography sx={{ color: '#43e97b', fontWeight: 700 }}>الإجمالي: {total} ريال</Typography>
          </Box>
          <Button variant="contained" color="primary" type="submit" size="large" sx={{ fontWeight: 600, borderRadius: 3, px: 5 }}>
            تأكيد الطلب
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default Checkout;
