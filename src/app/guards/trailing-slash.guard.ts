import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TrailingSlashGuard implements CanActivate {
  constructor(private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url = state.url;

    if (url.endsWith('/')) {
      // Remove the trailing slash and navigate to the corrected URL
      const newUrl = url.slice(0, -1);
      this.router.navigateByUrl(newUrl, { replaceUrl: true });
      return false;
    }

    return true;
  }
}
