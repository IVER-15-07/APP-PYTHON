import admin from "firebase-admin";


const rawServiceAccount = process.env.FIREBASE_CREDENTIALS;

if (!rawServiceAccount) {
  console.error(" ERROR: No se encontró la variable de entorno FIREBASE_CREDENTIALS");
  process.exit(1);
}

try {
  const serviceAccount = JSON.parse(rawServiceAccount);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log(" Firebase Admin inicializado correctamente desde variable de entorno.");
} catch (e) {
  console.error("ERROR: No se pudo parsear el JSON de Firebase desde FIREBASE_CREDENTIALS", e);
  process.exit(1);
}

export default admin;
