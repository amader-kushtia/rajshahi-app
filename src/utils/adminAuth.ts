import { UserProfile } from '../types';

/**
 * SHA-256 Hashes of Authorized Admin Mobile Numbers
 * Cryptographically hashed so raw numbers or passwords are NEVER exposed in source code or bundles.
 */
export const ADMIN_PHONE_HASHES = [
  'c228766419e1cafb26355b27020308ee7799a62b00126d09554bba27633c2f89', // Phone 1 Hash
  'f22b483c86c5c8e75e2b2a3b5957787cfd6a1abae122224fee991648e5c6e57c', // Phone 2 Hash
  'a72199cf25315a921de4019a99db4cc7501cd10069dff287971d97c9a9582ee8', // Phone 1 (no 0)
  '6f00fef0f8b976efb3261e4aa7fb2b1ab66685c74e34d6862d590c37ef25ee0d'  // Phone 2 (no 0)
];

export async function hashString(str: string): Promise<string> {
  const clean = str.trim().replace(/^(\+880|880)/, '0');
  const buffer = new TextEncoder().encode(clean);
  const hashBuf = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(hashBuf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function isPhoneAdminHash(phoneOrInput: string): Promise<boolean> {
  if (!phoneOrInput) return false;
  const cleanPhone = phoneOrInput.trim().replace(/^(\+880|880)/, '0').split('@')[0];
  const hash = await hashString(cleanPhone);
  if (ADMIN_PHONE_HASHES.includes(hash)) return true;
  
  const noZero = cleanPhone.replace(/^0/, '');
  const hashNoZero = await hashString(noZero);
  return ADMIN_PHONE_HASHES.includes(hashNoZero);
}

/**
 * Verifies whether custom claims attached to a Firebase ID Token signify an Admin role.
 */
export function verifyCustomClaimsAdmin(claims?: Record<string, any> | null): boolean {
  if (!claims) return false;
  return claims.admin === true || claims.role === 'admin' || claims.role === 'super_admin';
}

/**
 * Strictly verifies whether the current logged-in user has authorized Admin privileges.
 * Relies EXCLUSIVELY on Firestore user document role or Firebase Auth Custom Claims.
 */
export function isUserAdmin(
  user: UserProfile | null | undefined, 
  customClaims?: Record<string, any> | null
): boolean {
  if (customClaims && verifyCustomClaimsAdmin(customClaims)) return true;
  if (user?.role === 'admin') return true;
  return false;
}

