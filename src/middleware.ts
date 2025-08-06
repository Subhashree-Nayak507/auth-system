import { NextRequest, NextResponse } from 'next/server';
import { users } from '@/lib/users';

function base64urlToBase64(base64url: string): string {
  return base64url.replace(/-/g, '+').replace(/_/g, '/').padEnd(base64url.length + (4 - base64url.length % 4) % 4, '=');
}

function base64urlDecode(base64url: string): Uint8Array {
  const base64 = base64urlToBase64(base64url);
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function verifyJWT(token: string, secret: string): Promise<any> {
  try {
    const [headerB64, payloadB64, signatureB64] = token.split('.'); 
    if (!headerB64 || !payloadB64 || !signatureB64) {
      throw new Error('Invalid token format');
    }

    const payload = JSON.parse(new TextDecoder().decode(base64urlDecode(payloadB64)));
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      throw new Error('Token expired');
    }

    const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
    const signature = base64urlDecode(signatureB64);
  
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signature,
      data
    );
    if (!isValid) {
      throw new Error('Invalid signature');
    }

    return payload;
  } catch (error) {
    throw new Error('Token verification failed');
  }
}

export async function middleware(request: NextRequest) {
  console.log('Path:', request.nextUrl.pathname);

  const token = request.cookies.get('jwt')?.value;
  const pathname = request.nextUrl.pathname;
  
  const isLoginPage = pathname === '/login';
  const isAdminRoute = pathname.startsWith('/admin');
  const isUserRoute = pathname.startsWith('/user');
  const isProtectedRoute = isAdminRoute || isUserRoute;

  // Handle login page access
  if (isLoginPage) {
    if (token) {
      try {
        const decoded = await verifyJWT(token, process.env.JWT_SECRET!);
        const user = users.find(u => u.username === decoded.username);
        if (user) {
          console.log('Already authenticated, redirecting to dashboard');
          const redirectUrl = user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard';
          return NextResponse.redirect(new URL(redirectUrl, request.url));
        }
      } catch (error) {
        console.log('Invalid token, allowing login page access');
        const response = NextResponse.next();
        response.cookies.delete('jwt');
        return response;
      }
    }
    return NextResponse.next();
  }

  if (isProtectedRoute) {
    if (!token) {
      console.log('No token found, redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }
    try {
      const decoded = await verifyJWT(token, process.env.JWT_SECRET!);
    
      const user = users.find(u => u.username === decoded.username);
      if (!user) {
        throw new Error('User not found');
      }

      if (isAdminRoute && user.role !== 'admin') {
        console.log('Access denied: Admin route requires admin role, redirecting to user dashboard');
        return NextResponse.redirect(new URL('/user/dashboard', request.url));
      }

      if (isUserRoute && user.role !== 'user') {
        console.log('Access denied: User route requires user role, redirecting to admin dashboard');
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }

      console.log('Access granted for user:', user.username, 'role:', user.role);
      return NextResponse.next();

    } catch (error) {
      console.error('Auth error:', error);
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('jwt');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};