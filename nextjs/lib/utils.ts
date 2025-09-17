import { formatDistanceToNow } from 'date-fns';

export const formatDate = (dateString: string | Date) => {
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return 'Unknown date';
  }
};


/**
 * Enhanced fetch function that automatically redirects to login on 401 responses
 */
export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const response = await fetch(url, {
    ...options,
    credentials: 'include', // Include cookies for authentication
  });

  // Check if the response is a 401 with redirect header
  if (response.status === 401 && response.headers.get('X-Redirect') === '/login') {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  return response;
}
