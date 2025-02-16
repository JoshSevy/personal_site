import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    NgIf
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  mobileMenuOpen = false;
  isAdminLoggedIn = false;

  constructor(private router: Router, private supabase: SupabaseService) {
    void this.checkAdminLogin();
  }

  async checkAdminLogin() {
    const { data: user } = await this.supabase.getUser();
    this.isAdminLoggedIn = !!(user.user && user.user.role === 'authenticated'); // Set to true if the user is logged in
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
