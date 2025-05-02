// إدارة الطلبات باستخدام Firestore
import { db } from './firebase';
import { collection, doc, setDoc, getDoc, addDoc, onSnapshot, deleteDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';

const ORDERS_COLLECTION = 'orders';

export async function addOrderFirestore(order) {
  // order: { username, items, total, ... }
  await addDoc(collection(db, ORDERS_COLLECTION), order);
}

export async function getOrdersFirestore(username) {
  const q = query(collection(db, ORDERS_COLLECTION), where('username', '==', username));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
}

export function onOrdersChange(username, callback) {
  const q = query(collection(db, ORDERS_COLLECTION), where('username', '==', username));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })));
  });
}

export async function deleteOrderFirestore(orderId) {
  await deleteDoc(doc(db, ORDERS_COLLECTION, orderId));
}
