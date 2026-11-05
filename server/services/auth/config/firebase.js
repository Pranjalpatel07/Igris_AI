import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { cert, initializeApp } from "firebase-admin";

const localServiceAccountPath = fileURLToPath(
  new URL("../serviceAccountKey.json", import.meta.url),
);
const serviceAccountJson =
  process.env.FIREBASE_SERVICE_ACCOUNT_JSON ||
  (existsSync(localServiceAccountPath)
    ? readFileSync(localServiceAccountPath, "utf8")
    : undefined);

if (!serviceAccountJson) {
  throw new Error(
    "Firebase Admin credentials are missing. Set FIREBASE_SERVICE_ACCOUNT_JSON or provide server/services/auth/serviceAccountKey.json.",
  );
}

const serviceAccount = JSON.parse(serviceAccountJson);

export const app = initializeApp({
  credential: cert(serviceAccount),
});
