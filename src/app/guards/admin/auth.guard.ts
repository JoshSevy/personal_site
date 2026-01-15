import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { LoaderService } from '../../services/admin-loader.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private supabase: SupabaseService, private router: Router, private loaderService: LoaderService) {
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    this.loaderService.setLoading(true);
    try {
      // Use getSession instead of getUser to check for local session existence.
      // This prevents blocking offline/cached users and avoids unnecessary network calls on navigation.
      const { data } = await this.supabase.getSession();
      const session = data?.session;

      if (!session) {
        console.warn('Access denied: No active session');
        this.router.navigate([ '/login' ], { queryParams: { returnUrl: state.url } });
        return false;
      }

      // Allow access if the session exists
      return true;
    } catch (err) {
      console.error('Unexpected error in AuthGuard:', err);
      this.router.navigate([ '/login' ], { queryParams: { returnUrl: state.url } });
      return false;
    } finally {
      this.loaderService.setLoading(false); // Stop loader
    }
  }
}
