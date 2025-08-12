import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, App } from 'firebase-admin/app';

// Initialize Firebase Admin only if no apps exist
let app: App;
if (getApps().length === 0) {
  app = initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID });
} else {
  app = getApps()[0];
}

export default app;
