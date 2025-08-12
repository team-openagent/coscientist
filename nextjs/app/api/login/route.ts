import { NextRequest, NextResponse } from 'next/server';
import app from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET;


export async function POST(request: NextRequest) {
  const { idToken } = await request.json();

  if (!idToken) {
    return NextResponse.json(
      { error: 'ID token is required' },
      { status: 400 }
    );
  }

  // Verify the Firebase ID token
  const decodedToken = await getAuth(app).verifyIdToken(idToken);
  const uid = decodedToken.uid;
  const email = decodedToken.email;

  // Create JWT payload
  const payload = {
    uid: uid,
    email: email,
    displayName: decodedToken.name || email,
    photoURL: decodedToken.picture,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7), // 7 days
  };

  // Generate JWT token
  const token = jwt.sign(payload, JWT_SECRET!);

  // Return the JWT token and user info
  const response = NextResponse.json({
    user: {
      uid: decodedToken.uid,
      email: decodedToken.email,
      displayName: decodedToken.name || decodedToken.email,
      photoURL: decodedToken.picture,
    },
    expiresIn: '7d',
  });
  response.cookies.set('authToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Enable HTTPS in the production environment
    sameSite: 'lax', // Prevent CSRF attacks
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  });

  return response;
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST with Firebase ID token.' },
    { status: 405 }
  );
}
