import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

type OAuthProvider = 'google' | 'github' | 'azure' | 'gitlab' | 'bitbucket' | 'facebook' | 'twitter' | 'discord';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabaseUrl = environment.superbaseUrl;
  private supabaseKey = environment.superbaseKey;
  private supabaseClient: any = null;
  private supabasePromise: Promise<any> | null = null;

  /**
   * Lazy load Supabase client - only loads when first method is called
   */
  private async getSupabaseClient() {
    if (this.supabaseClient) {
      return this.supabaseClient;
    }

    if (!this.supabasePromise) {
      this.supabasePromise = (async () => {
        // Dynamically import Supabase only when needed
        const { createClient } = await import('@supabase/supabase-js');
        this.supabaseClient = createClient(this.supabaseUrl, this.supabaseKey);
        return this.supabaseClient;
      })();
    }

    return this.supabasePromise;
  }

  async signInWithOAuth(provider: OAuthProvider, redirectTo?: string) {
    const supabase = await this.getSupabaseClient();
    return supabase.auth.signInWithOAuth({
      provider,
      options: redirectTo ? { redirectTo } : undefined,
    });
  }

  async signInWithGoogle(redirectTo?: string) {
    return this.signInWithOAuth('google', redirectTo);
  }

  // Email + password
  async signInWithPassword(email: string, password: string) {
    const supabase = await this.getSupabaseClient();
    return supabase.auth.signInWithPassword({ email, password });
  }

  // Backwards-compatible alias (keeps existing callers working)
  async signIn(email: string, password: string) {
    return this.signInWithPassword(email, password);
  }

  // Email magic link (OTP)
  async signInWithMagicLink(email: string, emailRedirectTo?: string) {
    const supabase = await this.getSupabaseClient();
    return supabase.auth.signInWithOtp({
      email,
      options: emailRedirectTo ? { emailRedirectTo } : undefined,
    });
  }

  async getSession() {
    const supabase = await this.getSupabaseClient();
    return supabase.auth.getSession();
  }

  /**
   * Used by /auth/callback to finalize OAuth/magic-link flows.
   * Safe to call even when there's nothing to exchange.
   */
  async maybeExchangeCodeForSession() {
    const supabase = await this.getSupabaseClient();

    // Supabase v2 exposes exchangeCodeForSession (PKCE). If it doesn't exist or
    // if there is no code in the URL, we just ignore.
    const anyAuth = supabase.auth as any;
    if (typeof anyAuth.exchangeCodeForSession !== 'function') {
      return;
    }

    const hasCodeParam = typeof window !== 'undefined' && window.location?.search?.includes('code=');
    if (!hasCodeParam) {
      return;
    }

    try {
      await anyAuth.exchangeCodeForSession(window.location.href);
    } catch {
      // Intentionally ignore – the session might already be set.
    }
  }

  // Sign Out Method
  async signOut() {
    const supabase = await this.getSupabaseClient();
    return supabase.auth.signOut();
  }

  // Get Current User
  async getUser() {
    const supabase = await this.getSupabaseClient();
    return supabase.auth.getUser();
  }
}
