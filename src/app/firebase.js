// firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signOut as firebaseSignOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDQoZmQCDbW-C2_JNX0-2ybwoj-iaHy7J0",
  authDomain: "creative-cure.firebaseapp.com",
  projectId: "creative-cure",
  storageBucket: "creative-cure.appspot.com",
  messagingSenderId: "207671391927",
  appId: "1:207671391927:web:fe5bc8f0deb5737a31bf32",
  measurementId: "G-1SL1GGK10Q"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Export the signOut function
export const signOut = () => firebaseSignOut(auth);
