import crypto from 'crypto';

// Hash password with SHA-256 and a static salt for simplicity and speed
const SALT = 'assetflow-secure-salt-2026';

export function hashPassword(password: string): string {
  return crypto
    .createHmac('sha256', SALT)
    .update(password)
    .digest('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}
