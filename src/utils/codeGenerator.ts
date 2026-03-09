/**
 * Generate a unique public code for albums
 * Format: 6 random uppercase alphanumeric characters
 */
export function generatePublicCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Validate public code format
 */
export function isValidPublicCode(code: string): boolean {
  return /^[A-Z0-9]{6}$/.test(code);
}
