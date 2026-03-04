import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  serverTimestamp,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBnusW_v8vcyBgh7J4_eR4eYb8Moe_KBCQ",
  authDomain: "camera-archive-gallery.firebaseapp.com",
  projectId: "camera-archive-gallery",
  storageBucket: "camera-archive-gallery.firebasestorage.app",
  messagingSenderId: "491791744745",
  appId: "1:491791744745:web:f12c465ff4d1dc371cba78",
  measurementId: "G-NMN8103E99"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.firebaseDB = db;
window.firebaseFns = {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  serverTimestamp,
  deleteDoc,
  doc
};