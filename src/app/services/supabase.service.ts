import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabaseUrl = environment.superbaseUrl;
  private supabaseKey = environment.superbaseKey;
  private supabase = createClient(this.supabaseUrl, this.supabaseKey);

  // Sign In Method
  signIn(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({ email, password });
  }

  // Sign Out Method
  signOut() {
    return this.supabase.auth.signOut();
  }

  // Get Current User
  getUser() {
    return this.supabase.auth.getUser();
  }
}
