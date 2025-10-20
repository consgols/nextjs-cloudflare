/**
 * Middleware for handling route access control in Next.js.
 *
 * This function runs before every request and checks:
 *  - If the user is trying to access a protected route (requires login).
 *  - If the user is trying to access a public route (login/register) while already logged in.
 *
 * Behavior:
 *  - Redirects unauthenticated users from protected routes → /login
 *  - Redirects authenticated users from public routes → /createcv
 *  - Allows all other requests to continue as normal
 */

import { decrypt } from '@/lib/database/session'; // Function to decrypt or verify session data
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Routes that require user authentication
const protectedRoutes = ['/createcv', '/previewcv'];

// Routes that should only be accessible when user is not logged in
const publicRoutes = ['/login', '/register'];

// Main middleware function
export async function middleware(req: NextRequest) {
  // Extract pathname (e.g., "/createcv") and origin (e.g., "https://myapp.com")
  const { pathname, origin } = req.nextUrl;

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Check if the current route is public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Retrieve 'session' cookie if it exists
  const cookie = req.cookies.get('session')?.value ?? null;

  // Attempt to decrypt session data; if decryption fails or cookie is missing, set session to null
  const session = cookie ? await decrypt(cookie).catch(() => null) : null;

  //If route is protected and user is not authenticated, redirect to login
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', origin));
  }

  //If route is public and user is already logged in, redirect to main page (/createcv)
  if (isPublicRoute && session?.userId) {
    return NextResponse.redirect(new URL('/createcv', origin));
  }

  //Otherwise, allow request to proceed as normal
  return NextResponse.next();
}
