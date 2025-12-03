import admin from "firebase-admin";
import fs from "fs";

// 1. Intentar leer la variable de entorno inyectada por Render (PRODUCCIÓN)
const rawServiceAccount = process.env.FIREBASE_CREDENTIALS;

if (rawServiceAccount) {
  // ESTAMOS EN PRODUCCIÓN (RENDER): Usar la variable de entorno JSON
  try {
    const serviceAccount = JSON.parse(rawServiceAccount);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log(" Firebase Admin inicializado desde variable de entorno.");
  } catch (e) {
    console.error(" ERROR: No se pudo parsear el JSON de Firebase desde ENV.");
  }
} else {
  // ESTAMOS EN DESARROLLO (LOCAL): Usar el archivo JSON local
  try {
    const localPath = new URL("./login-ac512-firebase-adminsdk-fbsvc-14457b84d6.json", import.meta.url);
    const serviceAccount = JSON.parse(fs.readFileSync(localPath, "utf8"));

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log(" Firebase Admin inicializado desde archivo local.");
  } catch (e) {
    console.error(" ERROR: No se encontró el archivo local de Firebase.", e);
    // Sugerencia: Asegúrate de que el archivo JSON esté en la ruta correcta en tu carpeta Backend.
  }
}

export default admin;