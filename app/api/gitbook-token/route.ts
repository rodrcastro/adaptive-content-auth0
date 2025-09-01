import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { signJWT } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    // Get the user session from Auth0
    const session = await auth0.getSession(request);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create JWT payload with user information and custom claims
    const payload = {
      email: session.user.email || '',
      name: session.user.name || '',
      sub: session.user.sub || '',
      language: 'en',
      isLoggedIn: true 
    };

    // Sign the JWT token
    const token = signJWT(payload);

    // Create the response
    const response = NextResponse.json({ 
      success: true, 
      message: 'Token created successfully' 
    });

    // Set the cookie
    response.cookies.set('gitbook-visitor-token', token, {
      domain: '.rodrcastro.dev',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600, // 1 hour
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error creating GitBook token:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
