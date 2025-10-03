
import admin from 'firebase-admin';

// Por ahora usaremos las credenciales del proyecto

const firebaseConfig = {
  projectId: "login-ac512",
  // Estas credenciales las obtendremos del service account JSON
};

// Inicializar Firebase Admin (temporal)
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: "login-ac512"
  });
}

export const firebaseAdmin = admin;
export default admin;