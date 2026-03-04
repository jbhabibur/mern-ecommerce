import admin from "firebase-admin";
import { readFileSync } from "fs";
import { join } from "path";

// process.cwd() diye current working directory theke path nishchit kora hocche
const serviceAccountPath = join(
  process.cwd(),
  "config",
  "firebase-service-account.json",
);

try {
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} catch (error) {
  console.error("Firebase initialization error:", error.message);
}

export default admin;
