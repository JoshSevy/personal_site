import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { LoaderService } from '../../services/admin-loader.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private supabase: SupabaseService, private router: Router, private loaderService: LoaderService) {
  }

  async canActivate(): Promise<boolean> {
    this.loaderService.setLoading(true);
    try {
      const { data: user, error } = await this.supabase.getUser();

      // If Supabase returns an error or no user is found, block access
      if (error || !user) {
        console.error('Authentication failed:', error?.message || 'No user found');
        this.router.navigate([ '/login' ]); // Redirect to the login page
        return false;
      }

      // Allow access if the user exists
      console.log('User authenticated:', user);
      return true;
    } catch (err) {
      console.error('Unexpected error in AuthGuard:', err);
      this.router.navigate([ '/login' ]); // Redirect to the login page
      return false;
    } finally {
      this.loaderService.setLoading(false); // Stop loader
    }
  }
}
