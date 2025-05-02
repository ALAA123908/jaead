// أدوات التعامل مع localStorage للسلة
export function getCart() {
  const data = localStorage.getItem('cart');
  return data ? JSON.parse(data) : [];
}

// حفظ السلة مع معالجة خطأ امتلاء localStorage
export function saveCart(cart) {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (e) {
    if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
      alert('عذراً، مساحة السلة ممتلئة! يرجى حذف بعض المنتجات من السلة أو تقليل الكمية.');
    } else {
      throw e;
    }
  }
}

export function clearCart() {
  localStorage.removeItem('cart');
}
