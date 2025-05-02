import { getOrders } from "./orders";
import { getProducts } from "./storage";

export function getStats() {
  const orders = getOrders();
  const products = getProducts();
  const totalSales = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const productCounts = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      productCounts[item.name] = (productCounts[item.name] || 0) + item.qty;
    });
  });
  const topProducts = Object.entries(productCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, qty]) => ({ name, qty }));
  return {
    totalOrders: orders.length,
    totalSales,
    topProducts,
    productsCount: products.length
  };
}
