// أدوات التعامل مع الطلبات في localStorage
export function getOrders() {
  const data = localStorage.getItem('orders');
  return data ? JSON.parse(data) : [];
}

// حفظ الطلبات مع معالجة الخطأ في حال امتلاء localStorage
export function saveOrders(orders) {
  try {
    localStorage.setItem('orders', JSON.stringify(orders));
  } catch (e) {
    if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
      alert('عذراً، مساحة التخزين ممتلئة! يرجى حذف بعض الطلبات القديمة أو التواصل مع الدعم.');
    } else {
      throw e;
    }
  }
}

export function addOrder(order) {
  const orders = getOrders();
  // إذا زاد عدد الطلبات عن 100، احذف الأقدم تلقائياً (يمكنك تعديل الرقم)
  if (orders.length >= 100) {
    orders.shift();
  }
  orders.push(order);
  saveOrders(orders);
}
