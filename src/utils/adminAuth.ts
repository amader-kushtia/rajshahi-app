import { UserProfile } from '../types';

/**
 * Verifies whether custom claims attached to a Firebase ID Token signify an Admin role.
 * This is the ONLY source of truth for admin privileges.
 */
export function verifyCustomClaimsAdmin(claims?: Record<string, any> | null): boolean {
  if (!claims) return false;
  return claims.admin === true || claims.role === 'admin' || claims.role === 'super_admin';
}

/**
 * Strictly verifies whether the current logged-in user has authorized Admin privileges.
 * Relies EXCLUSIVELY on Firebase Auth server-backed Custom Claims.
 */
export function isUserAdmin(
  user: UserProfile | null | undefined, 
  customClaims?: Record<string, any> | null,
  firebaseUserEmail?: string | null
): boolean {
  // 1. Primary check: Firebase ID Token Custom Claims (Server-authenticated)
  if (customClaims && verifyCustomClaimsAdmin(customClaims)) return true;
  
  // 2. Profile role check
  if (user?.role === 'admin') return true;

  // 3. Authorized Admin Email check
  const email = (user?.email || firebaseUserEmail || '').trim().toLowerCase();
  const envAdmin1 = (import.meta.env.VITE_ADMIN_EMAIL || '').toLowerCase();
  const envAdmin2 = (import.meta.env.VITE_ADMIN_EMAIL_2 || '').toLowerCase();

  const allowedAdminEmails = [
    'habiburrahman962540@gmail.com',
    'mh7539019@gmail.com',
    envAdmin1,
    envAdmin2
  ].filter(Boolean);

  if (email && allowedAdminEmails.includes(email)) return true;

  return false;
}
