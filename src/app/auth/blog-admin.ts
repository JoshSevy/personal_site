/**
 * Blog CMS access is gated on Supabase JWT app_metadata (set in Dashboard → Users → user → App Metadata).
 * Use `{ "blog_admin": true }` for accounts that may use /admin. All other signed-in users can still use
 * features like syntax-quiz submissions without reaching post management.
 */
export function isBlogAdminUser(user: { app_metadata?: Record<string, unknown> } | null | undefined): boolean {
  const m = user?.app_metadata;
  if (!m || typeof m !== 'object') {
    return false;
  }
  return m['blog_admin'] === true || m['admin'] === true;
}
