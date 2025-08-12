import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCnK5dVsBIdlC1v2j_N5l-OAQ3k-U6v7zk",
  authDomain: "coscientist-dev-91437.firebaseapp.com",
  projectId: "coscientist-dev-91437",
  storageBucket: "coscientist-dev-91437.firebasestorage.app",
  messagingSenderId: "325987441249",
  appId: "1:325987441249:web:0aa07ec5116f433a13e820",
  measurementId: "G-QRE2FSGY49"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
connectAuthEmulator(auth, 'http://localhost:9099');
export const googleProvider = new GoogleAuthProvider();

export default app;
