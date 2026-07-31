import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { isBlogAdminUser } from '../auth/blog-admin';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  readonly mobileMenuOpen = signal(false);
  /** Any Supabase session (syntax quiz, etc.) */
  readonly isSignedIn = signal(false);
  /** Can open /admin (app_metadata.blog_admin) */
  readonly isBlogAdmin = signal(false);
  private authUnsubscribe: (() => void) | null = null;

  constructor(private router: Router, private supabase: SupabaseService) {}

  ngOnInit() {
    // This callback fires from Supabase's own auth listener, entirely outside
    // any template event or existing signal write. Under OnPush that means
    // plain field writes here would never schedule a re-render, so this state
    // has to be signals for the header to update on login/logout.
    void this.supabase.subscribeAuthState((signedIn, user) => {
      this.isSignedIn.set(signedIn);
      this.isBlogAdmin.set(isBlogAdminUser(user ?? null));
    }).then((unsub) => {
      this.authUnsubscribe = unsub;
    });
  }

  ngOnDestroy() {
    this.authUnsubscribe?.();
  }

  async logout() {
    try {
      const { error } = await this.supabase.signOut();
      if (error) throw error;
      this.isSignedIn.set(false);
      this.isBlogAdmin.set(false);
      void this.router.navigate([ '/' ]);
    } catch (err: any) {
      console.error('Error logging out:', err.message);
    }
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update((open) => !open);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }
}
