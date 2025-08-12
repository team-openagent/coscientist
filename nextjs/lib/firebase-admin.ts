import { getAuth } from 'firebase-admin/auth';
import { initializeApp } from 'firebase-admin/app';

const app = initializeApp({projectId: process.env.FIREBASE_PROJECT_ID});
export default app;
