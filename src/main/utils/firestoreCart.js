// إدارة السلة باستخدام Firestore
import { db } from './firebase';
import { collection, doc, setDoc, getDoc, onSnapshot, updateDoc, deleteDoc } from 'firebase/firestore';

const CARTS_COLLECTION = 'carts';

export async function saveCartFirestore(username, cart) {
  await setDoc(doc(db, CARTS_COLLECTION, username), { cart });
}

export async function getCartFirestore(username) {
  const snap = await getDoc(doc(db, CARTS_COLLECTION, username));
  return snap.exists() ? snap.data().cart : [];
}

export function onCartChange(username, callback) {
  return onSnapshot(doc(db, CARTS_COLLECTION, username), (snap) => {
    callback(snap.exists() ? snap.data().cart : []);
  });
}

export async function clearCartFirestore(username) {
  await deleteDoc(doc(db, CARTS_COLLECTION, username));
}
