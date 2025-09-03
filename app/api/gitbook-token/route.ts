import { NextRequest, NextResponse } from 'next/server';
import { signJWT } from '@/lib/jwt';
import { getUserInfo } from '@/lib/auth0-management';

export async function GET(request: NextRequest) {
  try {
    // Get user ID from the Authorization header or query parameter
    const authHeader = request.headers.get('authorization');
    const userId = request.nextUrl.searchParams.get('userId');
    
    if (!userId && !authHeader) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Extract user ID from Authorization header if present
    const userSub = userId || authHeader?.replace('Bearer ', '');
    
    if (!userSub) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    // Get user information from Auth0 Management API
    const userInfo = await getUserInfo(userSub);
    
    const payload = {
      email: userInfo.email,
      name: userInfo.name,
      sub: userInfo.user_id,
      language: userInfo.user_metadata?.language ?? undefined,
      isLoggedIn: true 
    };

    // Sign the JWT token
    const token = signJWT(payload);

    // Create the response with the token
    const response = NextResponse.json({ 
      success: true, 
      message: 'Token created successfully',
      token: token
    });

    // Set the cookie
    response.cookies.set('gitbook-visitor-token', token, {
      domain: '.sup-test.org',
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
