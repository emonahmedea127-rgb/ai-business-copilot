import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { Request, Response } from 'express';
import { serverDb } from './db';
import { User } from '../../types';

export const SESSION_COOKIE_NAME = 'biz_copilot_session';
export const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

/**
 * Validate email format with standard RFC regex
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email.trim()) && email.length <= 254;
}

/**
 * Validate password strength (minimum 8 characters, at least 1 number or special character)
 */
export function validatePasswordStrength(password: string): { valid: boolean; message?: string } {
  if (!password || typeof password !== 'string') {
    return { valid: false, message: 'Password is required' };
  }
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  if (password.length > 128) {
    return { valid: false, message: 'Password must not exceed 128 characters' };
  }
  // Check for at least one digit or symbol
  const hasNumberOrSymbol = /[\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
  if (!hasNumberOrSymbol) {
    return { valid: false, message: 'Password must contain at least one number or special character' };
  }
  return { valid: true };
}

/**
 * Hash password securely with bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Verify password against hashed password
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate secure session token
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Extract session token from request (Cookie, Authorization Header, or custom header)
 */
export function extractSessionToken(req: Request): string | null {
  // 1. Check cookies
  if (req.cookies && req.cookies[SESSION_COOKIE_NAME]) {
    return req.cookies[SESSION_COOKIE_NAME];
  }

  // 2. Check header Cookie string manually
  const rawCookie = req.headers.cookie;
  if (rawCookie) {
    const match = rawCookie.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE_NAME}=([^;]+)`));
    if (match && match[1]) {
      return decodeURIComponent(match[1]);
    }
  }

  // 3. Check Authorization header: Bearer <token>
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }

  // 4. Check custom x-session-id header
  const customHeader = req.headers['x-session-id'];
  if (typeof customHeader === 'string' && customHeader.trim()) {
    return customHeader.trim();
  }

  return null;
}

/**
 * Set secure HTTP-only session cookie on response
 */
export function setSessionCookie(res: Response, token: string): void {
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.cookie(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'lax' : 'lax',
    maxAge: SESSION_DURATION_MS,
    path: '/',
  });
}

/**
 * Clear session cookie on logout
 */
export function clearSessionCookie(res: Response): void {
  res.clearCookie(SESSION_COOKIE_NAME, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });
}

/**
 * Sanitize user object by stripping internal sensitive fields like passwordHash
 */
export function sanitizeUser(dbUser: {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  isVerified?: boolean;
  emailVerifiedAt?: string;
  createdAt: string;
}): User {
  return {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    role: dbUser.role as User['role'],
    avatarUrl: dbUser.avatarUrl,
    isVerified: dbUser.isVerified,
    emailVerifiedAt: dbUser.emailVerifiedAt,
    createdAt: dbUser.createdAt,
  };
}

/**
 * Authenticate session from request
 */
export async function authenticateRequest(req: Request): Promise<{
  authenticated: boolean;
  user: User | null;
  userId: string | null;
  sessionToken: string | null;
}> {
  const token = extractSessionToken(req);
  if (!token) {
    return { authenticated: false, user: null, userId: null, sessionToken: null };
  }

  const session = await serverDb.getSession(token);
  if (!session) {
    return { authenticated: false, user: null, userId: null, sessionToken: null };
  }

  // Check if session has expired
  if (new Date(session.expiresAt) < new Date()) {
    await serverDb.deleteSession(token);
    return { authenticated: false, user: null, userId: null, sessionToken: null };
  }

  const dbUser = await serverDb.getUserById(session.userId);
  if (!dbUser) {
    await serverDb.deleteSession(token);
    return { authenticated: false, user: null, userId: null, sessionToken: null };
  }

  return {
    authenticated: true,
    user: sanitizeUser(dbUser),
    userId: dbUser.id,
    sessionToken: token,
  };
}
