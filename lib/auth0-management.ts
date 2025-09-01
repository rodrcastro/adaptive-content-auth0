interface ManagementTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface Auth0User {
  user_id: string;
  email: string;
  name: string;
  given_name?: string;
  family_name?: string;
}

export async function getManagementToken(): Promise<string> {
  const domain = process.env.AUTH0_ISSUER_BASE_URL?.replace('https://', '');
  const clientId = process.env.AUTH0_CLIENT_ID;
  const clientSecret = process.env.AUTH0_CLIENT_SECRET;

  if (!domain || !clientId || !clientSecret) {
    throw new Error('Missing Auth0 configuration');
  }

  const response = await fetch(`https://${domain}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      audience: `https://${domain}/api/v2/`,
      grant_type: 'client_credentials',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to get management token');
  }

  const data: ManagementTokenResponse = await response.json();
  return data.access_token;
}

export async function getUserInfo(userId: string): Promise<Auth0User> {
  const domain = process.env.AUTH0_ISSUER_BASE_URL?.replace('https://', '');
  const token = await getManagementToken();

  const response = await fetch(`https://${domain}/api/v2/users/${encodeURIComponent(userId)}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get user info');
  }

  return response.json();
}
