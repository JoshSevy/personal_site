import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  mobileMenuOpen = false;
  isAdminLoggedIn = false;
  private adminCheckDone = false;

  constructor(private router: Router, private supabase: SupabaseService) {
    // Don't check admin login in constructor - lazy load Supabase only when needed
  }

  ngOnInit() {
    // Check admin status after a short delay to avoid blocking initial render
    // This allows the page to load first, then check admin status
    setTimeout(() => {
      void this.checkAdminLogin();
    }, 100);
  }

  /**
   * Lazy check admin login status - only loads Supabase when called
   */
  async checkAdminLogin() {
    if (this.adminCheckDone) {
      return;
    }
    
    try {
      const { data: user } = await this.supabase.getUser();
      this.isAdminLoggedIn = !!(user.user && user.user.role === 'authenticated');
      this.adminCheckDone = true;
    } catch (error) {
      // Supabase not loaded yet or user not authenticated - silently fail
      this.isAdminLoggedIn = false;
    }
  }

  async logout() {
    try {
      const { error } = await this.supabase.signOut();
      if (error) throw error;
      this.isAdminLoggedIn = false;
      this.router.navigate([ '/' ]); // Redirect to home page after logout
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
