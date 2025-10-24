import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA5fBD0dQu4MFBFX00A9bzAbLcqjDqjoEQ",
  authDomain: "login-ac512.firebaseapp.com",
  projectId: "login-ac512",
  storageBucket: "login-ac512.firebasestorage.app",
  messagingSenderId: "8972763137",
  appId: "1:8972763137:web:b5ed042acda1416d188000",
  measurementId: "G-Q2PXR6WFKC"
};

// inicializar solo si no hay apps (evita errores con HMR)
if (!getApps().length) {
  initializeApp(firebaseConfig);
  // eslint-disable-next-line no-console
  console.log("Firebase cliente inicializado");
} else {
  // eslint-disable-next-line no-console
  console.log("Firebase cliente ya inicializado");
}

export const auth = getAuth();
export const googleProvider = new GoogleAuthProvider();
export const microsoftProvider = new OAuthProvider("microsoft.com");
microsoftProvider.addScope('openid');
microsoftProvider.addScope('email');
microsoftProvider.addScope('profile');

googleProvider.setCustomParameters({ prompt: "select_account" });
microsoftProvider.setCustomParameters({ prompt: "select_account", tenant: "common" });

export default firebaseConfig;