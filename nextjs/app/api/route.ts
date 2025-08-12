import { NextRequest, NextResponse } from 'next/server';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

export async function GET() {
  return NextResponse.json({ message: "Hello, world!" });
}

export async function POST(request: NextRequest) {
  const { idToken, refreshToken } = await request.json();

  const app = initializeApp({credential: refreshToken});
  const decodedToken = await getAuth(app).verifyIdToken(idToken);

  return NextResponse.json({ message: decodedToken });
}
