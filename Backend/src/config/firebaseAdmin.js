import admin from "firebase-admin";
import fs from "fs";
import path from "path";

// 1. Intentar leer la variable de entorno (PRODUCCIÓN)
const rawServiceAccount = process.env.FIREBASE_CREDENTIALS;

if (rawServiceAccount) {
  try {
    const serviceAccount = JSON.parse(rawServiceAccount);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("✅ Firebase Admin inicializado desde variable de entorno.");
  } catch (e) {
    console.error("❌ ERROR: No se pudo parsear el JSON de Firebase desde ENV.", e);
    process.exit(1); // Detener la app si no se puede inicializar
  }
} else {
 
  try {
    const localPath = path.resolve("src/config/login-ac512-firebase-adminsdk-fbsvc-14457b84d6.json");
    if (!fs.existsSync(localPath)) {
      throw new Error(`Archivo no encontrado en ${localPath}`);
    }

    const serviceAccount = JSON.parse(fs.readFileSync(localPath, "utf8"));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("✅ Firebase Admin inicializado desde archivo local.");
  } catch (e) {
    console.error("❌ ERROR: No se pudo inicializar Firebase Admin localmente.", e);
    process.exit(1); // Detener la app si falla
  }
}

export default admin;
