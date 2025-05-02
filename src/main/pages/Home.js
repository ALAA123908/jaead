import React, { useEffect, useState } from "react";
import { Button, Container, Typography, Grid, Card, CardContent, CardMedia, CardActions, Box, Snackbar, Alert, Chip, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../utils/storage";
import { getCart, saveCart } from "../utils/cart";
import { getWishlist, saveWishlist } from '../utils/storage';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const PERMISSIONS_AR = {
  // add your permissions translations here
};

const MAX_CART_ITEMS = 50;
const MAX_WISHLIST_ITEMS = 50;

function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'info' });
  const [adminPerms, setAdminPerms] = useState([]);
  const [adminName, setAdminName] = useState([]);
  const [wishlist, setWishlist] = useState(getWishlist());

  useEffect(() => {
    setProducts(getProducts());
    setCart(getCart());
    const admins = JSON.parse(localStorage.getItem('admins') || '[]');
    const username = localStorage.getItem('username');
    const admin = admins.find(a => a.username === username);
    if (admin) {
      setAdminName(admin.name || admin.username);
      setAdminPerms(admin.permissions || []);
      setSnack({ open: true, message: `مرحباً ${admin.name || admin.username}! صلاحياتك: ${ (admin.permissions || []).map(p => PERMISSIONS_AR[p] || p).join('، ') }`, severity: 'info' });
    }
  }, []);

  const handleAddToCart = (product) => {
    if (cart.length >= MAX_CART_ITEMS) {
      setSnack({ open: true, message: `لا يمكنك إضافة أكثر من ${MAX_CART_ITEMS} منتجًا في السلة.`, severity: 'error' });
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

  const toggleWishlist = (product) => {
    let updated;
    try {
      if (wishlist.length >= MAX_WISHLIST_ITEMS) {
        setSnack({ open: true, message: `لا يمكنك إضافة أكثر من ${MAX_WISHLIST_ITEMS} منتجًا في المفضلة.`, severity: 'error' });
        return;
      }
      if (wishlist.some(item => item.name === product.name)) {
        updated = wishlist.filter(item => item.name !== product.name);
        saveWishlist(updated);
        setWishlist(updated);
        setSnack({ open: true, message: 'تمت إزالة المنتج من المفضلة', severity: 'info' });
      } else {
        updated = [...wishlist, product];
        saveWishlist(updated);
        setWishlist(updated);
        setSnack({ open: true, message: 'تمت إضافة المنتج إلى المفضلة', severity: 'success' });
      }
    } catch (e) {
      setSnack({ open: true, message: e.message || 'خطأ في حفظ المفضلة', severity: 'error' });
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 6, mb: 6, background: 'linear-gradient(135deg, #f8fafc 60%, #e3ffe6 100%)', borderRadius: 6, boxShadow: 8, p: 4 }}>
      <Typography variant="h3" align="center" gutterBottom sx={{ color: '#2196f3', fontWeight: 800, letterSpacing: 2, mb: 4 }}>
        مرحباً بك في Jawad Market
      </Typography>
      {adminPerms.length > 0 && (
        <Box sx={{ mt: 2, mb: 2 }}>
          <Typography variant="subtitle1">صلاحياتك:</Typography>
          {adminPerms.map(p => <Chip key={p} label={PERMISSIONS_AR[p] || p} color="primary" sx={{ mr: 1, mb: 1 }} />)}
        </Box>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, my: 3 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ width: 180, fontWeight: 600, borderRadius: 3, boxShadow: 2 }}
          onClick={() => navigate("/cart")}
        >
          الذهاب إلى السلة
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          sx={{ width: 180, fontWeight: 600, borderRadius: 3, boxShadow: 2 }}
          onClick={() => navigate("/admin")}
        >
          لوحة تحكم الإدارة
        </Button>
      </Box>
      <Grid container spacing={4} alignItems="stretch">
        {products.length === 0 && (
          <Grid item xs={12}><Typography>لا توجد منتجات متاحة حالياً.</Typography></Grid>
        )}
        {products.map((product, idx) => (
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
                <IconButton onClick={() => toggleWishlist(product)} color={wishlist.some(item => item.name === product.name) ? 'error' : 'default'}>
                  {wishlist.some(item => item.name === product.name) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
                <Chip label={product.stock <= 5 ? 'كمية محدودة' : 'جديد'} color={product.stock <= 5 ? 'error' : 'success'} sx={{ fontWeight: 700, borderRadius: 2, fontSize: 13, px: 2 }} />
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

export default Home;
