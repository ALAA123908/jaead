// إدارة المفضلة باستخدام Firestore
import { db } from './firebase';
import { collection, doc, setDoc, getDoc, onSnapshot, updateDoc, deleteDoc } from 'firebase/firestore';

const WISHLISTS_COLLECTION = 'wishlists';

export async function saveWishlistFirestore(username, wishlist) {
  await setDoc(doc(db, WISHLISTS_COLLECTION, username), { wishlist });
}

export async function getWishlistFirestore(username) {
  const snap = await getDoc(doc(db, WISHLISTS_COLLECTION, username));
  return snap.exists() ? snap.data().wishlist : [];
}

export function onWishlistChange(username, callback) {
  return onSnapshot(doc(db, WISHLISTS_COLLECTION, username), (snap) => {
    callback(snap.exists() ? snap.data().wishlist : []);
  });
}

export async function clearWishlistFirestore(username) {
  await deleteDoc(doc(db, WISHLISTS_COLLECTION, username));
}
