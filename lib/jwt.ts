import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export interface JWTCustomClaims {
  email: string;
  name: string;
  sub: string;
  language?: string;
  isLoggedIn?: boolean;
  iat?: number;
  exp?: number;
}

export function signJWT(payload: Omit<JWTCustomClaims, 'iat' | 'exp'>): string {
  const signingKey = process.env.JWT_SIGNING_KEY;
  
  if (!signingKey) {
    throw new Error('JWT_SIGNING_KEY environment variable is not set');
  }

  return jwt.sign(payload, signingKey, {
    algorithm: 'HS256',
    expiresIn: '1h', // Token expires in 1 hour
  });
}

export async function createGitbookCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  
  cookieStore.set('gitbook-visitor-token', token, {
    domain: '.rodrcastro.dev', // Wildcard domain
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 3600, // 1 hour in seconds
    path: '/',
  });
}

export function verifyJWT(token: string): JWTCustomClaims {
  const signingKey = process.env.JWT_SIGNING_KEY;
  
  if (!signingKey) {
    throw new Error('JWT_SIGNING_KEY environment variable is not set');
  }

  return jwt.verify(token, signingKey, { algorithms: ['HS256'] }) as JWTCustomClaims;
}
