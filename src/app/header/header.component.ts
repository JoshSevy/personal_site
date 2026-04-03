import { Component, OnDestroy, OnInit } from '@angular/core';
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
  mobileMenuOpen = false;
  /** Any Supabase session (syntax quiz, etc.) */
  isSignedIn = false;
  /** Can open /admin (app_metadata.blog_admin) */
  isBlogAdmin = false;
  private authUnsubscribe: (() => void) | null = null;

  constructor(private router: Router, private supabase: SupabaseService) {}

  ngOnInit() {
    void this.supabase.subscribeAuthState((signedIn, user) => {
      this.isSignedIn = signedIn;
      this.isBlogAdmin = isBlogAdminUser(user ?? null);
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
      this.isSignedIn = false;
      this.isBlogAdmin = false;
      void this.router.navigate([ '/' ]);
    } catch (err: any) {
      console.error('Error logging out:', err.message);
    }
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }
}
