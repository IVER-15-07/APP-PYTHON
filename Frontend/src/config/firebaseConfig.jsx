
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA5fBD0dQu4MFBFX00A9bzAbLcqjDqjoEQ",
  authDomain: "login-ac512.firebaseapp.com",
  projectId: "login-ac512",
  storageBucket: "login-ac512.firebasestorage.app",
  messagingSenderId: "8972763137",
  appId: "1:8972763137:web:b5ed042acda1416d188000",
  measurementId: "G-Q2PXR6WFKC"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;