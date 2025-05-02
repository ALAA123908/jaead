import React, { useEffect, useState } from "react";
import { Container, Typography, Button, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField, Paper, Box, Snackbar, Alert } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router-dom";
import { getCart, saveCart, clearCart } from "../utils/cart";
import { saveCartFirestore, getCartFirestore, onCartChange } from '../utils/firestoreCart';

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [snack, setSnack] = useState({ open: false, message: "" });
  const username = localStorage.getItem("username") || "guest";

  useEffect(() => {
    // مزامنة السلة مع Firestore
    const unsub = onCartChange(username, setCart);
    getCartFirestore(username).then(setCart);
    return () => unsub();
  }, [username]);

  const updateQty = (idx, qty) => {
    const updated = cart.map((item, i) => i === idx ? { ...item, qty: Math.max(1, Number(qty)) } : item);
    setCart(updated);
    saveCartFirestore(username, updated);
  };

  const handleDelete = idx => {
    const deletedName = cart[idx]?.name;
    const updated = cart.filter((_, i) => i !== idx);
    setCart(updated);
    saveCartFirestore(username, updated);
    setSnack({ open: true, message: `تم حذف ${deletedName} من السلة!` });
  };

  const total = cart.reduce((sum, item) => sum + (Number(item.price) * item.qty), 0);

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <Container maxWidth="md" sx={{ mt: 7, mb: 7, background: 'linear-gradient(135deg, #f8fafc 60%, #e3ffe6 100%)', borderRadius: 6, boxShadow: 8, p: 4 }}>
      <Typography variant="h4" align="center" sx={{ mb: 4, color: '#2196f3', fontWeight: 800, letterSpacing: 2 }}>
        سلة المشتريات
      </Typography>
      {cart.length === 0 ? (
        <Typography variant="body1">سلتك فارغة حاليًا.</Typography>
      ) : (
        <>
          <Table sx={{ background: '#fff', borderRadius: 4, boxShadow: 4 }}>
            <TableHead>
              <TableRow sx={{ background: '#f0f8ff' }}>
                <TableCell sx={{ fontWeight: 700, fontSize: 17 }}>المنتج</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 17 }}>السعر</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 17 }}>الكمية</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 17 }}>الإجمالي</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 17 }}>حذف</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cart.map((item, idx) => (
                <TableRow key={idx} sx={{ ':hover': { background: '#e3ffe6' } }}>
                  <TableCell sx={{ fontWeight: 600 }}>{item.name}</TableCell>
                  <TableCell sx={{ color: '#43e97b', fontWeight: 700 }}>{item.price} ريال</TableCell>
                  <TableCell>
                    <TextField type="number" value={item.qty} onChange={e => updateQty(idx, e.target.value)} size="small" sx={{ width: 70, borderRadius: 2, background: '#f8fafc' }} />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{item.price * item.qty} ريال</TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => handleDelete(idx)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box sx={{ my: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>الإجمالي: <span style={{ color: '#43e97b' }}>{cart.reduce((sum, item) => sum + (item.price * item.qty), 0)} ريال</span></Typography>
            <Button variant="contained" size="large" sx={{ fontWeight: 600, borderRadius: 3, px: 5, boxShadow: 4 }} onClick={handleCheckout}>
              إتمام الطلب
            </Button>
          </Box>
        </>
      )}
      <Snackbar open={snack.open} autoHideDuration={2000} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setSnack({ ...snack, open: false })} severity="info" sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Cart;
