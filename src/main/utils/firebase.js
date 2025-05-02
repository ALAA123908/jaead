// إعداد وربط تطبيق React مع Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// بيانات الربط الحقيقية لمشروعك
const firebaseConfig = {
  apiKey: "AIzaSyCEclpKeHLiB3xl32y8kqT7Q-L8TrPKYIQ",
  authDomain: "jaewd-4db15.firebaseapp.com",
  projectId: "jaewd-4db15",
  storageBucket: "jaewd-4db15.firebasestorage.app",
  messagingSenderId: "582985347033",
  appId: "1:582985347033:web:f11f3c642fbebab937b3c8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
