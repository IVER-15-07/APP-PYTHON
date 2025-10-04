
import admin from "firebase-admin";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
if (!serviceAccountPath || !fs.existsSync(serviceAccountPath)) {
  console.warn("⚠️ No se encontró service account para Firebase. Firebase login fallará.");
} else {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(fs.readFileSync(serviceAccountPath, "utf8")))
  });
}

export default admin;