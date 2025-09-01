export interface CustomJWTPayload {
  sub: string;
  email?: string;
  name?: string;
  role: string;
  permissions: string[];
  department?: string;
  level?: string;
  iss: string;
  aud: string;
  exp: number;
  iat: number;
}

export interface CustomTokenResponse {
  token: string;
  expiresIn: number;
}

export interface UserRole {
  role: 'admin' | 'user' | 'manager';
  permissions: string[];
}

