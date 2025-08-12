import { getAuth } from 'firebase-admin/auth';
import { initializeApp } from 'firebase-admin/app';

const app = initializeApp();
export const adminAuth = getAuth(app);
