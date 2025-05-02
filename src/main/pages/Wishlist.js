import React, { useEffect, useState } from "react";
import { Container, Typography, Grid, Card, CardContent, CardMedia, CardActions, Button, IconButton, Snackbar, Alert, Chip, Box } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate } from "react-router-dom";
import { getWishlist, saveWishlist } from "../utils/storage";
import { getCart, saveCart } from "../utils/cart";
import { saveWishlistFirestore, getWishlistFirestore, onWishlistChange } from '../utils/firestoreWishlist';

function Wishlist() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState(getWishlist());
  const [cart, setCart] = useState(getCart());
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'info' });
  const username = localStorage.getItem("username") || "guest";

  useEffect(() => {
    // مزامنة المفضلة مع Firestore
    const unsub = onWishlistChange(username, setWishlist);
    getWishlistFirestore(username).then(setWishlist);
    return () => unsub();
  }, [username]);

  const removeFromWishlist = (product) => {
    const updated = wishlist.filter(item => item.name !== product.name);
    setWishlist(updated);
    saveWishlistFirestore(username, updated);
    setSnack({ open: true, message: 'تمت إزالة المنتج من المفضلة', severity: 'info' });
  };

  const handleAddToCart = (product) => {
    if (cart.some(item => item.name === product.name)) {
      setSnack({ open: true, message: 'المنتج موجود بالفعل في السلة', severity: 'warning' });
      return;
    }
    try {
      const updated = [...cart, { ...product, qty: 1 }];
      saveCart(updated);
      setCart(updated);
      setSnack({ open: true, message: 'تمت إضافة المنتج إلى السلة', severity: 'success' });
    } catch (e) {
      setSnack({ open: true, message: 'عذراً، مساحة السلة ممتلئة! يرجى حذف بعض المنتجات أو تقليل الكمية.', severity: 'error' });
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 6, mb: 6, background: 'linear-gradient(135deg, #fff0f6 60%, #e3ffe6 100%)', borderRadius: 6, boxShadow: 8, p: 4 }}>
      <Typography variant="h3" align="center" gutterBottom sx={{ color: '#e91e63', fontWeight: 800, letterSpacing: 2, mb: 4 }}>
        قائمة المفضلة ♥
      </Typography>
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Button variant="outlined" color="primary" sx={{ fontWeight: 700, borderRadius: 3, px: 4 }} onClick={() => navigate("/")}>عودة للمنتجات</Button>
      </Box>
      <Grid container spacing={4} alignItems="stretch">
        {wishlist.length === 0 && (
          <Grid item xs={12}><Typography>لا توجد منتجات في قائمة المفضلة.</Typography></Grid>
        )}
        {wishlist.map((product, idx) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
            <Card sx={{ borderRadius: 5, boxShadow: 8, transition: '0.22s', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', ':hover': { boxShadow: 16, transform: 'scale(1.035)' } }}>
              <CardMedia component="img" height="220" image={product.image} alt={product.name} sx={{ objectFit: 'cover', borderRadius: '20px 20px 0 0', background: '#fff', borderBottom: '1px solid #f0f0f0' }} />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#222', mb: 1, fontSize: 22 }}>{product.name}</Typography>
                <Typography variant="body1" sx={{ color: '#43e97b', fontWeight: 700, fontSize: 18 }}>{product.price} ريال</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>{product.category}</Typography>
                <Typography variant="body2" sx={{ color: product.stock <= 5 ? 'red' : '#888', fontWeight: 700 }}>
                  {product.stock !== undefined ? `المتبقي في المخزون: ${product.stock}` : ''}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Button variant="contained" color="primary" sx={{ borderRadius: 3, fontWeight: 700, px: 3, fontSize: 17, boxShadow: 3 }} onClick={() => handleAddToCart(product)} disabled={product.stock === 0}>
                  {product.stock === 0 ? 'غير متوفر' : 'أضف للسلة'}
                </Button>
                <IconButton onClick={() => removeFromWishlist(product)} color="error">
                  <FavoriteIcon />
                </IconButton>
                <Chip label={product.stock <= 5 ? 'كمية محدودة' : 'مفضل'} color={product.stock <= 5 ? 'error' : 'success'} sx={{ fontWeight: 700, borderRadius: 2, fontSize: 13, px: 2 }} />
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Snackbar open={snack.open} autoHideDuration={3500} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setSnack({ ...snack, open: false })} severity={snack.severity} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Wishlist;
