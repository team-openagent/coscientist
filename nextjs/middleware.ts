import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify, JWTVerifyResult } from 'jose';

// Define protected routes that require authentication
const protectedRoutes = ['/api/project'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the current route is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  if (!isProtectedRoute) {
    return NextResponse.next();
  }
  
  const authToken = request.cookies.get('authToken')?.value;
  if (!authToken) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }
    
  let decoded: JWTVerifyResult;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    decoded = await jwtVerify(authToken, secret);
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
    // Check if token is expired
  const currentTime = Math.floor(Date.now() / 1000);
  if (decoded.payload.exp && decoded.payload.exp < currentTime) {
    return NextResponse.json(
      { error: 'Token expired' },
      { status: 401 }
    );
  }
      
  // Add user information to request headers for use in API routes
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-uid', decoded.payload.uid as string);
  requestHeaders.set('x-user-email', decoded.payload.email as string);
  requestHeaders.set('x-user-display-name', decoded.payload.displayName as string);
      
  // Continue with the request
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
