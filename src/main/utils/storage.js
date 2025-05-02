// أدوات التعامل مع localStorage للمنتجات
// إضافة دعم المخزون وحفظ المنتجات المفضلة

export function getProducts() {
  const data = localStorage.getItem('products');
  return data ? JSON.parse(data) : [];
}

export function saveProducts(products) {
  localStorage.setItem('products', JSON.stringify(products));
}

export function getWishlist() {
  const data = localStorage.getItem('wishlist');
  return data ? JSON.parse(data) : [];
}

export function saveWishlist(wishlist) {
  try {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  } catch (e) {
    if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
      // رمي الخطأ ليتم التعامل معه في الواجهة
      throw new Error('عذراً، مساحة قائمة المفضلة ممتلئة! يرجى حذف بعض المنتجات من المفضلة.');
    } else {
      throw e;
    }
  }
}
