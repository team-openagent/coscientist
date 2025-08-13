import { NextRequest } from 'next/server';

export interface AuthenticatedUser {
  uid: string;
  email: string;
  displayName: string;
}

/**
 * Extract user information from authenticated request headers
 * This function should be used in API routes that are protected by middleware
 */
export function getAuthenticatedUser(request: NextRequest): AuthenticatedUser {
  const uid = request.headers.get('x-user-uid');
  const email = request.headers.get('x-user-email');
  const displayName = request.headers.get('x-user-display-name');

  if (!uid || !email) {
    throw new Error('User not authenticated');
  }

  return {
    uid,
    email,
    displayName: displayName || email,
  };
}

/**
 * Check if a request is authenticated
 */
export function isAuthenticated(request: NextRequest): boolean {
  try {
    getAuthenticatedUser(request);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get user ID from authenticated request
 */
export function getUID(request: NextRequest): string {
  const user = getAuthenticatedUser(request);
  return user.uid;
}

/**
 * Get user email from authenticated request
 */
export function getUserEmail(request: NextRequest): string {
  const user = getAuthenticatedUser(request);
  return user.email;
}
