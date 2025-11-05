import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

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

  // Sign In Method
  async signIn(email: string, password: string) {
    const supabase = await this.getSupabaseClient();
    return supabase.auth.signInWithPassword({ email, password });
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
