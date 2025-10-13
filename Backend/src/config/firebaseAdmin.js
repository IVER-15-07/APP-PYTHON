import admin from "firebase-admin";
import fs from "fs";

const servicePath = new URL("./login-ac512-firebase-adminsdk-fbsvc-65df3862e4.json", import.meta.url);
const serviceAccount = JSON.parse(fs.readFileSync(servicePath, "utf8"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("Firebase Admin inicializado para project_id:", serviceAccount.project_id);
} else {
  console.log("Firebase Admin ya inicializado. apps.length =", admin.apps.length);
}

export default admin;