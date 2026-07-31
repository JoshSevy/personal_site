import { Component, signal } from '@angular/core';
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

  // These are all read after an `await`, outside the synchronous window that
  // triggers a re-render for the event handler that kicked things off.
  // Signals notify on write regardless of when that happens.
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly infoMessage = signal('');

  private readonly returnUrl: string;

  constructor(
    private readonly supabase: SupabaseService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/blog';
  }

  private buildCallbackUrl() {
    // Use absolute URL so Supabase can redirect back regardless of environment.
    const url = new URL('/auth/callback', window.location.origin);
    url.searchParams.set('next', this.returnUrl);
    return url.toString();
  }

  async login() {
    this.loading.set(true);
    this.errorMessage.set('');
    this.infoMessage.set('');

    try {
      const { data, error } = await this.supabase.signInWithPassword(this.email, this.password);
      if (error) {
        this.errorMessage.set(error.message);
        return;
      }

      if (data) {
        await this.router.navigateByUrl(this.returnUrl);
      }
    } catch (e: any) {
      this.errorMessage.set(e?.message ?? 'Login failed');
    } finally {
      this.loading.set(false);
    }
  }

  async continueWithGoogle() {
    this.loading.set(true);
    this.errorMessage.set('');
    this.infoMessage.set('');

    try {
      const callbackUrl = this.buildCallbackUrl();
      const { error } = await this.supabase.signInWithGoogle(callbackUrl);
      if (error) {
        this.errorMessage.set(error.message);
      }
      // On success, Supabase redirects away—no navigation needed here.
    } catch (e: any) {
      this.errorMessage.set(e?.message ?? 'Google sign-in failed');
    } finally {
      this.loading.set(false);
    }
  }
}
