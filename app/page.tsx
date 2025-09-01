'use client';

import { useUser } from '@auth0/nextjs-auth0';
import Image from 'next/image';
import { useState } from 'react';

export default function Home() {
  const { user, isLoading } = useUser();
  const [isLoadingDoc, setIsLoadingDoc] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          My Auth0 App
        </h1>
        
        {user ? (
          <div className="text-center">
            <div className="mb-6">
              {user.picture && (
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <Image 
                    src={user.picture} 
                    alt={user.name || 'User'}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
              )}
              <h2 className="text-xl font-semibold text-gray-800">
                Welcome, {user.name}!
              </h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
            
            <div className="space-y-4">
              <button 
                onClick={async () => {
                  setIsLoadingDoc(true);
                  try {
                    // Call the API to create JWT token and set cookie
                    const response = await fetch(`/api/gitbook-token?userId=${encodeURIComponent(user.sub || '')}`);
                    if (response.ok) {
                      const data = await response.json();
                      // Get the token from the response and add it as query parameter
                      const token = data.token;
                      window.location.href = `https://adaptive.rodrcastro.dev?jwt_token=${encodeURIComponent(token)}`;
                    } else {
                      console.error('Failed to create token');
                      alert('Failed to access documentation. Please try again.');
                    }
                  } catch (error) {
                    console.error('Error:', error);
                    alert('An error occurred. Please try again.');
                  } finally {
                    setIsLoadingDoc(false);
                  }
                }}
                disabled={isLoadingDoc}
                className="block w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingDoc ? 'Loading...' : 'Go to Documentation'}
              </button>
              
              <a 
                href="/auth/logout"
                className="block w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                Logout
              </a>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-6">Please log in to continue</p>
            </div>
            
            <a 
              href="/auth/login"
              className="inline-block bg-green-500 text-white py-3 px-8 rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              Login with Auth0
            </a>
          </div>
        )}
      </div>
    </div>
  );
}