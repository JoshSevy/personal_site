import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class LoginComponent {
  email = '';
  password = '';

  loading = false;
  errorMessage = '';
  infoMessage = '';

  private readonly returnUrl: string;

  constructor(
    private readonly supabase: SupabaseService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/admin';
  }

  private buildCallbackUrl() {
    // Use absolute URL so Supabase can redirect back regardless of environment.
    const url = new URL('/auth/callback', window.location.origin);
    url.searchParams.set('next', this.returnUrl);
    return url.toString();
  }

  async login() {
    this.loading = true;
    this.errorMessage = '';
    this.infoMessage = '';

    try {
      const { data, error } = await this.supabase.signInWithPassword(this.email, this.password);
      if (error) {
        this.errorMessage = error.message;
        return;
      }

      if (data) {
        await this.router.navigateByUrl(this.returnUrl);
      }
    } catch (e: any) {
      this.errorMessage = e?.message ?? 'Login failed';
    } finally {
      this.loading = false;
    }
  }

  async sendMagicLink() {
    this.loading = true;
    this.errorMessage = '';
    this.infoMessage = '';

    try {
      const callbackUrl = this.buildCallbackUrl();
      const { error } = await this.supabase.signInWithMagicLink(this.email, callbackUrl);
      if (error) {
        this.errorMessage = error.message;
        return;
      }

      this.infoMessage = 'Magic link sent. Check your email to finish signing in.';
    } catch (e: any) {
      this.errorMessage = e?.message ?? 'Failed to send magic link';
    } finally {
      this.loading = false;
    }
  }

  async continueWithGoogle() {
    this.loading = true;
    this.errorMessage = '';
    this.infoMessage = '';

    try {
      const callbackUrl = this.buildCallbackUrl();
      const { error } = await this.supabase.signInWithGoogle(callbackUrl);
      if (error) {
        this.errorMessage = error.message;
      }
      // On success, Supabase redirects away—no navigation needed here.
    } catch (e: any) {
      this.errorMessage = e?.message ?? 'Google sign-in failed';
    } finally {
      this.loading = false;
    }
  }
}
