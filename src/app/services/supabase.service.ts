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
   */
  async handleAuthCallback() {
    const supabase = await this.getSupabaseClient();
    const anyAuth = supabase.auth as any;

    const hasCodeParam = typeof window !== 'undefined' && window.location?.search?.includes('code=');
    if (hasCodeParam && typeof anyAuth.exchangeCodeForSession === 'function') {
      try {
        const { data, error } = await anyAuth.exchangeCodeForSession(window.location.href);
        if (error) throw error;
        return { data, error: null };
      } catch (err) {
        return { data: null, error: err };
      }
    }

    // Check if we already have a session
    const { data, error } = await supabase.auth.getSession();
    return { data, error };
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
