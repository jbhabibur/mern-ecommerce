import admin from "firebase-admin";

/**
 * Firebase Admin Initialization
 * Using environment variables to avoid file path issues in production
 */
try {
  let serviceAccount;

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // Parse the JSON string from environment variable
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

    // Fix potential private key newline formatting issues
    if (typeof serviceAccount.private_key === "string") {
      serviceAccount.private_key = serviceAccount.private_key.replace(
        /\\n/g,
        "\n",
      );
    }
  }

  // Initialize only if not already initialized
  if (serviceAccount && !admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin initialized successfully.");
  }
} catch (error) {
  console.error("Firebase initialization error:", error.message);
}

export default admin;
